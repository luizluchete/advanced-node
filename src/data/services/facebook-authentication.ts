import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/apis'
import { LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData.email })
    }

    return new AuthenticationError()
  }
}
