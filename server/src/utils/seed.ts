import { Habyt, User } from "../models/index.js"

async function seed() {
  // await sequelize.sync({ force: true }) This will drop tables and recreate them

  const user = await User.create({
    name: "Test User",
    username: "testuser",
    email: "testuser@example.com",
    passwordHash: "hashedpassword",
  })

  await Habyt.bulkCreate([
    {
      title: "Test Habyt",
      description: "This is a test habyt.",
      userId: user.id,
    },
    {
      title: "Another Habyt",
      description: "This is another test habyt.",
      userId: user.id,
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