import { inject } from "inversify";
import { component } from "inversify.config";
import RoomVisualUtils from "utils/RoomVisualUtils";

import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorInput, ProcessorOutput } from "processor/Processor";

import { SpawnLocationFinder, _SpawnLocationFinder } from "service/planning/spawn/SpawnLocationFinder";
import { SpawnLRSDHeuristic } from "service/planning/spawn/SpawnLRSDHeuristic";
import SpawnLocationOutput from "service/planning/spawn/model/SpawnLocationOutput";
import SpawnLocationInput from "service/planning/spawn/model/SpawnLocationInput";

import RectParameters from "service/planning/rect/model/RectParameters";
import NumberPair from "model/NumberPair";
import RoomProcessorInput from "./RoomProcessorInput";

const TYPE: string = 'RoomDiscoveryProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class RoomDiscoveryProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private spawnLocationFinder: SpawnLocationFinder;

    public constructor(
        @inject(_SpawnLocationFinder.TYPE) spawnLocationFinder: SpawnLocationFinder
    ) {
        this.spawnLocationFinder = spawnLocationFinder;
    }

    process(input: RoomProcessorInput): ProcessorOutput {
        return wrapProcess((input: ProcessorInput): ProcessorOutput => {
            const room: Room = (<RoomProcessorInput>input).room;
            const output: SpawnLocationOutput = this.spawnLocationFinder.find(
                new SpawnLocationInput(
                    SpawnLRSDHeuristic.TYPE, room, new RectParameters(133, 1)));
            RoomVisualUtils.drawPoint(
                new NumberPair(output.location.x, output.location.y));
            RoomVisualUtils.drawRect(output.rect);

            const controller: StructureController | undefined = room.controller;
            if (!controller) {
                return {
                    processorType: this.type,
                    children: [],
                    payload: undefined,
                    timing: undefined
                };
            }

            RoomVisualUtils.drawPath(
                room.findPath(output.location, controller.pos), 'green');
            for (const src of room.find(FIND_SOURCES)) {
                RoomVisualUtils.drawPath(room.findPath(output.location, src.pos), 'yellow');
            }

            return {
                processorType: this.type,
                children: [],
                payload: undefined,
                timing: undefined
            };
        }, input);
    }
}
