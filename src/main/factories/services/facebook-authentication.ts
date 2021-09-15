
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { FacebookAuthenticationService } from '@/domain/services'

export const makeFacebookAuthenticateService = (): FacebookAuthenticationService => {
  const jwtTokenGenerator = makeJwtTokenGenerator()
  const pgUserAccountRepo = makePgUserAccountRepository()
  const fbApi = makeFacebookApi()
  return new FacebookAuthenticationService(fbApi, pgUserAccountRepo, jwtTokenGenerator)
}
