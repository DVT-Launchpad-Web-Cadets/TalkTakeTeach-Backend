import { Database } from './models/database'
import {Pool} from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB,
    host: 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.POSTGRES_PASSWORD,
    connectionString: process.env.DATABASE_URL,
    port: 5432,
    max: 10,
  })
})

export const db = new Kysely<Database>({
  dialect,
})