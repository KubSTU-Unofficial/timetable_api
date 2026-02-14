import { Express } from "express";
import { groupsRoutes } from "../api/routes/groups.js";

export function registerRoutes(app: Express) {
    app.use("/groups", groupsRoutes);
}

