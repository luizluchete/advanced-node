import { Controller } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { AcessToken } from '@/domain/models'
import { ValidationComposite } from '@/application/validation/'
import { mocked } from 'ts-jest/utils'
import { httpResponse } from '../helpers'

jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
  result: httpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async execute (httpRequest: any): Promise<httpResponse> {
    return this.result
  }
}

describe('FacebookLoginController', () => {
  let facebookAuth: jest.Mock
  let sut: ControllerStub

  beforeAll(() => {
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue(new AcessToken('any_value'))
  })

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle('any_value')

    expect(ValidationComposite).toHaveBeenCalledWith([])

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('Should return 500 if Authentication throws', async () => {
    const error = new Error('execute_error')
    jest.spyOn(sut, 'execute').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  it('Should return same result as execute', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
