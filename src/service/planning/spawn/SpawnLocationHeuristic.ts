import SpawnLocationInput from "./model/SpawnLocationInput";
import SpawnLocationOutput from "./model/SpawnLocationOutput";
import Heuristic from "utils/Heuristic";

export const TYPE_SPAWN_LOCATION_HEURISTIC: symbol = Symbol('SpawnLocationHeuristic');

export interface SpawnLocationHeuristic extends Heuristic<SpawnLocationInput, SpawnLocationOutput> { }
