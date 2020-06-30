import { ComponentMemory } from "creep/component/CreepComponent";

export interface CreepState {
    current: string;
    previous: string;
    lastTick: string;
}

export default interface ScreepsCreepMemory extends CreepMemory {
    roleId: string;
    state: CreepState;
    components: {
        [type: string]: ComponentMemory
    }
}
