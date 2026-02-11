import { Express } from "express";
import { testRoutes } from "../api/routes/test.js";
import { groupsRoutes } from "../api/routes/groups.js";

export function registerRoutes(app: Express) {
    app.use("/test", testRoutes);
    app.use("/groups", groupsRoutes);
}

