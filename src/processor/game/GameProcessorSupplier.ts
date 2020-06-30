import { inject } from "inversify";
import { ProcessorSupplier, ProcessorSupplierOptions, TYPE_PROCESSOR_SUPPLIER } from "processor/ProcessorSupplier";
import { Processor, TYPE_PROCESSOR } from "processor/Processor";
import { factoryType, component } from "inversify.config";

const TYPE: string = 'GameProcessorSupplier';

export interface GameProcessorSupplierOptions extends ProcessorSupplierOptions {
    type: string;
}

@component<ProcessorSupplier>(TYPE_PROCESSOR_SUPPLIER, TYPE)
export class GameProcessorSupplier implements ProcessorSupplier {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private _factory: (named: string) => Processor;

    constructor(
        @inject(factoryType(TYPE_PROCESSOR)) factory: (named: string) => Processor
    ) {
        this._factory = factory;
    }

    public get(options: GameProcessorSupplierOptions): Processor {
        return this._factory(options.type);
    }
}
