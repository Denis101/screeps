import { bindFactory } from "inversify.config";
import ScreepsCreep from "screeps/ScreepsCreep";

export const TYPE_CREEP_COMPONENT: string = 'CreepComponent';

export interface ComponentMemory {

}

export interface CreepComponentInput {
    creep: ScreepsCreep;
}

export interface CreepComponent {
    type: string;
    canHandle(input: CreepComponentInput): boolean;
    handleBegin(input: CreepComponentInput): void;
    handleTick(input: CreepComponentInput): void;
    handleEnd(input: CreepComponentInput): void;
}

bindFactory<CreepComponent>(TYPE_CREEP_COMPONENT);
