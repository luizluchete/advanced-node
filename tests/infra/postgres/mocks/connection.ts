import { IMemoryDb, newDb } from 'pg-mem'

export const makeFabeDb = async (): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: ['src/infra/postgres/entities/index.ts']
  })

  // create schema
  await connection.synchronize()
  return db
}
