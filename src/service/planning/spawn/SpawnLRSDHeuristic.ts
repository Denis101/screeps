/**
 * Largest Rectangle Shortest Distance
 */

import { injectable, inject } from "inversify";
import Matrix from "collection/Matrix";
import Rect from "model/Rect";
import TerrainConverter from "utils/TerrainConverter";

import SpawnLocationInput from "./model/SpawnLocationInput";
import SpawnLocationOutput from "./model/SpawnLocationOutput";
import { SpawnLocationHeuristic } from "./SpawnLocationHeuristic";

import RectFinderInput from "../rect/model/RectFinderInput";
import RectSearch from "../rect/model/RectSearch";
import { RectFinder, TYPE_RECT_FINDER } from "../rect/RectFinder";

export const TYPE: symbol = Symbol('SpawnLRSDFinder');

export default interface SpawnLRSDHeuristic extends SpawnLocationHeuristic { }

@injectable()
export class _SpawnLRSDHeuristic implements SpawnLRSDHeuristic {
    private rectFinder: RectFinder;

    public constructor(
        @inject(TYPE_RECT_FINDER) rectFinder: RectFinder
    ) {
        this.rectFinder = rectFinder;
    }

    execute(input: SpawnLocationInput): SpawnLocationOutput {
        const matrix: Matrix<number> | null =
            TerrainConverter.toMatrix(
                (<any>input.room.getTerrain()).getRawBuffer());

        if (matrix === null) {
            // todo; return some sort of error output
            return new SpawnLocationOutput(
                new RoomPosition(-1, -1, input.room.name),
                new Rect(-1, -1, -1, -1));
        }

        const rectSearch: RectSearch =
            RectSearch.fromCoords(0, 0, matrix.size(), matrix.size());
        const { rects } =
            this.rectFinder.find(
                new RectFinderInput(matrix, rectSearch, input.minBaseSize));

        const sources: Source[] = input.room.find(FIND_SOURCES);
        const pathTotals: number[] = [];
        for (const rect of rects) {
            let pathTotal: number = 0;
            const centre: RoomPosition =
                rect.centre.toRoomPosition(input.room.name);
            const controller: StructureController | undefined =
                input.room.controller;
            if (!controller) {
                continue;
            }

            // const path: PathStep[] = input.room.findPath(centre, controller.pos);
            // pathTotal += path.length;

            // for (const src of sources) {
            //     const srcPath: PathStep[] = input.room.findPath(centre, src.pos);
            //     pathTotal += srcPath.length;
            // }

            pathTotals.push(pathTotal);
        }

        let currentMinPath: number = 0;
        let currentMin: number = 0;
        for (let i: number = 0; i < pathTotals.length; i++) {
            const rect: Rect = rects[i];
            const pathTotal = pathTotals[i];

            if (pathTotal < currentMinPath) {
                currentMinPath = pathTotal;
                currentMin = i;
            }
        }

        const selectedRect: Rect = rects[currentMin];
        return new SpawnLocationOutput(
            selectedRect.centre.toRoomPosition(input.room.name), selectedRect);
    }

}
