import Rect from "model/Rect";
import { HeuristicOutput } from "utils/Heuristic";

export default class LargestRectOutput implements HeuristicOutput {
    private _rect: Rect;

    constructor(rect: Rect) {
        this._rect = rect;
    }

    public get rect(): Rect {
        return this._rect;
    }
}
