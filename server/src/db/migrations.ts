import path from "path"
import { fileURLToPath } from "url"
import { sequelize } from "./index.js"
import { Umzug, SequelizeStorage } from "umzug"

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const migrationPath = path.join(__dirname, "../db/migrations/*.ts")

const migrationConf = {
  migrations: {
    glob: migrationPath,
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

export const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name)
  })
}