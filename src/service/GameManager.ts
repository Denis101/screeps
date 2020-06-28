import { service } from "inversify.config";
import KeyValuePair from "model/KeyValuePair";

export const TYPE: string = 'GameManager';

export interface GameManager {
    type: string;
    getTime(): number;
    getRoom(name: string): Room;
    getRooms(): KeyValuePair<string, Room>[];
    getCreep(id: Id<Creep>): Creep;
    getCreeps(): KeyValuePair<string, Creep>[];
    getFlag(id: string): Flag;
    getFlags(): KeyValuePair<string, Flag>[];
    getObjectById<T>(id: Id<T> | string): T | null;
};

@service<GameManager>(TYPE)
export class _GameManager implements GameManager {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    public getTime(): number {
        return this.getGame().time;
    }

    public getRoom(name: string): Room {
        return this.getGame().rooms[name];
    }

    public getRooms(): KeyValuePair<string, Room>[] {
        return Object.keys(this.getGame().rooms)
            .map((k: string) => new KeyValuePair(k, this.getGame().rooms[k]));
    }

    public getCreep(id: Id<Creep>): Creep {
        return this.getGame().creeps[id];
    }

    public getCreeps(): KeyValuePair<string, Creep>[] {
        return Object.keys(this.getGame().creeps)
            .map((k: string) => new KeyValuePair(k, this.getGame().creeps[k]));
    }

    public getFlag(id: string): Flag {
        return this.getGame().flags[id];
    }

    public getFlags(): KeyValuePair<string, Flag>[] {
        return Object.keys(this.getGame().flags)
            .map((k: string) => new KeyValuePair(k, this.getGame().flags[k]));
    }

    public getObjectById<T>(id: Id<T> | string): T | null {
        return this.getGame().getObjectById(id);
    }

    public getGame(): Game {
        return Game;
    }
}
