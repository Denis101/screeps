import { component } from "inversify.config";
import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorInput, ProcessorOutput } from "processor/Processor";

export const TYPE_ROOM_UNOWNED_PROCESSOR: symbol = Symbol('RoomUnownedProcessor');

@component<Processor>(TYPE_PROCESSOR, TYPE_ROOM_UNOWNED_PROCESSOR)
export class RoomUnownedProcessor implements Processor {
    process(input: ProcessorInput): ProcessorOutput {
        return wrapProcess((): void => {
            throw new Error("Method not implemented.");
        }, input);
    }
}
