import { injectable, inject } from "inversify";

import SpawnLocationInput from "./model/SpawnLocationInput";
import SpawnLocationOutput from "./model/SpawnLocationOutput";
import { SpawnLocationHeuristic, TYPE_SPAWN_LOCATION_HEURISTIC } from "./SpawnLocationHeuristic";

export const TYPE_SPAWN_LOCATION_FINDER: symbol = Symbol('SpawnLocationFinder');

export interface SpawnLocationFinder {
    find(input: SpawnLocationInput): SpawnLocationOutput;
}

@injectable()
export class _SpawnLocationFinder<H extends SpawnLocationHeuristic> {
    private heuristic: H;

    constructor(
        @inject(TYPE_SPAWN_LOCATION_HEURISTIC) heuristic: H
    ) {
        this.heuristic = heuristic;
    }

    public find(input: SpawnLocationInput): SpawnLocationOutput {
        return this.heuristic.execute(input);
    }
}
