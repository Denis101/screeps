import { component } from "inversify.config";
import { timed } from "processor/Processor";

import { CreepComponent, TYPE_CREEP_COMPONENT, CreepComponentInput } from "./CreepComponent";

const TYPE: string = 'DropComponent';

@component<CreepComponent>(TYPE_CREEP_COMPONENT, TYPE)
export default class DropComponent implements CreepComponent {

    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    canHandle(): boolean {
        return true;
    }

    public handleBegin({ creep }: CreepComponentInput): void {
        creep.say('💧');
    }

    @timed
    public handleTick({ creep }: CreepComponentInput): void {
        creep.drop(RESOURCE_ENERGY, creep.carry.energy);
    }

    // tslint:disable-next-line:no-empty
    public handleEnd(): void { }
}
