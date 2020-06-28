
import FindRectsInput from "./model/FindRectsInput";
import FindRectsOutput from "./model/FindRectsOutput";
import Heuristic from "utils/Heuristic";
import { bindFactory } from "inversify.config";

export const TYPE_FIND_RECTS_HEURISTIC: symbol = Symbol('FindRectsHeuristic');

export interface FindRectsHeuristic extends Heuristic<FindRectsInput, FindRectsOutput> { }

bindFactory<FindRectsHeuristic>(TYPE_FIND_RECTS_HEURISTIC);
