import FindRectsHeuristic from "./interface/FindRectsHeuristic";
import LargestRectHeuristic from "./interface/LargestRectHeuristic";
import FindRectsInput from "./model/FindRectsInput";
import FindRectsOutput from "./model/FindRectsOutput";
import LargestRectInput from "./model/LargestRectInput";
import LargestRectOutput from "./model/LargestRectOutput";

export default class RectFinder<A extends FindRectsHeuristic, B extends LargestRectHeuristic> {
    private rectsInAreaHeuristic: A;
    private largestRectHeuristic: B;

    constructor(rectsInAreaHeuristic: A, largestRectHeuristic: B) {
        this.rectsInAreaHeuristic = rectsInAreaHeuristic;
        this.largestRectHeuristic = largestRectHeuristic;
    }

    public findRectsInArea(input: FindRectsInput): FindRectsOutput {
        return this.rectsInAreaHeuristic.execute(input);
    }

    public getLargestRect(input: LargestRectInput): LargestRectOutput {
        return this.largestRectHeuristic.execute(input);
    }

}
