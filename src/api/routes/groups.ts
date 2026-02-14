import { Router } from "express";
import { getGroupsList, getGroupInfo, getGroupTimetable } from "../controllers/groups.js";

export const groupsRoutes = Router();

groupsRoutes.get("/", getGroupsList);
groupsRoutes.get("/:name/", getGroupInfo);
groupsRoutes.get("/:name/timetable", getGroupTimetable);
