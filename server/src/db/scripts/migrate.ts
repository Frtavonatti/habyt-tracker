import { runMigrations } from "../migrations.js"

try {
  await runMigrations()
} catch (error) {
  console.error("Error running migrations:", error)
}
