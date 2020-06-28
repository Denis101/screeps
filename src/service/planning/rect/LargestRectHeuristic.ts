import LargestRectInput from './model/LargestRectInput';
import LargestRectOutput from './model/LargestRectOutput';
import Heuristic from 'utils/Heuristic';
import { bindFactory } from 'inversify.config';

export const TYPE_LARGEST_RECT_HEURISTIC: string = 'LargestRectHeuristic';

export interface LargestRectHeuristic extends Heuristic<LargestRectInput, LargestRectOutput> { }

bindFactory<LargestRectHeuristic>(TYPE_LARGEST_RECT_HEURISTIC);
