import ErrorMapper from 'utils/ErrorMapper';

import container from './inversify.config';
import { TYPE_GAME_PRIMARY_PROCESSOR } from 'processor/game/GamePrimaryProcessor';
import { ProcessorFactory } from 'processor/ProcessorFactory';
import { TYPE_GAME_PROCESSOR } from 'processor/game/GameProcessorFactory';
import { MemoryManager, TYPE_MEMORY_MANAGER } from 'service/MemoryManager';
import { ProcessorOutput } from 'processor/Processor';

const memoryManager: MemoryManager = container.get<MemoryManager>(TYPE_MEMORY_MANAGER);
const factory: ProcessorFactory =
    container.get<ProcessorFactory>(TYPE_GAME_PROCESSOR);
export const loop: VoidFunc = ErrorMapper.wrapLoop(() => {
    const output: ProcessorOutput =
        factory.getProcessor({ type: TYPE_GAME_PRIMARY_PROCESSOR }).process({});
    memoryManager.setPreviousExecutionTime(output.timing);
});
