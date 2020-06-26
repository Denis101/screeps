import Rect from "model/Rect";
import { HeuristicOutput } from "utils/Heuristic";

export default class FindRectsOutput implements HeuristicOutput {
    private _totalArea: number;
    private _output: Rect[];

    constructor(totalArea: number, output: Rect[]) {
        this._totalArea = totalArea;
        this._output = output;
    }

    public get totalArea(): number {
        return this._totalArea;
    }

    public get output(): Rect[] {
        return this._output;
    }
}
