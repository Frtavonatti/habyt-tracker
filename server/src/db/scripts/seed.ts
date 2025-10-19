import { Habyt, User, Entry } from "../../models/index.js"
import { toDateOnlyUTC } from "../../utils/toDateOnly.js"

async function seed() {
  // await sequelize.sync({ force: true }) This will drop tables and recreate them

  const user = await User.create({
    name: "Test User",
    username: "testuser",
    email: "testuser@example.com",
    passwordHash: "hashedpassword",
  })

  const habyts = await Habyt.bulkCreate([
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

  const today = new Date()
  const todayUTC = toDateOnlyUTC(today)
  const tomorrowUTC = toDateOnlyUTC(new Date(today.getTime() + 24 * 60 * 60 * 1000))

  await Entry.bulkCreate([
    {
      date: todayUTC,
      completed: true,
      habytId: habyts[0]!.id,
    },
    {
      date: tomorrowUTC,
      completed: false,
      habytId: habyts[0]!.id,
    },
  ], { validate: true })
  
  console.log("Seeding complete.")
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error)
  })
  .finally(() => {
    process.exit()
  })