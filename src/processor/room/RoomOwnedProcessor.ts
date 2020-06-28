import { component } from "inversify.config";
import { Processor, TYPE_PROCESSOR, wrapProcess, ProcessorOutput, ProcessorInput } from "processor/Processor";

const TYPE: string = 'RoomOwnedProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class RoomOwnedProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    process(input: ProcessorInput): ProcessorOutput {
        return wrapProcess((): ProcessorOutput => {
            return {
                processorType: this.type,
                children: [],
                payload: undefined,
                timing: undefined
            };
        }, input);
    }

}
