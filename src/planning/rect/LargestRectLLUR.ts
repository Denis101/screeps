import Stack from 'collection/Stack';
import MatrixCache from 'collection/MatrixCache';

import Rect from 'model/Rect';
import NumberPair from 'model/NumberPair';

import LargestRectHeuristic from './interface/LargestRectHeuristic';
import LargestRectInput from './model/LargestRectInput';
import LargestRectOutput from './model/LargestRectOutput';


export default class LargestRectLLUR implements LargestRectHeuristic {
    execute(input: LargestRectInput): LargestRectOutput {
        const stack: Stack<NumberPair> = new Stack();
        const cache: MatrixCache<number> = new MatrixCache(input.search.w, 0, 0);

        let bestLowerLeft: NumberPair = new NumberPair(0, 0);
        let bestUpperRight: NumberPair = new NumberPair(-1, -1);

        let bestArea: number = 0;
        let bestPerimeter: number = 0;

        for (let y: number = input.search.y; y < input.search.h; y++) {
            let openWidth: number = 0;
            cache.update(y, input.search.w, input.matrix);

            for (let x: number = input.search.x; x < input.search.w; x++) {
                if (cache.get(x) > openWidth) {
                    stack.push(new NumberPair(x, openWidth));
                    openWidth = cache.get(x);
                }
                else if (cache.get(x) < openWidth) {
                    let x0: number;
                    let w0: number;
                    let area: number;
                    let perimeter: number;

                    do {
                        x0 = stack.peek().x;
                        w0 = stack.peek().y;
                        stack.pop();

                        area = openWidth * (x - x0);
                        perimeter = openWidth + (x - x0);

                        if (area > bestArea || (area === bestArea && perimeter < bestPerimeter)) {
                            bestArea = area;
                            bestPerimeter = perimeter;
                            bestLowerLeft = new NumberPair(x0, y);
                            bestUpperRight = new NumberPair(x - 1, y - openWidth + 1);
                        }

                        openWidth = w0;
                    } while (cache.get(x) < openWidth);

                    openWidth = cache.get(x);
                    if (openWidth !== 0) {
                        stack.push(new NumberPair(x0, w0));
                    }
                }
            }
        }

        return new LargestRectOutput(
            new Rect(
                bestLowerLeft.x,
                Math.max(0, bestUpperRight.y),
                1 + bestUpperRight.x - bestLowerLeft.x,
                1 + bestLowerLeft.y - bestUpperRight.y
            ));
    }
}
