import { sequelize } from "./db.js"
import { Habyt, User } from "../models/index.js"

async function seed() {
  await sequelize.sync({ force: true }) // This will drop tables and recreate them

  const user = await User.create({
    id: 1,
    name: "Test User",
    username: "testuser",
    email: "testuser@example.com",
    passwordHash: "hashedpassword",
  })

  await Habyt.bulkCreate([
    {
      id: 1,
      title: "Test Habyt",
      description: "This is a test habyt.",
      userId: user.getDataValue("id"),
    },
    {
      id: 2,
      title: "Another Habyt",
      description: "This is another test habyt.",
      userId: user.getDataValue("id"),
    },
  ])

  console.log("Seeding complete.")
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error)
  })
  .finally(() => {
    process.exit()
  })