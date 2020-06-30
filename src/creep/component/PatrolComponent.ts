import { component } from "inversify.config";
import { timed } from "processor/Processor";

import { CreepComponent, TYPE_CREEP_COMPONENT, CreepComponentInput } from "./CreepComponent";

const TYPE: string = 'PatrolComponent';

@component<CreepComponent>(TYPE_CREEP_COMPONENT, TYPE)
export default class PatrolComponent implements CreepComponent {

    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    canHandle({ creep }: CreepComponentInput): boolean {
        throw new Error("Method not implemented.");
    }

    public handleBegin({ creep }: CreepComponentInput): void {
        throw new Error("Method not implemented.");
    }

    @timed
    public handleTick({ creep }: CreepComponentInput): void {
        throw new Error("Method not implemented.");
    }

    public handleEnd({ creep }: CreepComponentInput): void {
        throw new Error("Method not implemented.");
    }
}
