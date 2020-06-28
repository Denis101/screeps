import { inject } from "inversify";
import { component } from "inversify.config";

import ArrayUtils from "utils/ArrayUtils";
import Rect from "model/Rect";
import Matrix from "collection/Matrix";

import FindRectsInput from "./model/FindRectsInput";
import FindRectsOutput from "./model/FindRectsOutput";
import RectSearch from "./model/RectSearch";
import RectParameters from "./model/RectParameters";
import LargestRectInput from "./model/LargestRectInput";

import { RectFinder, _RectFinder } from "./RectFinder";
import { FindRectsHeuristic, TYPE_FIND_RECTS_HEURISTIC } from "./FindRectsHeuristic";
import LargestRectLLUR from "./LargestRectLLUR";

const TYPE: string = 'FindRectsVH';

/**
 * Vertical Horizontal
 */
@component<FindRectsHeuristic>(TYPE_FIND_RECTS_HEURISTIC, TYPE)
export default class FindRectsVH implements FindRectsHeuristic {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private rectFinder: RectFinder;

    constructor(
        @inject(_RectFinder.TYPE) rectFinder: RectFinder
    ) {
        this.rectFinder = rectFinder;
    }

    execute(input: FindRectsInput): FindRectsOutput {
        const search: RectSearch = input.search;
        const params: RectParameters = input.params;
        return this.findRectsInArea(
            input.matrix, input.search, input.params, new Rect(0, 0, 0, 0));
    }

    private findRectsInArea(
        matrix: Matrix<number>,
        search: RectSearch,
        params: RectParameters,
        prevBiggest: Rect,
    ): FindRectsOutput {
        if (params.minArea > search.area
            || params.minPerimeter > search.perimeter) {
            return new FindRectsOutput(prevBiggest.area, [prevBiggest]);
        }

        let input: LargestRectInput =
            new LargestRectInput(LargestRectLLUR.TYPE, matrix, search, params);

        let biggest: Rect =
            this.rectFinder.largest(input).rect;
        if (params.minArea > biggest.area
            || params.minPerimeter > biggest.perimeter) {
            return new FindRectsOutput(prevBiggest.area, [prevBiggest]);
        }

        const subSearch: Rect = new Rect(
            biggest.x + search.x,
            biggest.y + search.y,
            biggest.w, biggest.h);

        const horz: FindRectsOutput =
            this.getHorizontal(matrix, search, params, subSearch);
        const vert: FindRectsOutput =
            this.getVertical(matrix, search, params, subSearch);

        const pred: BiPredicate<Rect, Rect> = (a: Rect, b: Rect) => {
            return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
        };

        const output: FindRectsOutput =
            horz.totalArea > vert.totalArea ? horz : vert;
        return new FindRectsOutput(
            output.totalArea,
            ArrayUtils.distinct(output.rects, pred)
        );
    }

    private getHorizontal(
        matrix: Matrix<number>,
        search: RectSearch,
        params: RectParameters,
        biggest: Rect
    ): FindRectsOutput {
        let area: number = 0;
        const rects: Rect[] = [];

        let tmp: FindRectsOutput = this.findRectsInArea(
            matrix,
            RectSearch.fromRectCoords(
                search.x,
                search.y,
                biggest.x - search.x,
                search.h),
            params,
            biggest);

        area += tmp.totalArea;
        rects.push(...tmp.rects);

        tmp = this.findRectsInArea(
            matrix,
            RectSearch.fromRectCoords(
                biggest.x + biggest.w,
                search.y,
                search.x + search.w - biggest.x - biggest.w,
                search.h),
            params,
            biggest);

        area += tmp.totalArea;
        rects.push(...tmp.rects);

        tmp = this.findRectsInArea(
            matrix,
            RectSearch.fromRectCoords(
                biggest.x,
                search.y,
                biggest.w,
                biggest.y - search.y
            ),
            params,
            biggest);

        area += tmp.totalArea;
        rects.push(...tmp.rects);

        tmp = this.findRectsInArea(
            matrix,
            RectSearch.fromRectCoords(
                biggest.x,
                biggest.y + biggest.h,
                biggest.w,
                search.y + search.h - biggest.y - biggest.h
            ),
            params,
            biggest);

        area += tmp.totalArea;
        rects.push(...tmp.rects);

        return new FindRectsOutput(area, rects);
    }

    private getVertical(
        matrix: Matrix<number>,
        search: RectSearch,
        params: RectParameters,
        biggest: Rect
    ): FindRectsOutput {
        let area: number = 0;
        const rects: Rect[] = [];

        let tmp: FindRectsOutput = this.findRectsInArea(
            matrix,
            RectSearch.fromRectCoords(
                search.x,
                search.y,
                search.w,
                biggest.y - biggest.h),
            params,
            biggest);

        area += tmp.totalArea;
        rects.push(...tmp.rects);

        tmp = this.findRectsInArea(
            matrix,
            RectSearch.fromRectCoords(
                search.x,
                biggest.y + biggest.h,
                search.w,
                search.y + search.h - biggest.y - biggest.h),
            params,
            biggest);

        area += tmp.totalArea;
        rects.push(...tmp.rects);

        tmp = this.findRectsInArea(
            matrix,
            RectSearch.fromRectCoords(
                search.x,
                biggest.y,
                biggest.x - search.x,
                biggest.h
            ),
            params,
            biggest);

        area += tmp.totalArea;
        rects.push(...tmp.rects);

        tmp = this.findRectsInArea(
            matrix,
            RectSearch.fromRectCoords(
                biggest.x + biggest.w,
                biggest.y,
                search.x + search.w - biggest.x - biggest.w,
                biggest.h
            ),
            params,
            biggest);

        area += tmp.totalArea;
        rects.push(...tmp.rects);

        return new FindRectsOutput(area, rects);
    }
}
