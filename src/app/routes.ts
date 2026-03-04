import { Express } from "express";
import { groupsRoutes } from "../api/routes/groups.js";
import { teachersRoutes } from "../api/routes/teachers.js";

export function registerRoutes(app: Express) {
    app.use("/groups", groupsRoutes);
    app.use("/teachers", teachersRoutes);
}

