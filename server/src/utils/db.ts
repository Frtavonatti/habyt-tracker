import { Sequelize } from "sequelize"

import { DATABASE_URL, TEST_DATABASE_URL, DEV_DATABASE_URL } from "./config.js"

function getDbUrl(): string {
  switch (process.env.NODE_ENV) {
    case "production":
      if (!DATABASE_URL) throw new Error("DATABASE_URL is not defined.")
      return DATABASE_URL
    case "test":
      if (!TEST_DATABASE_URL) throw new Error("TEST_DATABASE_URL is not defined.")
      return TEST_DATABASE_URL
    case "development":
    default:
      if (!DEV_DATABASE_URL) throw new Error("DEV_DATABASE_URL is not defined.")
      return DEV_DATABASE_URL
  }
}

const dbUrl = getDbUrl()

export const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
})

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log(`Connection to the ${process.env.NODE_ENV} database has been established successfully.`)
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}
