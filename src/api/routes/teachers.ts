import { Router } from "express";
import { getTeachersList, getTeacherInfo, getTeacherTimetable } from "../controllers/teachers.js";

export const teachersRoutes = Router();

teachersRoutes.get("/", getTeachersList);
teachersRoutes.get("/:name", getTeacherInfo);
teachersRoutes.get("/:name/timetable", getTeacherTimetable)
