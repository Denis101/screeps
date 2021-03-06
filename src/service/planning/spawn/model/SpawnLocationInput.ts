import RectParameters from "service/planning/rect/model/RectParameters";
import { HeuristicInput } from "utils/Heuristic";

export default class SpawnLocationInput implements HeuristicInput {
    private _heuristic: string;
    private _room: Room;
    private _minBaseSize: RectParameters;

    public constructor(heuristic: string, room: Room, minBaseSize: RectParameters) {
        this._heuristic = heuristic;
        this._room = room;
        this._minBaseSize = minBaseSize;
    }

    public get heuristic(): string {
        return this._heuristic;
    }

    public get room(): Room {
        return this._room;
    }

    public get minBaseSize(): RectParameters {
        return this._minBaseSize;
    }
}
