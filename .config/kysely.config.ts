import { db } from '../src/dbConnect'
import { defineConfig } from "kysely-ctl";

export default defineConfig({
  kysely: db,
  migrations: { 
    migrationFolder:  'src/database/migrations', 

  }
});