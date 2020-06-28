import ErrorMapper from 'utils/ErrorMapper';
import container from './inversify.config';

import { TYPE_PROCESSOR_SUPPLIER } from 'processor/ProcessorSupplier';
import { GameProcessorSupplier } from 'processor/game/GameProcessorSupplier';

import { MemoryManager, _MemoryManager } from 'service/MemoryManager';
import { Processor } from 'processor/Processor';
import { injectable, inject, named } from 'inversify';
import { RoomProcessorSupplier } from 'processor/room/RoomProcessorSupplier';
import { GamePrimaryProcessor } from 'processor/game/GamePrimaryProcessor';
import { RoomDiscoveryProcessor } from 'processor/room/RoomDiscoveryProcessor';

interface Bootstrapper {
    loop(): void
}

@injectable()
class _Bootstrapper implements Bootstrapper {
    public memoryManager: MemoryManager;
    public supplier: GameProcessorSupplier;

    public constructor(
        @inject(_MemoryManager.TYPE) memoryManager: MemoryManager,
        @inject(TYPE_PROCESSOR_SUPPLIER) @named(GameProcessorSupplier.TYPE) supplier: GameProcessorSupplier,
    ) {
        this.memoryManager = memoryManager;
        this.supplier = supplier;
    }

    public loop(): void {
        const processor: Processor =
            this.supplier.get({ type: GamePrimaryProcessor.TYPE });
        this.memoryManager.setProcessorOutput(processor.process({}));
    }
}

container.bind<Bootstrapper>("Bootstrapper").to(_Bootstrapper);
export const loop: VoidFunc =
    ErrorMapper.wrapLoop(() =>
        container.get<Bootstrapper>("Bootstrapper").loop());
