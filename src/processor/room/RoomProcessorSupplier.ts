import { inject } from "inversify";
import { factoryType, component } from "inversify.config";

import { ProcessorSupplier, ProcessorSupplierOptions, TYPE_PROCESSOR_SUPPLIER } from "processor/ProcessorSupplier";
import { Processor, TYPE_PROCESSOR } from "processor/Processor";
import { TYPE_ROOM_DISCOVERY_PROCESSOR } from "./RoomDiscoveryProcessor";
import { TYPE_ROOM_OWNED_PROCESSOR } from "./RoomOwnedProcessor";
import { TYPE_ROOM_UNOWNED_PROCESSOR } from "./RoomUnownedProcessor";

export const TYPE_ROOM_PROCESSOR_SUPPLIER: string = 'RoomProcessorSupplier';

export interface RoomProcessorSupplierOptions extends ProcessorSupplierOptions {
    discovered: boolean;
    owned: boolean;
}

@component<ProcessorSupplier>(TYPE_PROCESSOR_SUPPLIER, TYPE_ROOM_PROCESSOR_SUPPLIER)
export class RoomProcessorSupplier implements ProcessorSupplier {
    public readonly TYPE: string = TYPE_ROOM_PROCESSOR_SUPPLIER;
    private _factory: (name: string) => Processor;

    constructor(
        @inject(factoryType(TYPE_PROCESSOR)) factory: (name: string) => Processor
    ) {
        this._factory = factory;
    }

    get(options: RoomProcessorSupplierOptions): Processor {
        if (!options.discovered) {
            return this._factory(TYPE_ROOM_DISCOVERY_PROCESSOR);
        }

        if (options.owned) {
            return this._factory(TYPE_ROOM_OWNED_PROCESSOR);
        }

        return this._factory(TYPE_ROOM_UNOWNED_PROCESSOR);
    }
}
