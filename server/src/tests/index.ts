import { sequelize } from "../utils/db.js"
import { after } from "node:test"

// Database setup
console.log("[tests] Syncing database (force: true)...")
await sequelize.sync({ force: true })
console.log("[tests] Database ready")

// Main test orchestration
async function runTests () {
  console.log("[tests] Running login tests...")
  await import("./login.test.js")
  
  console.log("[tests] Running user tests...")
  await import("./users.test.js")

  console.log("[tests] Running habyts tests...")
  await import("./habyts.test.js")
  
  // Clean up after all tests
  after(async () => {
    try {
      console.log("[tests] Closing sequelize connection...")
      await sequelize.close()
      console.log("[tests] Connection closed")
    } catch (e) {
      console.error("[tests] Error closing sequelize", e)
    } finally {
      console.log("[tests] All tests completed")
    }
  })
}

runTests()