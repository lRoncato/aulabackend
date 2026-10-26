import knex, { type Knex } from "knex"
export const config: Knex.Config = {
  client: "better-sqlite3",
  connection: {
    filename: "./db.sqlite"
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./src/shared/database/migrations"
  },
}
export const connection = knex(config)