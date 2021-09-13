
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { IBackup } from 'pg-mem'

import { getRepository, Repository, getConnection } from 'typeorm'
import { makeFabeDb } from '../mocks'

describe('PgUserAccountRepository', () => {
  describe('Load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFabeDb()
      backup = db.backup()
      pgUserRepo = getRepository(PgUser)
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()
      sut = new PgUserAccountRepository()
    })
    it('Should return an account if exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('Should return undefied if email does not exists', async () => {
      const account = await sut.load({ email: 'existing_email' })

      expect(account).toBeUndefined()
    })
  })
})
