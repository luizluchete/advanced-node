import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({ email: email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, email, name, facebookId }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    let resultId: string
    if (id === undefined) {
      const pgUser = await this.pgUserRepo.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await this.pgUserRepo.update({ id: parseInt(id) }, { name, facebookId })
    }

    return { id: resultId }
  }
}
