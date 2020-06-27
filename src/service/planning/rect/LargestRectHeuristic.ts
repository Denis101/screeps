import LargestRectInput from './model/LargestRectInput';
import LargestRectOutput from './model/LargestRectOutput';
import Heuristic from 'utils/Heuristic';

export const TYPE_LARGEST_RECT_HEURISTIC: symbol = Symbol('LargestRectHeuristic');

export interface LargestRectHeuristic extends Heuristic<LargestRectInput, LargestRectOutput> { }
