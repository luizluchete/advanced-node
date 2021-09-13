import { FacebookAuthentication } from '@/domain/features'
import { mock, MockProxy } from 'jest-mock-extended'

class FacebookLoginController {
  constructor (private readonly facebookAuth: FacebookAuthentication) {}
  async handle (httpRequest: any): Promise<httpResponse> {
    await this.facebookAuth.execute({ token: httpRequest.token })
    return {
      statusCode: 400,
      data: new Error('the field token is required')
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
})
