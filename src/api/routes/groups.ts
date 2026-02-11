import { Router } from "express";
import { getGroupsList, getGroupTimetable } from "../controllers/groups.js";

export const groupsRoutes = Router();

groupsRoutes.get("/", getGroupsList);
groupsRoutes.get("/:name/timetable", getGroupTimetable);
