import { AuthenticationError } from '@/domain/errors'
import { AcessToken, FacebookAccount } from '@/domain/models'
import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repos'

type Setup = (facebookApi: LoadFacebookUserApi, userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository, crypto: TokenGenerator) => FacebookAuthentication

export type FacebookAuthentication = (params: { token: string }) => Promise<AcessToken | AuthenticationError>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepo, crypto) => async params => {
  const fbData = await facebookApi.loadUser({ token: params.token })
  if (fbData !== undefined) {
    const accountData = await userAccountRepo.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
    const token = await crypto.generateToken({ key: id, expirationInMs: AcessToken.expirationInMs })
    return new AcessToken(token)
  }
  return new AuthenticationError()
}
