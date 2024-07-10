import { Kysely, sql } from 'kysely'
import { Database } from '../models/database'

export async function up(db: Kysely<Database>): Promise<void> {
    console.log('Creating tbchat table')
  await db.schema
    .createTable('tbchat')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('messageText', 'varchar(120)', (col) => col.notNull())
    .addColumn('userId', 'varchar(36)', (col) => col.notNull())
    .addColumn('sessionState', 'varchar(8)', (col) => col.notNull().defaultTo('active'))
    .addColumn('timestampSent', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('tbchat').execute()
}