import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'chunee.db.elephantsql.com',
  port: 5432,
  username: 'tifgkdhh',
  password: 'ZSMHJiNU53WtwemlKz9DdBobmg07x9Ru',
  database: 'tifgkdhh',
  entities: ['dist/infra/postgres/entities/index.js'],
  synchronize: true

}
