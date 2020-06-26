import { injectable } from "inversify";
import GameManager from "./GameManager";
import KeyValuePair from "model/KeyValuePair";

@injectable()
export default class MainGameManager implements GameManager {
    public getTime(): number {
        return this.getGame().time;
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
