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
    userId: string 
    timestampSent: Date = new Date()
    sessionState: string
  }

  export interface IChatTable {
    id: number
    messageText: string
    userId: string 
    timestampSent: Date = new Date()
    sessionState: string
  }

  export type Chat = Selectable<PersonTable>
  export type NewChat = Insertable<PersonTable>
  export type ChatUpdate = Updateable<PersonTable>