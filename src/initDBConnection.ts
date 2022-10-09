import { DataSource } from "typeorm";
import dotenv from "dotenv";
// import path from "path";
import Haircut from "./entities/Haircut";
import Schedule from "./entities/Schedule";
import User from "./entities/User";
import GeneralParameter from "./entities/GeneralParameter";
import WorkScheduleDay from "./entities/WorkScheduleDay";
import WorkInterval from "./entities/WorkInterval";

export let appDataSource: DataSource | null = null;

export default async function initDBConnection() {
  dotenv.config();
  const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || ""),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,

    entities: [
      Haircut,
      Schedule,
      User,
      GeneralParameter,
      WorkScheduleDay,
      WorkInterval
      // path.join(__dirname, "./entities/*.js"),
    ],
  });
  await AppDataSource.initialize();

  appDataSource = AppDataSource;

  return AppDataSource;
}
