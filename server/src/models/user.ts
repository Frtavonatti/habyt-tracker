import { DataTypes, Model, literal } from "sequelize"
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize"

import { sequelize } from "../utils/db.js"

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>
  declare name: string
  declare username: string
  declare email: string
  declare passwordHash: string
  // declare createdAt: CreationOptional<Date>
  // declare updatedAt: CreationOptional<Date>
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: literal('gen_random_uuid()'),
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
)

export default User