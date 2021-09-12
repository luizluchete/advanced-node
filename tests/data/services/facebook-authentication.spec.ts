import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserByTokenApi: MockProxy<LoadFacebookUserApi>
}
const makeSut = (): SutTypes => {
  const loadFacebookUserByTokenApi = mock<LoadFacebookUserApi>()

  const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
  return { sut, loadFacebookUserByTokenApi }
}

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserByTokenApi } = makeSut()
    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserByTokenApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserByTokenApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut } = makeSut()
    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
