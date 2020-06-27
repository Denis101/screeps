import RectParameters from "service/planning/rect/model/RectParameters";

export default class SpawnLocationInput {
    private _room: Room;
    private _minBaseSize: RectParameters;

    public constructor(room: Room, minBaseSize: RectParameters) {
        this._room = room;
        this._minBaseSize = minBaseSize;
    }

    public get room(): Room {
        return this._room;
    }

    public get minBaseSize(): RectParameters {
        return this._minBaseSize;
    }
}
