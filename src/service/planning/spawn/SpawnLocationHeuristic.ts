import SpawnLocationInput from "./model/SpawnLocationInput";
import SpawnLocationOutput from "./model/SpawnLocationOutput";
import Heuristic from "utils/Heuristic";
import { bindFactory } from "inversify.config";

export const TYPE_SPAWN_LOCATION_HEURISTIC: string = 'SpawnLocationHeuristic';

export interface SpawnLocationHeuristic extends Heuristic<SpawnLocationInput, SpawnLocationOutput> { }

bindFactory<SpawnLocationHeuristic>(TYPE_SPAWN_LOCATION_HEURISTIC);
