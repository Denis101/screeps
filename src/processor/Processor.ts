import { bindFactory } from "inversify.config";
import TimerOutput from "timing/TimerOutput";
import Timer from "timing/Timer";

export const TYPE_PROCESSOR: string = 'Processor';

export interface ProcessorInput { }
export interface ProcessorOutput {
    payload: object | undefined;
    children: ProcessorOutput[];
    timing: TimerOutput | undefined;
}

export interface Processor {
    process(input: ProcessorInput): ProcessorOutput;
}

export function wrapProcess(
    func: Func<ProcessorInput, ProcessorOutput | void>,
    input: ProcessorInput
): ProcessorOutput {
    let output: object | void = {};
    const timing: TimerOutput = new Timer().timeExecution(() => {
        output = func(input);
    });

    return {
        payload: (<any>output).payload || undefined,
        children: (<any>output).children || [],
        timing: timing,
    };
}

bindFactory<Processor>(TYPE_PROCESSOR);
