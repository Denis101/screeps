import Rect from "model/Rect";

export default class SpawnLocationOutput {
    private _location: RoomPosition;
    private _rect: Rect;

    public constructor(location: RoomPosition, rect: Rect) {
        this._location = location;
        this._rect = rect;
    }

    public get location(): RoomPosition {
        return this._location;
    }

    public get rect(): Rect {
        return this._rect;
    }
}
