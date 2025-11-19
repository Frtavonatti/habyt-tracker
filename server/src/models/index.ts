import User from "./user.js"
import Habyt from "./habyt.js"
import Entry from "./entry.js"

// Define associations
User.hasMany(Habyt, { foreignKey: "userId", as: "habyts" })
Habyt.belongsTo(User, { foreignKey: "userId", as: "user" })

Entry.belongsTo(Habyt, { foreignKey: "habytId", as: "habyt" })
Habyt.hasMany(Entry, { foreignKey: "habytId", as: "entries" })

export { User, Habyt, Entry }