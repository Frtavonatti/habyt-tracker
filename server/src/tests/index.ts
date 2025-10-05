import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { after } from "node:test"

import { sequelize } from "../db/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database setup
console.log("[tests] Syncing database (force: true)...")
await sequelize.sync({ force: true })
console.log("[tests] Database ready")

// Main test orchestration
async function runTests () {
  const testFiles = [
    "login.test.js",
    "users.test.js",
    "habyts.test.js"
  ]

  for (const file of testFiles) {
    console.log(`[tests] Running ${file.replace('.js', '')}...`)
    const fileUrl = pathToFileURL(path.join(__dirname, file)).href
    await import(fileUrl)
  }
  
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