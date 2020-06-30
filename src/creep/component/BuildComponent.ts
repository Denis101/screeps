import { component } from "inversify.config";
import { timed } from "processor/Processor";

import ScreepsRoomMemory, { RoomState } from "screeps/ScreepsRoomMemory";
import { CreepComponent, TYPE_CREEP_COMPONENT, CreepComponentInput, ComponentMemory } from "./CreepComponent";

const TYPE: string = 'BuildComponent';

export interface BuildComponentMemory extends ComponentMemory {
    buildTarget: Id<ConstructionSite<BuildableStructureConstant>> | null;
    buildables: BuildableStructureConstant[];
}

@component<CreepComponent>(TYPE_CREEP_COMPONENT, TYPE)
export default class BuildComponent implements CreepComponent {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    public canHandle({ creep }: CreepComponentInput): boolean {
        const buildMemory: BuildComponentMemory =
            creep.getComponentMemory<BuildComponentMemory>(BuildComponent.TYPE);

        if (creep.carry.energy <= 0) {
            return false;
        }

        if (creep.getBuildTarget()) {
            return true;
        }

        const targets: ConstructionSite<BuildableStructureConstant>[] =
            creep.room.find(FIND_CONSTRUCTION_SITES);
        if (!targets || targets.length <= 0) {
            return false;
        }

        for (const i in targets) {
            const target: ConstructionSite<BuildableStructureConstant> = targets[i];
            if (buildMemory.buildables.indexOf(target.structureType) < 0) {
                continue;
            }

            const err: number = creep.build(target);
            if (err >= 0 || err === ERR_NOT_IN_RANGE) {
                buildMemory.buildTarget = target.id;
                if (target.structureType === STRUCTURE_EXTENSION) {
                    return this.canBuildExtensions(creep);
                }

                return true;
            }
        }

        return false;
    }

    public handleBegin({ creep }: CreepComponentInput): void {
        creep.say('🚧');
    }

    @timed
    public handleTick({ creep }: CreepComponentInput): void {
        const buildMemory: BuildComponentMemory =
            creep.getComponentMemory<BuildComponentMemory>(BuildComponent.TYPE);
        if (!buildMemory.buildTarget) {
            return;
        }

        const obj: ConstructionSite<BuildableStructureConstant> | null =
            Game.getObjectById(buildMemory.buildTarget);
        if (!obj) {
            return;
        }

        const err: number = creep.build(obj);
        switch (err) {
            case OK:
                // creep.sendMessage(creep.getOwnerSpawnId(), {
                //     action: 'USE',
                //     value: creep.memory.abilities.build,
                // });
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(obj, { visualizePathStyle: { stroke: '#ffffff' } });
                break;
            default:
                buildMemory.buildTarget = null;
        }
    }

    public handleEnd({ creep }: CreepComponentInput): void {
        const buildMemory: BuildComponentMemory =
            creep.getComponentMemory<BuildComponentMemory>(BuildComponent.TYPE);
        if (!buildMemory.buildTarget) {
            return;
        }
        const obj: ConstructionSite<BuildableStructureConstant> | null =
            Game.getObjectById(buildMemory.buildTarget);
        if (!obj) {
            buildMemory.buildTarget = null;
        }
    }

    private canBuildExtensions(creep: Creep): boolean {
        const currentState: RoomState = (creep.room.memory as ScreepsRoomMemory).state.current;
        const desiredState: RoomState = (creep.room.memory as ScreepsRoomMemory).state.desired;
        return desiredState.extensionCount > currentState.extensionCount;
    }
}
