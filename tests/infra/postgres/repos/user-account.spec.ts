
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { IBackup } from 'pg-mem'

import { getRepository, Repository, getConnection } from 'typeorm'
import { makeFabeDb } from '../mocks'

describe('PgUserAccountRepository', () => {
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

  describe('Load', () => {
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

  describe('SaveWithFacebook', () => {
    it('Should create an account if id is undefied', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const pgUser = await pgUserRepo.findOne({ email: 'any_email' })

      expect(pgUser?.id).toBe(1)
      expect(id).toBe('1')
    })
  })

  describe('SaveWithFacebook', () => {
    it('Should update an account if id exists', async () => {
      await pgUserRepo.save({ email: 'any_email' })

      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })

      const pgUser = await pgUserRepo.findOne({ id: 1 })

      expect(pgUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })
})
