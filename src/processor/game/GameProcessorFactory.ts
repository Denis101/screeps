import { inject } from "inversify";
import { ProcessorFactory, ProcessFactoryOptions, TYPE_PROCESSOR_FACTORY } from "processor/ProcessorFactory";
import { Processor } from "processor/Processor";
import { service, factoryType } from "inversify.config";

export const TYPE_GAME_PROCESSOR: symbol = Symbol('GameProcessor');

export interface GameProcessorFactoryOptions extends ProcessFactoryOptions {
    type: symbol;
}

@service<ProcessorFactory>(factoryType(TYPE_GAME_PROCESSOR))
export class GameProcessorFactory implements ProcessorFactory {
    private _factory: (name: symbol) => Processor;

    constructor(
        @inject(TYPE_PROCESSOR_FACTORY) factory: (name: symbol) => Processor
    ) {
        this._factory = factory;
    }

    getProcessor(options: GameProcessorFactoryOptions): Processor {
        return this._factory(options.type);
    }

}
