import { inject } from "inversify";
import { component } from "inversify.config";
import RoomVisualUtils from "utils/RoomVisualUtils";

import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorInput, ProcessorOutput } from "processor/Processor";

import { SpawnLocationFinder, TYPE_SPAWN_LOCATION_FINDER } from "service/planning/spawn/SpawnLocationFinder";
import { TYPE_SPAWN_LRSD } from "service/planning/spawn/SpawnLRSDHeuristic";
import SpawnLocationOutput from "service/planning/spawn/model/SpawnLocationOutput";
import SpawnLocationInput from "service/planning/spawn/model/SpawnLocationInput";

import RectParameters from "service/planning/rect/model/RectParameters";
import NumberPair from "model/NumberPair";
import RoomProcessorInput from "./RoomProcessorInput";

export const TYPE_ROOM_DISCOVERY_PROCESSOR: symbol = Symbol('RoomDiscoveryProcessor');

@component<Processor>(TYPE_PROCESSOR, TYPE_ROOM_DISCOVERY_PROCESSOR)
export class RoomDiscoveryProcessor implements Processor {
    private spawnLocationFinder: SpawnLocationFinder;

    public constructor(
        @inject(TYPE_SPAWN_LOCATION_FINDER) spawnLocationFinder: SpawnLocationFinder
    ) {
        this.spawnLocationFinder = spawnLocationFinder;
    }

    process(input: RoomProcessorInput): ProcessorOutput {
        return wrapProcess((input: ProcessorInput): void => {
            const room: Room = (<RoomProcessorInput>input).room;
            const output: SpawnLocationOutput = this.spawnLocationFinder.find(
                new SpawnLocationInput(TYPE_SPAWN_LRSD, room, new RectParameters(133, 1)));
            RoomVisualUtils.drawPoint(new NumberPair(output.location.x, output.location.y));
            RoomVisualUtils.drawRect(output.rect);

            const controller: StructureController | undefined = room.controller;
            if (!controller) {
                return;
            }

            RoomVisualUtils.drawPath(room.findPath(output.location, controller.pos), 'green');
            for (const src of room.find(FIND_SOURCES)) {
                RoomVisualUtils.drawPath(room.findPath(output.location, src.pos), 'yellow');
            }
        }, input);
    }
}
