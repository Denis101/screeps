import { inject } from "inversify";
import { service, factoryType } from "inversify.config";

import { ProcessorFactory, ProcessFactoryOptions, TYPE_PROCESSOR_FACTORY } from "processor/ProcessorFactory";
import { Processor } from "processor/Processor";
import { TYPE_ROOM_DISCOVERY_PROCESSOR } from "./RoomDiscoveryProcessor";
import { TYPE_ROOM_OWNED_PROCESSOR } from "./RoomOwnedProcessor";
import { TYPE_ROOM_UNOWNED_PROCESSOR } from "./RoomUnownedProcessor";

export const TYPE_ROOM_PROCESSOR: symbol = Symbol('RoomProcessor');

export interface RoomProcessorFactoryOptions extends ProcessFactoryOptions {
    discovered: boolean;
    owned: boolean;
}

@service<ProcessorFactory>(factoryType(TYPE_ROOM_PROCESSOR))
export class RoomProcessorFactory implements ProcessorFactory {
    private _factory: (name: symbol) => Processor;

    constructor(
        @inject(TYPE_PROCESSOR_FACTORY) factory: (name: symbol) => Processor
    ) {
        this._factory = factory;
    }

    getProcessor(options: RoomProcessorFactoryOptions): Processor {
        if (!options.discovered) {
            return this._factory(TYPE_ROOM_DISCOVERY_PROCESSOR);
        }

        if (options.owned) {
            return this._factory(TYPE_ROOM_OWNED_PROCESSOR);
        }

        return this._factory(TYPE_ROOM_UNOWNED_PROCESSOR);
    }

}
