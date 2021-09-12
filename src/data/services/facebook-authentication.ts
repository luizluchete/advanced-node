import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/apis'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    return new AuthenticationError()
  }
}
