import { Express } from "express";
import { testRoutes } from "../api/test/test.routes.js";

export function registerRoutes(app: Express) {
    app.use("/test", testRoutes);
}

