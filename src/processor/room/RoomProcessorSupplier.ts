import { inject } from "inversify";
import { factoryType, component } from "inversify.config";

import { ProcessorSupplier, ProcessorSupplierOptions, TYPE_PROCESSOR_SUPPLIER } from "processor/ProcessorSupplier";
import { Processor, TYPE_PROCESSOR } from "processor/Processor";
import { RoomDiscoveryProcessor } from "./RoomDiscoveryProcessor";
import { RoomOwnedProcessor } from "./RoomOwnedProcessor";
import { RoomUnownedProcessor } from "./RoomUnownedProcessor";

const TYPE: string = 'RoomProcessorSupplier';

export interface RoomProcessorSupplierOptions extends ProcessorSupplierOptions {
    discovered: boolean;
    owned: boolean;
}

@component<ProcessorSupplier>(TYPE_PROCESSOR_SUPPLIER, TYPE)
export class RoomProcessorSupplier implements ProcessorSupplier {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private _factory: (name: string) => Processor;

    constructor(
        @inject(factoryType(TYPE_PROCESSOR)) factory: (name: string) => Processor
    ) {
        this._factory = factory;
    }

    get(options: RoomProcessorSupplierOptions): Processor {
        if (!options.discovered) {
            return this._factory(RoomDiscoveryProcessor.TYPE);
        }

        if (options.owned) {
            return this._factory(RoomOwnedProcessor.TYPE);
        }

        return this._factory(RoomUnownedProcessor.TYPE);
    }
}
