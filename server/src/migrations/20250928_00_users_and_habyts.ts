import { DataTypes, literal } from "sequelize"
import type { QueryInterface } from "sequelize"

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.createTable("users", {
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
      // validate: { isEmail: true}, Note: Validation is typically handled at the model level, not in migrations
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
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

  await queryInterface.createTable("habyts", {
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
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
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
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.dropTable("habyts")
  await queryInterface.dropTable("users")
}