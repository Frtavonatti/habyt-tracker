import { DataTypes, Model, literal } from "sequelize"
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize"

import { sequelize } from "../db/index.js"
import type Habyt from "./habyt.js"

class Entry extends Model<
  InferAttributes<Entry, { omit: 'createdAt' | 'updatedAt' }>,
  InferCreationAttributes<Entry>
> {
  declare id: CreationOptional<string>
  declare date: string // YYYY-MM-DD (DateOnly)
  declare completed: boolean
  declare timeSpentMinutes: number | null
  declare habytId: ForeignKey<Habyt["id"]>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Entry.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: literal('gen_random_uuid()'),
      unique: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    timeSpentMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 },
    },
    habytId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Entry",
    tableName: "entries",
    timestamps: true,
  }
)

export default Entry