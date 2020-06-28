import { injectable } from "inversify";
import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorOutput, ProcessorInput } from "processor/Processor";
import { component } from "inversify.config";

export const TYPE_ROOM_OWNED_PROCESSOR: string = 'RoomOwnedProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE_ROOM_OWNED_PROCESSOR)
export class RoomOwnedProcessor implements Processor {
    process(input: ProcessorInput): ProcessorOutput {
        return wrapProcess((): void => {
            throw new Error("Method not implemented.");
        }, input);
    }

}
