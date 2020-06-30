import ErrorMapper from 'utils/ErrorMapper';
import container from './inversify.config';

import { TYPE_PROCESSOR_SUPPLIER } from 'processor/ProcessorSupplier';
import { GameProcessorSupplier } from 'processor/game/GameProcessorSupplier';

import { MemoryManager, MemoryManagerImpl } from 'service/MemoryManager';
import { Processor } from 'processor/Processor';
import { injectable, inject, named } from 'inversify';
import { GamePrimaryProcessor } from 'processor/game/GamePrimaryProcessor';
import { GameSegmentBuilderProcessor } from 'processor/game/GameSegmentBuilderProcessor';

interface Bootstrapper {
    loop(): void
}

@injectable()
class BootstrapperImpl implements Bootstrapper {
    public memoryManager: MemoryManager;
    public supplier: GameProcessorSupplier;

    public constructor(
        @inject(MemoryManagerImpl.TYPE) memoryManager: MemoryManager,
        @inject(TYPE_PROCESSOR_SUPPLIER) @named(GameProcessorSupplier.TYPE) supplier: GameProcessorSupplier,
    ) {
        this.memoryManager = memoryManager;
        this.supplier = supplier;
    }

    public loop(): void {
        let processor: Processor;
        switch (this.memoryManager.getMode()) {
            case "SegmentBuilder":
                processor = this.supplier.get({ type: GameSegmentBuilderProcessor.TYPE });
                break;
            case "Primary":
            default:
                processor = this.supplier.get({ type: GamePrimaryProcessor.TYPE });
        }

        this.memoryManager.setProcessorOutput(processor.process({}) || {});
    }
}

container.bind<Bootstrapper>("Bootstrapper").to(BootstrapperImpl);
export const loop: VoidFunc =
    ErrorMapper.wrapLoop(() =>
        container.get<Bootstrapper>("Bootstrapper").loop());
