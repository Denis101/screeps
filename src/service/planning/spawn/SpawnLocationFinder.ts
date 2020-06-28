import { inject } from "inversify";

import SpawnLocationInput from "./model/SpawnLocationInput";
import SpawnLocationOutput from "./model/SpawnLocationOutput";
import { SpawnLocationHeuristic, TYPE_SPAWN_LOCATION_HEURISTIC } from "./SpawnLocationHeuristic";
import { service } from "inversify.config";

export const TYPE_SPAWN_LOCATION_FINDER: symbol = Symbol('SpawnLocationFinder');

export interface SpawnLocationFinder {
    find(input: SpawnLocationInput): SpawnLocationOutput;
}

@service<SpawnLocationFinder>(TYPE_SPAWN_LOCATION_FINDER)
export class _SpawnLocationFinder {
    private _factory: (name: symbol) => SpawnLocationHeuristic;

    constructor(
        @inject(TYPE_SPAWN_LOCATION_HEURISTIC) factory: (name: symbol) => SpawnLocationHeuristic
    ) {
        this._factory = factory;
    }

    public find(input: SpawnLocationInput): SpawnLocationOutput {
        return this._factory(input.heuristic).execute(input);
    }
}
