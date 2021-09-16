
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeJwtTokenHandler } from '@/main/factories/crypto'
import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/use-cases'

export const makeFacebookAuthenticate = (): FacebookAuthentication => {
  const JwtTokenHandler = makeJwtTokenHandler()
  const pgUserAccountRepo = makePgUserAccountRepository()
  const fbApi = makeFacebookApi()
  return setupFacebookAuthentication(fbApi, pgUserAccountRepo, JwtTokenHandler)
}
