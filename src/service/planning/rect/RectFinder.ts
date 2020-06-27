import { injectable, inject } from "inversify";

import LargestRectInput from "./model/LargestRectInput";
import LargestRectOutput from "./model/LargestRectOutput";
import { LargestRectHeuristic, TYPE_LARGEST_RECT_HEURISTIC } from "./LargestRectHeuristic";

import FindRectsInput from "./model/FindRectsInput";
import FindRectsOutput from "./model/FindRectsOutput";
import { FindRectsHeuristic, TYPE_FIND_RECTS_HEURISTIC } from "./FindRectsHeuristic";

import RectFinderInput from "./model/RectFinderInput";
import RectFinderOutput from "./model/RectFinderOutput";

export const TYPE_RECT_FINDER: symbol = Symbol('RectFinder');

export interface RectFinder {
    find(input: RectFinderInput): RectFinderOutput;
}

@injectable()
export class _RectFinder<A extends FindRectsHeuristic, B extends LargestRectHeuristic> implements RectFinder {
    private rectsInAreaHeuristic: A;
    private largestRectHeuristic: B;

    constructor(
        @inject(TYPE_FIND_RECTS_HEURISTIC) rectsInAreaHeuristic: A,
        @inject(TYPE_LARGEST_RECT_HEURISTIC) largestRectHeuristic: B
    ) {
        this.rectsInAreaHeuristic = rectsInAreaHeuristic;
        this.largestRectHeuristic = largestRectHeuristic;
    }

    public find(input: RectFinderInput): RectFinderOutput {
        const output: FindRectsOutput =
            this.findRectsInArea(FindRectsInput.fromRectFinderInput(input));
        return new RectFinderOutput(output.rects);
    }

    private findRectsInArea(input: FindRectsInput): FindRectsOutput {
        return this.rectsInAreaHeuristic.execute(input);
    }

    private getLargestRect(input: LargestRectInput): LargestRectOutput {
        return this.largestRectHeuristic.execute(input);
    }
}
