import { sequelize } from "../index.js"

const dropTables = async () => {
  try {
    await sequelize.getQueryInterface().dropAllTables()
  } catch (error) {
    console.error("Error dropping tables:", error)
  } finally {
    await sequelize.close()
  }
}

dropTables()
  .then(() => {
    console.log("All tables dropped successfully.")
  })
  .catch((error) => {
    console.error("Error executing drop tables script:", error)
  })
  .finally(() => {
    process.exit()
  })