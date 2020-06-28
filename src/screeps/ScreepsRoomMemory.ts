import ScreepsSourceMemory from "./ScreepsSourceMemory";
import Rect from "model/Rect";

export interface RoomState {
    spawnLocation: RoomPosition | null;
    roads: PathStep[][];
}

export class SampledRateMetric {
    public total: number = 0;
    public lastSample: number = 0;
    public rate: number = 0;
}

export default interface ScreepsRoomMemory extends RoomMemory {
    name: string;
    sources: {
        [id: string]: ScreepsSourceMemory
    };
    minerals: Id<Mineral>[];
    controller: Id<StructureController> | undefined;
    home: boolean;
    owned: boolean;
    allocation: RoomAllocation,
    bounds: Rect,
    state: {
        current: RoomState,
        desired: RoomState,
    };
    metrics: {
        energy: {
            harvest: SampledRateMetric,
            used: SampledRateMetric,
        }
    };
}
