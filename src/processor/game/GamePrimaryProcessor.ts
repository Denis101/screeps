import { inject } from "inversify";
import { component, factoryType } from "inversify.config";

import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorInput, ProcessorOutput } from "../Processor";
import { RoomProcessorFactory, TYPE_ROOM_PROCESSOR } from "processor/room/RoomProcessorFactory";

import { GameManager, TYPE_GAME_MANAGER } from "service/GameManager";
import { MemoryManager, TYPE_MEMORY_MANAGER } from "service/MemoryManager";
import { MessageBus, TYPE_MESSAGE_BUS } from "service/MessageBus";
import { SpawnLocationFinder, TYPE_SPAWN_LOCATION_FINDER } from "service/planning/spawn/SpawnLocationFinder";

export const TYPE_GAME_PRIMARY_PROCESSOR: symbol = Symbol('GamePrimaryProcessor');

@component<Processor>(TYPE_PROCESSOR, TYPE_GAME_PRIMARY_PROCESSOR)
export class GamePrimaryProcessor implements Processor {
    private gameManager: GameManager;
    private memoryManager: MemoryManager;
    private messageBus: MessageBus;
    private spawnLocationFinder: SpawnLocationFinder;
    private roomProcessorFactory: RoomProcessorFactory;

    public constructor(
        @inject(TYPE_GAME_MANAGER) gameManager: GameManager,
        @inject(TYPE_MEMORY_MANAGER) memoryManager: MemoryManager,
        @inject(TYPE_MESSAGE_BUS) messageBus: MessageBus,
        @inject(TYPE_SPAWN_LOCATION_FINDER) spawnLocationFinder: SpawnLocationFinder,
        @inject(factoryType(TYPE_ROOM_PROCESSOR)) roomProcessorFactory: RoomProcessorFactory
    ) {
        this.gameManager = gameManager;
        this.memoryManager = memoryManager;
        this.messageBus = messageBus;
        this.spawnLocationFinder = spawnLocationFinder;
        this.roomProcessorFactory = roomProcessorFactory;
    }

    process(input: ProcessorInput): ProcessorOutput {
        return wrapProcess((): void => {
            this.memoryManager.prune();
            for (const kv of this.gameManager.getRooms()) {
                const room: Room = kv.value;
                const discovered: boolean = this.memoryManager.hasRoom(room.name);
                const processor = this.roomProcessorFactory.getProcessor({
                    discovered,
                    owned: discovered && this.memoryManager.getRoom(room.name).owned
                });

                processor.process({ room });
            }

            this.messageBus.processMessages();
        }, input);
    }
}
