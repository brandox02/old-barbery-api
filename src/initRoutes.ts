import { Express, Router } from "express";
import authRoutes from "./controllers/auth/routes";

export default function initRoutes(app: Express) {
  app.use(authRoutes(Router()));
}
