import { runMigrations } from "./db.js"

try {
  await runMigrations()
} catch (error) {
  console.error("Error running migrations:", error)
}
