import { bindFactory } from "inversify.config";
import TimerOutput from "timing/TimerOutput";
import Timer from "timing/Timer";

export const TYPE_PROCESSOR: symbol = Symbol('Processor');

export interface ProcessorInput { }
export interface ProcessorOutput {
    timing: TimerOutput;
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
        ...output || {},
        timing: timing,
    };
}

bindFactory<Processor>(TYPE_PROCESSOR);
