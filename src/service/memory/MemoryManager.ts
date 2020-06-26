import ScreepsMemory from "../../screeps/ScreepsMemory";

export const TYPE: symbol = Symbol('MemoryManager');

export default interface MemoryManager {
    getMemory(): ScreepsMemory;
};
