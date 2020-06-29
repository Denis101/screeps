import { bindFactory } from "inversify.config";
import TimerOutput from "timing/TimerOutput";
import Timer from "timing/Timer";

export const TYPE_PROCESSOR: string = 'Processor';

export interface ProcessorInput { }
export interface ProcessorOutput {
    processorType: string;
    payload: object | undefined;
    children: ProcessorOutput[];
    timing: TimerOutput | undefined;
}

export interface Processor {
    type: string;
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
        processorType: (output && (output as any).processorType) || undefined,
        payload: (output && (output as any).payload) || undefined,
        children: (output && (output as any).children) || [],
        timing,
    };
}

bindFactory<Processor>(TYPE_PROCESSOR);
