import { Processor } from "./Processor";

export const TYPE_PROCESSOR_SUPPLIER: string = 'ProcessorSupplier';

export interface ProcessorSupplierOptions { }

export interface ProcessorSupplier {
    TYPE: string;
    get(options: ProcessorSupplierOptions): Processor
}
