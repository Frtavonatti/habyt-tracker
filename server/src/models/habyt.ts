import { sequelize } from "../utils/db.js"

import { DataTypes, Model } from "sequelize"

interface HabytAttributes {
  id: number
  title: string
  description: string
  userId: number
}

class Habyt extends Model<HabytAttributes> {}

Habyt.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
      type: DataTypes.INTEGER,
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