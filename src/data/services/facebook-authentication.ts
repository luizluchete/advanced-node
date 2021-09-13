import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken, FacebookAccount } from '@/domain/models'
import { LoadFacebookUserApi } from '../contracts/apis'
import { TokenGenerator } from '../contracts/crypto'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser({ token: params.token })
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
      await this.crypto.generateToken({ key: id, expirationInMs: AcessToken.expirationInMs })
    }
    return new AuthenticationError()
  }
}
