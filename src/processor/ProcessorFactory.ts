import { Processor } from "./Processor";

export const TYPE_PROCESSOR_FACTORY: symbol = Symbol('Factory<Processor>');

export interface ProcessFactoryOptions { }

export interface ProcessorFactory {
    getProcessor(options: ProcessFactoryOptions): Processor
}
