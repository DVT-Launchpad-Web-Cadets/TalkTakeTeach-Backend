import { Database } from './models/database'
import {Pool} from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB,
    host: process.env.DATABASE_URL || 'localhost',
    user: process.env.DATABASE_USER,
    port: 5432,
    max: 10,
  })
})

export const db = new Kysely<Database>({
  dialect,
})