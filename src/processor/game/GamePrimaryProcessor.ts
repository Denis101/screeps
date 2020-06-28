import { inject, named } from "inversify";
import { component } from "inversify.config";

import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorInput, ProcessorOutput } from "../Processor";
import { TYPE_PROCESSOR_SUPPLIER } from "processor/ProcessorSupplier";
import { RoomProcessorSupplier } from "processor/room/RoomProcessorSupplier";

import { GameManager, _GameManager } from "service/GameManager";
import { MemoryManager, _MemoryManager } from "service/MemoryManager";
import { MessageBus, _MessageBus } from "service/MessageBus";
import ScreepsRoomMemory from "screeps/ScreepsRoomMemory";

const TYPE: string = 'GamePrimaryProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class GamePrimaryProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private gameManager: GameManager;
    private memoryManager: MemoryManager;
    private messageBus: MessageBus;
    private supplier: RoomProcessorSupplier;

    public constructor(
        @inject(_GameManager.TYPE) gameManager: GameManager,
        @inject(_MemoryManager.TYPE) memoryManager: MemoryManager,
        @inject(_MessageBus.TYPE) messageBus: MessageBus,
        @inject(TYPE_PROCESSOR_SUPPLIER) @named(RoomProcessorSupplier.TYPE) supplier: RoomProcessorSupplier
    ) {
        this.gameManager = gameManager;
        this.memoryManager = memoryManager;
        this.messageBus = messageBus;
        this.supplier = supplier;
    }

    process(input: ProcessorInput): ProcessorOutput {
        return wrapProcess((): ProcessorOutput => {
            this.memoryManager.prune();

            const children: ProcessorOutput[] = [];
            for (const kv of this.gameManager.getRooms()) {
                const room: Room = kv.value;
                const memory: ScreepsRoomMemory =
                    this.memoryManager.getRoom(room.name);

                const discovered: boolean =
                    this.memoryManager.hasRoom(room.name);
                const owned: boolean = discovered && memory && memory.owned;
                const processor = this.supplier.get({
                    discovered,
                    owned,
                });

                const roomOutput: ProcessorOutput =
                    processor.process({ room });
                children.push(roomOutput);
            }

            this.messageBus.processMessages();

            return {
                processorType: this.type,
                children,
                payload: undefined,
                timing: undefined,
            };
        }, input);
    }
}
