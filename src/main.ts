import ErrorMapper from 'utils/ErrorMapper';
import container from './inversify.config';

import { TYPE_GAME_PRIMARY_PROCESSOR } from 'processor/game/GamePrimaryProcessor';

import { TYPE_PROCESSOR_SUPPLIER } from 'processor/ProcessorSupplier';
import { TYPE_GAME_PROCESSOR_SUPPLIER, GameProcessorSupplier } from 'processor/game/GameProcessorSupplier';

import { MemoryManager, TYPE_MEMORY_MANAGER } from 'service/MemoryManager';
import { Processor } from 'processor/Processor';
import { injectable, inject, named } from 'inversify';
import { RoomProcessorSupplier } from 'processor/room/RoomProcessorSupplier';
import { TYPE_ROOM_DISCOVERY_PROCESSOR } from 'processor/room/RoomDiscoveryProcessor';

interface Bootstrapper {
    loop(): void
}

// hack; make sure the supplier is added to the container
new GameProcessorSupplier((named: string): Processor => container.get<Processor>(TYPE_GAME_PRIMARY_PROCESSOR));
new RoomProcessorSupplier((named: string): Processor => container.get<Processor>(TYPE_ROOM_DISCOVERY_PROCESSOR));

@injectable()
class _Bootstrapper implements Bootstrapper {
    public memoryManager: MemoryManager;
    public supplier: GameProcessorSupplier;

    public constructor(
        @inject(TYPE_MEMORY_MANAGER) memoryManager: MemoryManager,
        @inject(TYPE_PROCESSOR_SUPPLIER) @named(TYPE_GAME_PROCESSOR_SUPPLIER) supplier: GameProcessorSupplier,
    ) {
        this.memoryManager = memoryManager;
        this.supplier = supplier;
    }

    public loop(): void {
        const processor: Processor =
            this.supplier.get({ type: TYPE_GAME_PRIMARY_PROCESSOR });
        this.memoryManager.setProcessorOutput(processor.process({}));
    }
}

container.bind<Bootstrapper>("Bootstrapper").to(_Bootstrapper);
export const loop: VoidFunc =
    ErrorMapper.wrapLoop(() =>
        container.get<Bootstrapper>("Bootstrapper").loop());
