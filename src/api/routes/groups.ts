import { Router } from "express";
import { getGroupsList, getGroupInfo, getGroupTimetable, getGroupExams } from "../controllers/groups.js";

export const groupsRoutes = Router();

groupsRoutes.get("/", getGroupsList);
groupsRoutes.get("/:name/", getGroupInfo);
groupsRoutes.get("/:name/timetable", getGroupTimetable);
groupsRoutes.get("/:name/exams", getGroupExams);
