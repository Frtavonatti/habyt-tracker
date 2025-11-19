import { DataTypes, literal } from "sequelize"
import type { QueryInterface } from "sequelize"

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
  
  await queryInterface.createTable("entries", {
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
    },
    habytId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "habyts", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  })

  await queryInterface.addConstraint("entries", {
    fields: ["habytId", "date"],
    type: "unique",
    name: "entries_habytId_date_unique",
  })
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.dropTable("entries")
}