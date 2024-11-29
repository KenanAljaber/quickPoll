import { DataTypes, Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let sequelizeInstance: Sequelize | null = null;
let isConnected = false;
dotenv.config({ path: ".env" });
export default async function initializeModels(connect = true) {

  if(!sequelizeInstance && !isConnected) {
    sequelizeInstance = new Sequelize({
    host: process.env.DATABASE_HOST || "",
    port: parseInt(process.env.DATABASE_PORT || "5432"), // Default port for PostgreSQL
    database: process.env.DATABASE_NAME || "",
    username: process.env.DATABASE_USERNAME || "",
    password: process.env.DATABASE_PASSWORD || "",
    dialect: process.env.DATABASE_DIALECT as any || "postgres",
    logging: true,
  });
  if (connect) {
    try {
      await sequelizeInstance.authenticate();
      isConnected = true;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error; // Rethrow the error if the connection fails
    }
  }
}

  const database: any = {};
  const modelsPath = path.join(__dirname, "models");


  fs.readdirSync(modelsPath).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const model = require(path.join(modelsPath, file)).default;
      if (typeof model === "function") {
        const initializedModel = model(sequelizeInstance, DataTypes);
        database[initializedModel.name] = initializedModel;
      }
    }
  });


  Object.keys(database).forEach((modelName) => {
    if (typeof database[modelName].associate === "function") {
      database[modelName].associate(database);
    }
  });

  database.sequelize = sequelizeInstance;
  database.Sequelize = Sequelize;

  return database;
}
