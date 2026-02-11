import Group from "../../shared/structures/Group.js";
import { Request, Response } from "express";
import BaseOGroup from "../../shared/structures/OGroup.js";
import BaseZGroup from "../../shared/structures/ZGroup.js";
import { FoE } from "../../shared/lib/APIConvertor.js";

export async function getGroupsList(_req: Request, res: Response) {
    let data = await Group.getAndStoreGroupsList();

    res.json({ data, isok: true }); // TODO: добавить source
}

export async function getGroupTimetable(req: Request, res: Response) {
    const { name } = req.params;
    const { year, sem } = req.query;

    let groupsList = await Group.getAndStoreGroupsList();

    if (!groupsList?.length) return res.json({ isok: false, msg: "Произошла ошибка при получении списка групп" });

    let groupInfo = groupsList.find(g => g.name == name);
    console.log(groupInfo);
    if (!groupInfo) return res.json({ isok: false, msg: "Такой группы нет" });

    let group: Group = groupInfo.fakId == FoE.ofo ? new BaseOGroup(groupInfo.name, groupInfo.fakId) : new BaseZGroup(groupInfo.name, groupInfo.fakId);

    let data
    if (year && sem) data = await group.getTimetable({ year: +year, sem: +sem });
    else data = group.getTimetable();

    return res.json({ isok: true, data });
}
