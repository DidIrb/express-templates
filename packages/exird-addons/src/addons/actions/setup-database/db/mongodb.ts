import chalk from "chalk"
import fs from "fs-extra"
import { Listr } from "listr2"
import path from "path"
import { ExirdConfig } from "../../../../types"
import { configPath, execPromise, updateENV } from "../../shared/utils"
import { updateEntryFile } from "../utils"

const setupMongoDBEnv = () => {
  const environments = ["DEVELOPMENT", "TEST", "STAGING", "PRODUCTION"]
  const newVariables = {
    MONGO_URI: "mongodb+srv://<username>:<password>@cluster0.mongodb.net/database?retryWrites=true&w=majority",
  }
  updateENV(".env", environments, newVariables)
}

const installPackages = (packageManager: string) => {
  const packages = ["mongoose"]
  return execPromise(`${packageManager} install ${packages.join(" ")}`)
}

const createDBFile = (config: ExirdConfig) => {
  let content = ""
  if (config.language === "TypeScript") {
    content = `
import mongoose from 'mongoose';
import config from './config';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongo_uri, {
      maxPoolSize: 10,
      ssl: true,
    } as mongoose.ConnectOptions);
    await mongoose.connect(config.mongo_uri);
    await mongoose.connection.db?.admin().command({ ping: 1 });
    console.log('Pinged, successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection failed:', (err as Error).message);
    process.exit(1);
  }
};

export default connectDB;
    `.trim()
  } else if (config.language === "JavaScript" && config.format === "ES6") {
    content = `
import mongoose from 'mongoose';
import config from './config';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo_uri, {
      maxPoolSize: 10,
      ssl: true,
    });
    await mongoose.connect(config.mongo_uri);
    await mongoose.connection.db?.admin().command({ ping: 1 });
    console.log('Pinged, successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
    `.trim()
  } else if (config.language === "JavaScript" && config.format === "CommonJS") {
    content = `
const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo_uri, {
      maxPoolSize: 10,
      ssl: true,
    });
    await mongoose.connect(config.mongo_uri);
    await mongoose.connection.db?.admin().command({ ping: 1 });
    console.log('Pinged, successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
    `.trim()
  }

  let file = ""
  if (config.language === "TypeScript") {
    file = "src/db.ts"
  } else {
    file = "src/db.js"
  }
  const filePath = path.resolve(process.cwd(), file)
  return fs.promises.writeFile(filePath, content.trim())
}

// Setup MongoDB task
export const setupMongoDB = {
  name: "setupMongoDB",
  description: "Setup MongoDB environment variables and configurations.",
  execute: async () => {
    const config: ExirdConfig = fs.readJsonSync(configPath)
    console.log(chalk.cyan("MSG"), "Only Mongoose supported!, More Features Pending...")
    const tasks = new Listr([
      {
        title: "Installing packages",
        task: () => installPackages(config.packageManager),
      },
      {
        title: "Creating db file",
        task: () => createDBFile(config),
      },
      {
        title: "Setting environment variables",
        task: setupMongoDBEnv,
      },
      {
        title: "Updating entry file",
        task: () => updateEntryFile(config),
      },
    ])

    await tasks.run()
    console.log("MongoDB setup completed.")
  },
}
