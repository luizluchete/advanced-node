import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { newDb } from 'pg-mem'

import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm'

class PgUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'users' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true })
  facebookId?: string
}

describe('PgUserAccountRepository', () => {
  describe('Load', () => {
    it('Should return an account if exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      // create schema
      await connection.synchronize()

      // => you now can use your typeorm connection !

      const sut = new PgUserAccountRepository()
      const pgUserRepo = getRepository(PgUser)
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })
  })
})
