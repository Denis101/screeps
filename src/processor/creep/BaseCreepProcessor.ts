import { Processor, ProcessorInput, timed } from "processor/Processor";
import { CreepComponent } from "creep/component/CreepComponent";
import ScreepsCreep from "screeps/ScreepsCreep";
import { CreepState } from "screeps/ScreepsCreepMemory";

export interface CreepProcessorInput extends ProcessorInput {
    creep: ScreepsCreep;
}

export interface CreepComponentStates {
    [state: string]: CreepComponent
}

export abstract class BaseCreepProcessor implements Processor {
    public readonly type: string;
    protected components: CreepComponentStates;

    public constructor(type: string, components: CreepComponentStates) {
        this.type = type;
        this.components = components;
    }

    @timed
    public process({ creep }: CreepProcessorInput): void {
        if (!creep.getMemory().roleId) {
            creep.suicide();
            return;
        }

        const state: string = this.getStateInternal(creep);
        const oldState: CreepState = creep.getMemory().state;
        const newState: CreepState = {
            current: state,
            previous: oldState.current !== state ? oldState.current : oldState.previous,
            lastTick: oldState.current,
        };

        if (newState.current !== newState.lastTick) {
            this.components[oldState.current].handleEnd({ creep });
            this.components[newState.current].handleBegin({ creep });
        }

        this.components[newState.current].handleTick({ creep });
        creep.getMemory().state = newState;
    }

    public getComponentTypes(): string[] {
        return Object.keys(this.components);
    }

    private getStateInternal(creep: ScreepsCreep): string {
        const value: string | void = this.getState(creep);
        return value ? value : 'idle'; // TODO; create idle component
    }

    protected abstract getState(creep: ScreepsCreep): string | void;
}
