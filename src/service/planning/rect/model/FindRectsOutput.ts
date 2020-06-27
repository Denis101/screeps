import Rect from "model/Rect";
import { HeuristicOutput } from "utils/Heuristic";

export default class FindRectsOutput implements HeuristicOutput {
    private _totalArea: number;
    private _rects: Rect[];

    constructor(totalArea: number, rects: Rect[]) {
        this._totalArea = totalArea;
        this._rects = rects;
    }

    public get totalArea(): number {
        return this._totalArea;
    }

    public get rects(): Rect[] {
        return this._rects;
    }
}
