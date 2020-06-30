import { inject } from "inversify";
import { factoryType, component } from "inversify.config";

import { ProcessorSupplier, ProcessorSupplierOptions, TYPE_PROCESSOR_SUPPLIER } from "processor/ProcessorSupplier";

import { Processor, TYPE_PROCESSOR } from "processor/Processor";
import { CreepPawnProcessor } from "./CreepPawnProcessor";

const TYPE: string = 'CreepProcessorSupplier';

export interface CreepProcessorSupplierOptions extends ProcessorSupplierOptions {
    roleId: string;
}

@component<ProcessorSupplier>(TYPE_PROCESSOR_SUPPLIER, TYPE)
export class CreepProcessorSupplier implements ProcessorSupplier {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private _factory: (named: string) => Processor;

    constructor(
        @inject(factoryType(TYPE_PROCESSOR)) factory: (named: string) => Processor
    ) {
        this._factory = factory;
    }

    public get(options: CreepProcessorSupplierOptions): Processor {
        const role: string = options.roleId.split(':')[1]; // todo; move this to better place

        switch (role) {
            case 'pawn':
            default:
                return this._factory(CreepPawnProcessor.TYPE);
        }
    }
}
