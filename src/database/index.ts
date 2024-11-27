import { DataTypes, Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
export default async function initializeModels(connect = true) {
  dotenv.config({ path: ".env" });
  console.log("Initializing database models...");
  console.log("password", process.env.DATABASE_PASSWORD);

  const sequelize = new Sequelize({
    host: process.env.DATABASE_HOST || "",
    port: parseInt(process.env.DATABASE_PORT || "5432"), // Default port for PostgreSQL
    database: process.env.DATABASE_NAME || "",
    username: process.env.DATABASE_USERNAME || "",
    password: process.env.DATABASE_PASSWORD || "",
    dialect: "postgres",
    logging: false,
  });
  if (connect) {
    try {
      await sequelize.authenticate();
      console.log(
        "Connection to the database has been established successfully."
      );
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error; // Rethrow the error if the connection fails
    }
  }

  const database: any = {};
  const modelsPath = path.join(__dirname, "models");

  // Dynamically load all model files
  fs.readdirSync(modelsPath).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const model = require(path.join(modelsPath, file)).default;
      if (typeof model === "function") {
        const initializedModel = model(sequelize, DataTypes);
        database[initializedModel.name] = initializedModel;
      }
    }
  });

  // Associate models if needed
  Object.keys(database).forEach((modelName) => {
    if (typeof database[modelName].associate === "function") {
      database[modelName].associate(database);
    }
  });

  // Attach sequelize instance to the database object
  database.sequelize = sequelize;
  database.Sequelize = Sequelize;

  return database;
}
