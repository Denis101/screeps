
import FindRectsInput from "./model/FindRectsInput";
import FindRectsOutput from "./model/FindRectsOutput";
import Heuristic from "utils/Heuristic";

export const TYPE_FIND_RECTS_HEURISTIC: symbol = Symbol('FindRectsHeuristic');

export interface FindRectsHeuristic extends Heuristic<FindRectsInput, FindRectsOutput> { }
