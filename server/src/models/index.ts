import User from "./user.js"
import Habyt from "./habyt.js"

// Define associations
User.hasMany(Habyt, { foreignKey: "userId", as: "habyts" })
Habyt.belongsTo(User, { foreignKey: "userId", as: "user" })

export { User, Habyt }