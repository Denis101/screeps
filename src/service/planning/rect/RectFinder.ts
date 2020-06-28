import { inject } from "inversify";
import { service } from "inversify.config";

import LargestRectInput from "./model/LargestRectInput";
import LargestRectOutput from "./model/LargestRectOutput";
import { LargestRectHeuristic, TYPE_LARGEST_RECT_HEURISTIC } from "./LargestRectHeuristic";

import FindRectsInput from "./model/FindRectsInput";
import FindRectsOutput from "./model/FindRectsOutput";
import { FindRectsHeuristic, TYPE_FIND_RECTS_HEURISTIC } from "./FindRectsHeuristic";

export const TYPE_RECT_FINDER: string = 'RectFinder';

export interface RectFinder {
    rects(input: FindRectsInput): FindRectsOutput;
    largest(input: LargestRectInput): LargestRectOutput;
}

@service<RectFinder>(TYPE_RECT_FINDER)
export class _RectFinder implements RectFinder {
    private _findRectsFactory: (name: string) => FindRectsHeuristic;
    private _largestRectFactory: (name: string) => LargestRectHeuristic;

    constructor(
        @inject(TYPE_FIND_RECTS_HEURISTIC) findRectsFactory: (name: string) => FindRectsHeuristic,
        @inject(TYPE_LARGEST_RECT_HEURISTIC) largestRectFactory: (name: string) => LargestRectHeuristic
    ) {
        this._findRectsFactory = findRectsFactory;
        this._largestRectFactory = largestRectFactory;
    }

    public rects(input: FindRectsInput): FindRectsOutput {
        return this._findRectsFactory(input.heuristic).execute(input);
    }

    public largest(input: LargestRectInput): LargestRectOutput {
        return this._largestRectFactory(input.heuristic).execute(input);
    }
}
