import { inject } from "inversify";

import SpawnLocationInput from "./model/SpawnLocationInput";
import SpawnLocationOutput from "./model/SpawnLocationOutput";
import { SpawnLocationHeuristic, TYPE_SPAWN_LOCATION_HEURISTIC } from "./SpawnLocationHeuristic";
import { service, factoryType } from "inversify.config";
import { SpawnLRSDHeuristic } from "./SpawnLRSDHeuristic";

const TYPE: string = 'SpawnLocationFinder';

const HEURISTICS: string[] = [
    SpawnLRSDHeuristic.TYPE,
];

export interface SpawnLocationFinder {
    type: string;
    find(input: SpawnLocationInput): SpawnLocationOutput;
}

@service<SpawnLocationFinder>(TYPE)
export class _SpawnLocationFinder {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private _factory: (named: string) => SpawnLocationHeuristic;

    constructor(
        @inject(factoryType(TYPE_SPAWN_LOCATION_HEURISTIC)) factory: (named: string) => SpawnLocationHeuristic
    ) {
        this._factory = factory;
    }

    public find(input: SpawnLocationInput): SpawnLocationOutput {
        if (HEURISTICS.indexOf(input.heuristic) < 0) {
            throw new Error(`No heuristic implementation for given input - ${input.heuristic}`);
        }

        return this._factory(input.heuristic).execute(input);
    }
}
