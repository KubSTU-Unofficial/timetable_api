import { Router } from "express";
import { getTest } from "./test.controller.js";

export const testRoutes = Router();

testRoutes.get("/", getTest);

