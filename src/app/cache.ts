import BaseOGroup from "../shared/structures/OGroup.js";
import BaseZGroup from "../shared/structures/ZGroup.js";
import BaseTeacher from "../shared/structures/Teacher.js";
import { FoE } from "../shared/lib/APIConvertor.js";
import { LRUCache } from "lru-cache";
import Group from "../shared/structures/Group.js";

export default class Cache {
    static _groups: LRUCache<string, BaseOGroup | BaseZGroup> = new LRUCache({
        ttl: 1000 * 60 * 60 * 24 * 7, // неделя
        ttlAutopurge: true,
    })

    static _teacher: LRUCache<string, BaseTeacher> = new LRUCache({
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

    static async getTeacher(name: string) {
        let teacher = this._teacher.get(name);

        if (teacher) return teacher;
        else {
            // let teacher = await BaseTeacher.getTeachersList()
            let teachers = await BaseTeacher.searchTeacher(name);

            if (!teachers?.length || teachers.length > 1) return undefined;
            if (teachers.length == 1) {
                teacher = new BaseTeacher(teachers[0]);

                this._teacher.set(teachers[0], teacher);

                return teacher;
            }
        }
    }
}
