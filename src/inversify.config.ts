import "reflect-metadata";
import { Container } from "inversify";

import { FindRectsHeuristic, TYPE_FIND_RECTS_HEURISTIC } from "service/planning/rect/FindRectsHeuristic";
import FindRectsVH from "service/planning/rect/FindRectsVH";
import { LargestRectHeuristic, TYPE_LARGEST_RECT_HEURISTIC } from "service/planning/rect/LargestRectHeuristic";
import LargestRectLLUR from "service/planning/rect/LargestRectLLUR";
import { RectFinder, TYPE_RECT_FINDER, _RectFinder } from "service/planning/rect/RectFinder";

import { SpawnLocationHeuristic, TYPE_SPAWN_LOCATION_HEURISTIC } from "service/planning/spawn/SpawnLocationHeuristic";
import { _SpawnLRSDHeuristic } from "service/planning/spawn/SpawnLRSDHeuristic";
import { SpawnLocationFinder, TYPE_SPAWN_LOCATION_FINDER, _SpawnLocationFinder } from "service/planning/spawn/SpawnLocationFinder";

import { GameManager, TYPE_GAME_MANAGER, _GameManager } from "service/GameManager";
import { MemoryManager, TYPE_MEMORY_MANAGER, _MemoryManager } from "service/MemoryManager";
import { MessageBus, TYPE_MESSAGE_BUS, _MessageBus } from "service/MessageBus";

import { Processor, TYPE_PROCESSOR } from "processor/Processor";
import PrimaryProcessor from "processor/PrimaryProcessor";

const container: Container = new Container();
container.bind<LargestRectHeuristic>(TYPE_LARGEST_RECT_HEURISTIC).to(LargestRectLLUR);
container.bind<FindRectsHeuristic>(TYPE_FIND_RECTS_HEURISTIC).to(FindRectsVH);
container.bind<RectFinder>(TYPE_RECT_FINDER).to(_RectFinder);

container.bind<SpawnLocationHeuristic>(TYPE_SPAWN_LOCATION_HEURISTIC).to(_SpawnLRSDHeuristic);
container.bind<SpawnLocationFinder>(TYPE_SPAWN_LOCATION_FINDER).to(_SpawnLocationFinder);

container.bind<GameManager>(TYPE_GAME_MANAGER).to(_GameManager);
container.bind<MemoryManager>(TYPE_MEMORY_MANAGER).to(_MemoryManager);
container.bind<MessageBus>(TYPE_MESSAGE_BUS).to(_MessageBus);
container.bind<Processor>(TYPE_PROCESSOR).to(PrimaryProcessor);

export default container;
