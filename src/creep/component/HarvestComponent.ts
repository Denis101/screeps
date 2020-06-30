import { component } from "inversify.config";
import { timed } from "processor/Processor";

import { CreepComponent, TYPE_CREEP_COMPONENT, CreepComponentInput, ComponentMemory } from "./CreepComponent";

const TYPE: string = 'HarvestComponent';

export interface HarvestComponentMemory extends ComponentMemory {
    harvesting: boolean;
    sourceId: Id<Source> | null;
}

@component<CreepComponent>(TYPE_CREEP_COMPONENT, TYPE)
export default class HarvestComponent implements CreepComponent {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    canHandle({ creep }: CreepComponentInput): boolean {
        const id: Id<Source> | null =
            creep.getComponentMemory<HarvestComponentMemory>(HarvestComponent.TYPE).sourceId;
        if (!id) {
            return false;
        }

        const source: Source | null = Game.getObjectById(id);
        if (!source) {
            return false;
        }

        return source.energy > 0;
    }

    public handleBegin({ creep }: CreepComponentInput): void {
        creep.say('👨‍🌾');
    }

    @timed
    public handleTick({ creep }: CreepComponentInput): void {
        const id: Id<Source> | null =
            creep.getComponentMemory<HarvestComponentMemory>(HarvestComponent.TYPE).sourceId;
        if (!id) {
            return;
        }

        const source: Source | null = Game.getObjectById(id);
        if (!source) {
            return;
        }

        switch (creep.harvest(source)) {
            case OK:
                // creep.sendMessage(creep.getOwnerSpawnId(), {
                //     action: 'HARVEST',
                //     value: creep.memory.abilities.harvest,
                // });
                break;
            case ERR_NOT_IN_RANGE:
            case ERR_NOT_ENOUGH_RESOURCES:
            default:
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }

    // tslint:disable-next-line:no-empty
    public handleEnd({ creep }: CreepComponentInput): void { }
}
