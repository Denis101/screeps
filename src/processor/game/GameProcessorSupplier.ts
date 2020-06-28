import { inject } from "inversify";
import { ProcessorSupplier, ProcessorSupplierOptions, TYPE_PROCESSOR_SUPPLIER } from "processor/ProcessorSupplier";
import { Processor, TYPE_PROCESSOR } from "processor/Processor";
import { factoryType, component } from "inversify.config";

export const TYPE_GAME_PROCESSOR_SUPPLIER: string = 'GameProcessorSupplier';

export interface GameProcessorSupplierOptions extends ProcessorSupplierOptions {
    type: string;
}

@component<ProcessorSupplier>(TYPE_PROCESSOR_SUPPLIER, TYPE_GAME_PROCESSOR_SUPPLIER)
export class GameProcessorSupplier implements ProcessorSupplier {
    public readonly TYPE: string = TYPE_GAME_PROCESSOR_SUPPLIER;
    private _factory: (named: string) => Processor;

    constructor(
        @inject(factoryType(TYPE_PROCESSOR)) factory: (named: string) => Processor
    ) {
        this._factory = factory;
    }

    get(options: GameProcessorSupplierOptions): Processor {
        return this._factory(options.type);
    }
}
