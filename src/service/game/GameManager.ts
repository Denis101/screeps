import KeyValuePair from "model/KeyValuePair";

export const TYPE: symbol = Symbol('GameManager');

export default interface GameManager {
    getTime(): number;
    getCreep(id: Id<Creep>): Creep;
    getCreeps(): KeyValuePair<string, Creep>[];
    getFlag(id: string): Flag;
    getFlags(): KeyValuePair<string, Flag>[];
    getObjectById<T>(id: Id<T> | string): T | null;
};
