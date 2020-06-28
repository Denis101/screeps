import RectParameters from "service/planning/rect/model/RectParameters";
import { HeuristicInput } from "utils/Heuristic";

export default class SpawnLocationInput implements HeuristicInput {
    private _heuristic: symbol;
    private _room: Room;
    private _minBaseSize: RectParameters;

    public constructor(heuristic: symbol, room: Room, minBaseSize: RectParameters) {
        this._heuristic = heuristic;
        this._room = room;
        this._minBaseSize = minBaseSize;
    }

    public get heuristic(): symbol {
        return this._heuristic;
    }

    public get room(): Room {
        return this._room;
    }

    public get minBaseSize(): RectParameters {
        return this._minBaseSize;
    }
}
