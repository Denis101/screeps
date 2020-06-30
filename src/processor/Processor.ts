import { bindFactory } from "inversify.config";
import TimerOutput from "timing/TimerOutput";
import Timer from "timing/Timer";

export const TYPE_PROCESSOR: string = 'Processor';

export interface ProcessorInput {
    [id: string]: any;
};

export interface ProcessorOutput {
    [id: string]: any;
}

interface TimedProcessorOutput extends ProcessorOutput {
    processorType: string;
    payload: object | undefined;
    children: ProcessorOutput[];
    timing: TimerOutput | undefined;
}

export interface Processor {
    type: string;
    process(input: ProcessorInput | undefined): ProcessorOutput | void;
}


function wrapProcess(
    func: Func<ProcessorInput | undefined, ProcessorOutput | void>,
    input: ProcessorInput | undefined,
    context: any,
): ProcessorOutput {
    let output: object | void = {};
    const timing: TimerOutput = new Timer().timeExecution(() => {
        output = func.call(context, input || {});
    });

    return {
        processorType: (output && (output as TimedProcessorOutput).processorType) || context.type,
        payload: (output && (output as TimedProcessorOutput).payload) || undefined,
        children: (output && (output as TimedProcessorOutput).children) || [],
        timing,
    };
}

/**
 * Decorator to wrap a process function in a timer
 */
export function timed(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
    const tmp: any = descriptor.value;
    descriptor.value = function (input: ProcessorInput | undefined): ProcessorOutput | void {
        // @ts-ignore
        return wrapProcess(tmp, input, this);
    }
}

/**
 * Decorator to wrap any member method to define it as a processor
 */
// export function processor(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
//     return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//         const method: any = descriptor.value;
//         descriptor.value = (...args: any[]): ProcessorOutput => {
//             let output: object | void = {};
//             const timing: TimerOutput = new Timer().timeExecution(() => {
//                 output = method.apply(target, args);
//             });

//             return {
//                 processorType: `${target.type}.${propertyKey}`,
//                 payload: output,
//                 children: [],
//                 timing,
//             };
//         }
//     }
// }

bindFactory<Processor>(TYPE_PROCESSOR);
