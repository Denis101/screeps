import { component } from "inversify.config";
import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorInput, ProcessorOutput } from "processor/Processor";

const TYPE: string = 'RoomUnownedProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class RoomUnownedProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    process(input: ProcessorInput): ProcessorOutput {
        return wrapProcess((): void => {
            throw new Error("Method not implemented.");
        }, input);
    }
}
