import ScreepsSourceMemory from "screeps/ScreepsSourceMemory";
import SourceMeta from "model/SourceMeta";

export default class SourceUtils {
    public static toMemory(meta: SourceMeta): ScreepsSourceMemory {
        return {
            id: meta.id,
            containerId: null,
            containerSiteId: null,
            flagId: null,
            pawns: {
                capacity: meta.walkable,
                active: [],
            },
            couriers: {
                capacity: 1,
                active: [],
            },
            builders: {
                capacity: 1,
                active: [],
            },
            miners: {
                capacity: 1,
                active: [],
            },
        };
    }
}
