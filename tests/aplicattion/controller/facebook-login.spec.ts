import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

class ServerError extends Error {
  constructor (error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (httpRequest: any): Promise<httpResponse> {
    try {
      const { token } = httpRequest
      if (token === '' || token === null || token === undefined) {
        return {
          statusCode: 400,
          data: new Error('the field token is required')
        }
      }

      const result = await this.facebookAuthentication.execute({ token: httpRequest.token })
      if (result instanceof AcessToken) {
        return {
          statusCode: 200,
          data: {
            acessToken: result.value
          }
        }
      } else {
        return {
          statusCode: 401,
          data: result
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error as Error)
      }
    }
  }
}

type httpResponse = {
  statusCode: number
  data: any
}

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>
  let sut: FacebookLoginController

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.execute.mockResolvedValue(new AcessToken('any_value'))
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('Should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('Should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('Should return 400 if token is undefied', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('Should call FacebooAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.execute).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.execute).toHaveBeenCalledTimes(1)
  })

  it('Should return 401 if Authentication fails', async () => {
    facebookAuth.execute.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })

  it('Should return 200 if Authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        acessToken: 'any_value'
      }
    })
  })

  it('Should return 500 if Authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.execute.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
