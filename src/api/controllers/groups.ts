import Group from "../../shared/structures/Group.js";
import { Request, Response } from "express";
import BaseOGroup from "../../shared/structures/OGroup.js";
import BaseZGroup from "../../shared/structures/ZGroup.js";
import { FoE } from "../../shared/lib/APIConvertor.js";
import { LRUCache } from "lru-cache";


// TODO: возможно стоит вынести в отдельную структуру
class Cache {
    static _groups: LRUCache<string, BaseOGroup | BaseZGroup> = new LRUCache({
        ttl: 1000 * 60 * 60 * 24 * 7, // неделя
        ttlAutopurge: true,
    })

    static async getGroup(name: string) {
        let group = this._groups.get(name);

        if (group) return group
        else {
            let groups = await Group.getAndStoreGroupsList();

            if (!groups) return undefined;

            let groupInfo = groups.find(g => g.name == name);

            if (!groupInfo) return undefined;

            group = groupInfo.FoE == FoE.ofo ? new BaseOGroup(groupInfo.name, groupInfo.fakId) : new BaseZGroup(groupInfo.name, groupInfo.fakId);

            this._groups.set(name, group);

            return group.init();
        }
    }
}


export async function getGroupsList(_req: Request, res: Response) {
    let data = await Group.getAndStoreGroupsList();

    res.json({ data, isok: true }); // TODO: добавить source
}

export async function getGroupInfo(req: Request, res: Response) {
    const { name } = req.params;

    if (!name) return res.json({ isok: false, msg: 'Где name?' });

    let group = await Cache.getGroup(name.toString());

    if (!group) return res.json({ isok: false, msg: 'Произошла ошибка во время получения группы' });

    let gi = await group.getGroupInfo();

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

    if (!name) return res.json({ isok: false, msg: 'Где name?' });

    let group = await Cache.getGroup(name.toString());

    if (!group) return res.json({ isok: false, msg: 'Произошла ошибка во время получения группы' });

    let data
    if (year && sem) data = await group.getTimetable({ year: +year, sem: +sem });
    else data = await group.getTimetable();

    return res.json({ isok: true, data });
}

export async function getGroupExams(req: Request, res: Response) {
    const { name } = req.params;
    const { year, sem } = req.query;

    if (!name) return res.json({ isok: false, msg: 'Где name?' });

    let group = await Cache.getGroup(name.toString());

    if (!group) return res.json({ isok: false, msg: 'Произошла ошибка во время получения группы' });

    let data = await group.getAndStoreExams();

    return res.json({ isok: true, data });
}
