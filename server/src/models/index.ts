import User from "./user.js"
import Habyt from "./habyt.js"

// Define associations
User.hasMany(Habyt)
Habyt.belongsTo(User)

export { User, Habyt }