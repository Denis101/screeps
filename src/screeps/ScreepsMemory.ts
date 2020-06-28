import { Messaging } from "messaging";
import { ProcessorOutput } from "processor/Processor";

export default interface ScreepsMemory extends Memory {
    debug: boolean;
    messages: Messaging.Message[][];
    processorOutput: ProcessorOutput;
}
