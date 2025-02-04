"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require(__dirname + "/../config/config.json")["development"];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false, // Optional: Disable logging for clean console output
  });
}

// Ensure models are imported correctly
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const modelImport = require(path.join(__dirname, file));

    // Ensure the imported module is a function before calling it
    if (typeof modelImport === "function") {
      const model = modelImport(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      console.error(`Error loading model: ${file}. Exported module is not a function.`);
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
