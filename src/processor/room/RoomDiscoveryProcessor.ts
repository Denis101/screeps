import { inject } from "inversify";
import { component } from "inversify.config";

import { Processor, TYPE_PROCESSOR, timed } from "processor/Processor";

import { SpawnLocationFinder, SpawnLocationFinderImpl } from "service/planning/spawn/SpawnLocationFinder";
import { SpawnLRSDHeuristic } from "service/planning/spawn/SpawnLRSDHeuristic";
import SpawnLocationOutput from "service/planning/spawn/model/SpawnLocationOutput";
import SpawnLocationInput from "service/planning/spawn/model/SpawnLocationInput";

import RectParameters from "service/planning/rect/model/RectParameters";
import RoomProcessorInput from "./RoomProcessorInput";
import { MemoryManager, MemoryManagerImpl } from "service/MemoryManager";
import RoomUtils from "utils/RoomUtils";
import SourceUtils from "utils/SourceUtils";
import { SampledRateMetric } from "screeps/ScreepsRoomMemory";

const TYPE: string = 'RoomDiscoveryProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class RoomDiscoveryProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private memoryManager: MemoryManager;
    private spawnLocationFinder: SpawnLocationFinder;

    public constructor(
        @inject(MemoryManagerImpl.TYPE) memoryManager: MemoryManager,
        @inject(SpawnLocationFinderImpl.TYPE) spawnLocationFinder: SpawnLocationFinder
    ) {
        this.memoryManager = memoryManager;
        this.spawnLocationFinder = spawnLocationFinder;
    }

    @timed
    process(input: RoomProcessorInput): void {
        const room: Room = input.room;
        const output: SpawnLocationOutput = this.spawnLocationFinder.find(
            new SpawnLocationInput(
                SpawnLRSDHeuristic.TYPE, room, new RectParameters(133, 1)));

        const controller: StructureController | undefined = room.controller;
        if (!controller) {
            return;
        }

        const roads: PathStep[][] = [
            room.findPath(output.location, controller.pos)
        ];

        const sources: any = {};
        for (const meta of RoomUtils.getSourceMeta(room)) {
            sources[meta.id] = SourceUtils.toMemory(meta);
            roads.push(room.findPath(output.location, meta.pos));
        }

        this.memoryManager.setRoom(room.name, {
            name: room.name,
            sources,
            minerals: [],
            controller: room.controller?.id,
            home: this.memoryManager.getRoomCount() <= 0, // TODO; check for existing spawn too
            owned: room.controller?.my || false,
            allocation: 'HUB', // TODO; Allocate based on spawn location output
            bounds: output.rect,
            state: {
                current: {
                    spawnLocation: null,
                    extensionCount: 0,
                    roads: [],
                },
                desired: {
                    spawnLocation: output.location,
                    extensionCount: 0,
                    roads,
                },
            },
            metrics: {
                energy: {
                    harvest: new SampledRateMetric(),
                    used: new SampledRateMetric(),
                }
            },
        });
    }
}
