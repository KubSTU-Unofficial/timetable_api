import Group from "../../shared/structures/Group.js";
import { Request, Response } from "express";
import APIConvertor from "../../shared/lib/APIConvertor.js";
import Cache from "../../app/cache.js";

export async function getGroupsList(_req: Request, res: Response) {
    let data = await Group.getAndStoreGroupsList();

    if (!data) {
        res.status(503);
        return res.json({ isok: false, msg: 'Произошла ошибка во время получения группы (сервер ВУЗа недоступен)' })
    }

    res.json({ data, isok: true }); // TODO: добавить source
}

export async function getGroupInfo(req: Request, res: Response) {
    const { name } = req.params;

    if (!name) {
        res.status(400);
        return res.json({ isok: false, msg: 'Где name?' });
    }

    let group = await Cache.getGroup(name.toString());

    if (!group) {
        if (!APIConvertor.isAPIWorks) {
            res.status(503);
            return res.json({ isok: false, msg: 'Произошла ошибка во время получения группы (сервер ВУЗа недоступен)' })
        } else {
            res.status(404)
            return res.json({ isok: false, msg: 'Группа не найдена' });
        }
    }

    let gi = await group.getAndStoreGroupInfo();

    let data = {
        fakId: group.instId,
        year: group.kurs,
        time: {
            sem: gi.sem,
            year: gi.year,
            lessonsPeriod: gi.lessonsPeriod,
        }
    }

    return res.json({ isok: true, data });
}

export async function getGroupTimetable(req: Request, res: Response) {
    const { name } = req.params;
    const { year, sem } = req.query;

    if (!name) {
        res.status(400);
        return res.json({ isok: false, msg: 'Где name?' });
    }

    let group = await Cache.getGroup(name.toString());

    if (!group) {
        if (!APIConvertor.isAPIWorks) {
            res.status(503);
            return res.json({ isok: false, msg: 'Произошла ошибка во время получения группы (сервер ВУЗа недоступен)' })
        } else {
            res.status(404)
            return res.json({ isok: false, msg: 'Группа не найдена' });
        }
    }

    let data
    if (year && sem) data = await group.getTimetable({ year: +year, sem: +sem });
    else data = await group.getTimetable();

    return res.json({ isok: true, data });
}

export async function getGroupExams(req: Request, res: Response) {
    const { name } = req.params;
    // const { year, sem } = req.query;

    if (!name) {
        res.status(400);
        return res.json({ isok: false, msg: 'Где name?' });
    }

    let group = await Cache.getGroup(name.toString());

    if (!group) {
        if (!APIConvertor.isAPIWorks) {
            res.status(503);
            return res.json({ isok: false, msg: 'Произошла ошибка во время получения группы (сервер ВУЗа недоступен)' })
        } else {
            res.status(404)
            return res.json({ isok: false, msg: 'Группа не найдена' });
        }
    }

    let data = await group.getAndStoreExams();

    return res.json({ isok: true, data });
}
