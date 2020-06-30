import { inject, named } from "inversify";
import { component } from "inversify.config";

import RoomUtils from "utils/RoomUtils";
import Rect from "model/Rect";

import ScreepsStructureMemory from "screeps/ScreepsStructureMemory";

import { Processor, TYPE_PROCESSOR, ProcessorOutput, timed } from "../Processor";
import { TowerProcessor } from "processor/tower/TowerProcessor";

import { GameManager, GameManagerImpl } from "service/GameManager";
import { MemoryManager, MemoryManagerImpl, StructureSegments } from "service/MemoryManager";

const TYPE: string = 'GameSegmentBuilderProcessor';

const SEGMENT_ID: string = 'segment';
const START_ID: string = 'start';
const END_ID: string = 'end';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class GameSegmentBuilderProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private static readonly FLAG_SEGMENT_ID: string = SEGMENT_ID;
    private static readonly FLAG_SEGMENT_START_ID: string = START_ID;
    private static readonly FLAG_SEGMENT_END_ID: string = END_ID;
    private static readonly FLAG_REGEX: RegExp =
        new RegExp(`^${SEGMENT_ID}\:(${START_ID}|${END_ID})\:(.+)`, 'gm');
    private static readonly FLAG_START_REGEX: RegExp =
        new RegExp(`^${SEGMENT_ID}\:${START_ID}\:(.+)`, 'gm');
    private static readonly FLAG_END_REGEX: RegExp =
        new RegExp(`^${SEGMENT_ID}\:${START_ID}\:(.+)`, 'gm');

    private gameManager: GameManager;
    private memoryManager: MemoryManager;
    private towerProcessor: Processor;

    public constructor(
        @inject(GameManagerImpl.TYPE) gameManager: GameManager,
        @inject(MemoryManagerImpl.TYPE) memoryManager: MemoryManager,
        @inject(TYPE_PROCESSOR) @named(TowerProcessor.TYPE) towerProcessor: Processor,
    ) {
        this.gameManager = gameManager;
        this.memoryManager = memoryManager;
        this.towerProcessor = towerProcessor;
    }

    @timed
    process(): ProcessorOutput {
        const result: StructureSegments = {};
        const children: ProcessorOutput[] = [];

        const room: Room = this.gameManager.getRooms()[0].value;

        const towers: StructureTower[] = room.find<StructureTower>(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        })

        // Include towers to keep things like ramparts alive when creating segments
        for (const tower of towers) {
            const towerOutput: ProcessorOutput | void = this.towerProcessor.process({
                tower,
            });

            // TODO; handle this in @timed function wrapper,
            // keep external state of call flame-graph
            if (towerOutput) {
                children.push(towerOutput);
            }
        }

        for (const kv of this.gameManager.getFlags()) {
            const match: RegExpExecArray | null =
                GameSegmentBuilderProcessor.FLAG_START_REGEX.exec(kv.key);
            if (match === null) {
                continue;
            }

            const name: string = kv.key.split(':')[2];
            const start: Flag = kv.value;
            const end: Flag = this.gameManager.getFlag(`segment:end:${name}`);
            const structures: ScreepsStructureMemory[] =
                RoomUtils.getStructureMemory(
                    RoomUtils.structuresAtArea(
                        room,
                        new Rect(
                            start.pos.x,
                            start.pos.y,
                            end.pos.x - start.pos.x + 1,
                            end.pos.y - start.pos.y + 1)));

            result[name] = structures;
        }

        this.memoryManager.setSegments(result);

        return {
            children,
        };
    }
}
