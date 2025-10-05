import { DataTypes, Model, literal} from "sequelize"
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize"

import { sequelize } from "../db/index.js"
import type { User } from "./index.js"

export class Habyt extends Model<
  InferAttributes<Habyt>,
  InferCreationAttributes<Habyt>
> {
  declare id: CreationOptional<string>
  declare title: string
  declare description: string | null
  declare userId: ForeignKey<User["id"]>
  // declare createdAt: CreationOptional<Date>
  // declare updatedAt: CreationOptional<Date>
}

Habyt.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: literal('gen_random_uuid()'),
      unique: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Habyt",
    tableName: "habyts",
    timestamps: true,
  }
)

export default Habyt