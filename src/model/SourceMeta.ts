import ScreepsRoomMemory from "screeps/ScreepsRoomMemory";
import ScreepsSourceMemory from "screeps/ScreepsSourceMemory";
import RoomUtils from "utils/RoomUtils";
import Rect from "./Rect";
import ArrayUtils from "utils/ArrayUtils";

export default class SourceMeta {
    private _source: Source;

    public constructor(source: Source) {
        this._source = source;
    }

    public get id(): Id<Source> {
        return this._source.id;
    }

    public get pos(): RoomPosition {
        return this._source.pos;
    }

    public get room(): Room {
        return this._source.room;
    }

    public get weightInverse(): number {
        return 1 / this.weight;
    }

    public get weight(): number {
        return this.walkable + (ArrayUtils.sum(this.distanceToHostileStructures) / 10);
    }

    public get walkable(): number {
        return RoomUtils.walkableAtArea(this.room, new Rect(
            this._source.pos.x - 1,
            this._source.pos.y - 1,
            3, 3
        ));
    }

    public get distanceToHostileStructures(): number[] {
        return RoomUtils.distancesToHostileStructures(this.room, this.pos);
    }

    public get memory(): ScreepsSourceMemory {
        return (this.room.memory as ScreepsRoomMemory).sources[this._source.id];
    }

    public static fromSource(source: Source): SourceMeta {
        return new SourceMeta(source);
    }
}
