import express from "express";
import { registerRoutes } from "./routes.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";

export function createServer() {
    const app = express();

    app.use(express.json());

    registerRoutes(app);

    app.use(errorMiddleware);

    return app;
}

