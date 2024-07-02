import {
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
  } from 'kysely'
  
  export interface Database {
    tbchat: ChatTable
  }
  
  export interface ChatTable {
    id: Generated<number>
  
    messageText: string
    userId: 'man' | 'woman' | 'other'
    timestamp_sent: Date = new Date()
    session_state: 'active' | 'inactive'
  }

  export type Chat = Selectable<PersonTable>
  export type NewChat = Insertable<PersonTable>
  export type ChatUpdate = Updateable<PersonTable>