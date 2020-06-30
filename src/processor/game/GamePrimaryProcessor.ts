import { inject, named } from "inversify";
import { component } from "inversify.config";

import { Processor, TYPE_PROCESSOR, ProcessorOutput, timed } from "../Processor";
import { TYPE_PROCESSOR_SUPPLIER } from "processor/ProcessorSupplier";
import { RoomProcessorSupplier } from "processor/room/RoomProcessorSupplier";

import { GameManager, GameManagerImpl } from "service/GameManager";
import { MemoryManager, MemoryManagerImpl } from "service/MemoryManager";
import { MessageBus, MessageBusImpl } from "service/MessageBus";
import ScreepsRoomMemory from "screeps/ScreepsRoomMemory";
import { CreepProcessorSupplier } from "processor/creep/CreepProcessorSupplier";
import ScreepsCreep from "screeps/ScreepsCreep";

const TYPE: string = 'GamePrimaryProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class GamePrimaryProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private gameManager: GameManager;
    private memoryManager: MemoryManager;
    private messageBus: MessageBus;
    private roomSupplier: RoomProcessorSupplier;
    private creepSupplier: CreepProcessorSupplier;

    public constructor(
        @inject(GameManagerImpl.TYPE) gameManager: GameManager,
        @inject(MemoryManagerImpl.TYPE) memoryManager: MemoryManager,
        @inject(MessageBusImpl.TYPE) messageBus: MessageBus,
        @inject(TYPE_PROCESSOR_SUPPLIER) @named(RoomProcessorSupplier.TYPE) roomSupplier: RoomProcessorSupplier,
        @inject(TYPE_PROCESSOR_SUPPLIER) @named(CreepProcessorSupplier.TYPE) creepSupplier: CreepProcessorSupplier
    ) {
        this.gameManager = gameManager;
        this.memoryManager = memoryManager;
        this.messageBus = messageBus;
        this.roomSupplier = roomSupplier;
        this.creepSupplier = creepSupplier;
    }

    @timed
    process(): ProcessorOutput {
        this.memoryManager.prune();

        const children: ProcessorOutput[] = [];
        for (const kv of this.gameManager.getRooms()) {
            const room: Room = kv.value;
            const memory: ScreepsRoomMemory =
                this.memoryManager.getRoom(room.name);

            const discovered: boolean =
                this.memoryManager.hasRoom(room.name);
            const owned: boolean = discovered && memory && memory.owned;

            const roomOutput: ProcessorOutput | void = this.roomSupplier.get({
                discovered,
                owned,
            }).process({ room });

            if (roomOutput) {
                children.push(roomOutput);
            }
        }

        for (const kv of this.gameManager.getCreeps()) {
            const creep: ScreepsCreep = kv.value;
            const roleId: string = creep.getMemory().roleId;
            const creepOutput: ProcessorOutput | void =
                this.creepSupplier.get({ roleId }).process({ creep });

            if (creepOutput) {
                children.push(creepOutput);
            }
        }

        this.messageBus.processMessages();
        return {
            children,
        };;
    }
}
