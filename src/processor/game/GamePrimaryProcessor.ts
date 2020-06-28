import { inject, named } from "inversify";
import { component } from "inversify.config";

import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorInput, ProcessorOutput } from "../Processor";
import { TYPE_PROCESSOR_SUPPLIER } from "processor/ProcessorSupplier";
import { RoomProcessorSupplier, TYPE_ROOM_PROCESSOR_SUPPLIER } from "processor/room/RoomProcessorSupplier";

import { GameManager, TYPE_GAME_MANAGER } from "service/GameManager";
import { MemoryManager, TYPE_MEMORY_MANAGER } from "service/MemoryManager";
import { MessageBus, TYPE_MESSAGE_BUS } from "service/MessageBus";
import ScreepsRoomMemory from "screeps/ScreepsRoomMemory";

export const TYPE_GAME_PRIMARY_PROCESSOR: string = 'GamePrimaryProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE_GAME_PRIMARY_PROCESSOR)
export class GamePrimaryProcessor implements Processor {
    private gameManager: GameManager;
    private memoryManager: MemoryManager;
    private messageBus: MessageBus;
    private supplier: RoomProcessorSupplier;

    public constructor(
        @inject(TYPE_GAME_MANAGER) gameManager: GameManager,
        @inject(TYPE_MEMORY_MANAGER) memoryManager: MemoryManager,
        @inject(TYPE_MESSAGE_BUS) messageBus: MessageBus,
        @inject(TYPE_PROCESSOR_SUPPLIER) @named(TYPE_ROOM_PROCESSOR_SUPPLIER) supplier: RoomProcessorSupplier
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
                const memory: ScreepsRoomMemory = this.memoryManager.getRoom(room.name);

                const discovered: boolean = this.memoryManager.hasRoom(room.name);
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
                children,
                payload: undefined,
                timing: undefined,
            };
        }, input);
    }
}
