import { inject } from "inversify";
import { component } from "inversify.config";

import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorInput, ProcessorOutput } from "../Processor";

import { GameManager, GameManagerImpl } from "service/GameManager";
import { MemoryManager, MemoryManagerImpl } from "service/MemoryManager";

const TYPE: string = 'GameSegmentBuilderProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class GameSegmentBuilderProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private gameManager: GameManager;
    private memoryManager: MemoryManager;

    public constructor(
        @inject(GameManagerImpl.TYPE) gameManager: GameManager,
        @inject(MemoryManagerImpl.TYPE) memoryManager: MemoryManager,
    ) {
        this.gameManager = gameManager;
        this.memoryManager = memoryManager;
    }

    process(input: ProcessorInput): ProcessorOutput {
        return wrapProcess((): ProcessorOutput => {
            return {
                processorType: this.type,
                children: [],
                payload: undefined,
                timing: undefined,
            };
        }, input);
    }
}
