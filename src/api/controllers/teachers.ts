import { Request, Response } from "express";
import Cache from "../../app/cache.js";
import BaseTeacher from "../../shared/structures/Teacher.js";

function error(res: Response, code: number, msg?: string) {
    res.status(code);
    return res.json({ isok: false, msg });
}

export async function getTeachersList(req: Request, res: Response) {
    let searchString = req.query.search;

    if (!searchString) {
        let data = await BaseTeacher.getTeachersList();

        if (!data) return error(res, 503, 'Произошла ошибка во время получения списка преподавателей')

        return res.json({ data, isok: true });
    } else {
        let data = await BaseTeacher.searchTeacher(searchString.toString());

        if (!data.length) return error(res, 404, "Преподаватель не найден");

        return res.json({ isok: true, data });
    }
}

export async function getTeacherInfo(req: Request, res: Response) {
    const { name } = req.params;

    let teacher = await Cache.getTeacher(name.toString());
    if (!teacher) return error(res, 404, "Преподаватель не найден");

    return res.json({ isok: true, data: { name: teacher.name } });
}

export async function getTeacherTimetable(req: Request, res: Response) {
    const { name } = req.params;
    const dateString = req.query.date;

    let date: Date;
    if (!dateString) date = new Date();
    else {
        date = new Date(dateString.toString());

        if (isNaN(date.getTime())) return error(res, 400, "Дата инвалид");
    }

    let teacher = await Cache.getTeacher(name.toString());
    if (!teacher) return error(res, 404, "Преподаватель не найден");

    let tt = await teacher.getAndStoreDayTimetable(date);

    return res.json({ isok: true, data: tt });
}
