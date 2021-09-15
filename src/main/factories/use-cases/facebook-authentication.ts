
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { FacebookAuthenticationUseCase } from '@/domain/use-cases'

export const makeFacebookAuthenticate = (): FacebookAuthenticationUseCase => {
  const jwtTokenGenerator = makeJwtTokenGenerator()
  const pgUserAccountRepo = makePgUserAccountRepository()
  const fbApi = makeFacebookApi()
  return new FacebookAuthenticationUseCase(fbApi, pgUserAccountRepo, jwtTokenGenerator)
}
