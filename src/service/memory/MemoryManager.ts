import { Messaging } from "messaging";
import ScreepsMemory from "screeps/ScreepsMemory";
import KeyValuePair from "model/KeyValuePair";

export const TYPE: symbol = Symbol('MemoryManager');

export default interface MemoryManager {
    isDebug(): boolean;
    getMessageChannel(channel: number): Messaging.Message[];
    getAllMessages(): Messaging.Message[][];
    getCreep(id: string): CreepMemory;
    getCreeps(): KeyValuePair<string, CreepMemory>[];
    prune(): void;
};
