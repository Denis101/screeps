import { Messaging } from "messaging";
import { ProcessorOutput } from "processor/Processor";
import { StructureSegments } from "service/MemoryManager";

export default interface ScreepsMemory extends Memory {
    debug: boolean;
    mode: GameMode;
    messages: Messaging.Message[][];
    processorOutput: ProcessorOutput;
    segments: StructureSegments;
}
