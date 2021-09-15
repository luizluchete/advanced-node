import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken, FacebookAccount } from '@/domain/models'
import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repos'

export class FacebookAuthenticationService implements FacebookAuthentication {
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
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AcessToken.expirationInMs })
      return new AcessToken(token)
    }
    return new AuthenticationError()
  }
}
