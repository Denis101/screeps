import { Messaging } from "messaging";
import { ProcessorOutput } from "processor/Processor";

export default interface ScreepsMemory extends Memory {
    debug: boolean;
    mode: GameMode;
    messages: Messaging.Message[][];
    processorOutput: ProcessorOutput;
}
