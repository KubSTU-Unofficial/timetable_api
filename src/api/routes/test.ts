import { Router } from "express";
import { getTest } from "../controllers/test.js";

export const testRoutes = Router();

testRoutes.get("/", getTest);

