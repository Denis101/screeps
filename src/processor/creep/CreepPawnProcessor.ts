import { inject, named } from "inversify";
import { component } from "inversify.config";

import { Processor, TYPE_PROCESSOR } from "processor/Processor";
import { BaseCreepProcessor } from "./BaseCreepProcessor";

import ScreepsCreep from "screeps/ScreepsCreep";

import { TYPE_CREEP_COMPONENT, CreepComponent } from "creep/component/CreepComponent";
import HarvestComponent, { HarvestComponentMemory } from "creep/component/HarvestComponent";
import ScavengeComponent from "creep/component/ScavengeComponent";
import WithdrawComponent from "creep/component/WithdrawComponent";
import BuildComponent from "creep/component/BuildComponent";
import UpgradeComponent from "creep/component/UpgradeComponent";
import { GameManager, GameManagerImpl } from "service/GameManager";
import ScreepsSource from "screeps/ScreepsSource";

const TYPE: string = 'CreepPawnProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class CreepPawnProcessor extends BaseCreepProcessor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private readonly gameManager: GameManager;

    public constructor(
        @inject(GameManagerImpl.TYPE) gameManager: GameManager,
        @inject(TYPE_CREEP_COMPONENT) @named(HarvestComponent.TYPE) harvest: CreepComponent,
        @inject(TYPE_CREEP_COMPONENT) @named(ScavengeComponent.TYPE) scavenge: CreepComponent,
        @inject(TYPE_CREEP_COMPONENT) @named(WithdrawComponent.TYPE) withdraw: CreepComponent,
        @inject(TYPE_CREEP_COMPONENT) @named(BuildComponent.TYPE) build: CreepComponent,
        @inject(TYPE_CREEP_COMPONENT) @named(UpgradeComponent.TYPE) upgrade: CreepComponent,
    ) {
        super(TYPE, {
            [HarvestComponent.TYPE]: harvest,
            [ScavengeComponent.TYPE]: scavenge,
            [WithdrawComponent.TYPE]: withdraw,
            [BuildComponent.TYPE]: build,
            [UpgradeComponent.TYPE]: upgrade,
        });

        this.gameManager = gameManager;
    }

    protected getState(creep: ScreepsCreep): string | void {
        const harvestMemory: HarvestComponentMemory = creep.getComponentMemory(HarvestComponent.TYPE);
        if (harvestMemory.harvesting && creep.carry.energy < creep.carryCapacity) {
            return this.handleHarvest(creep);
        }

        if (creep.carry.energy === 0) {
            if (!harvestMemory.harvesting) {
                harvestMemory.harvesting = true;
            }

            if (creep.carry.energy >= creep.carryCapacity) {
                harvestMemory.harvesting = false;
            }

            return this.handleHarvest(creep);
        }

        harvestMemory.harvesting = false;
        if (this.components[BuildComponent.TYPE].canHandle({ creep })) {
            return BuildComponent.TYPE;
        }

        if (this.components[UpgradeComponent.TYPE].canHandle({ creep })) {
            return UpgradeComponent.TYPE;
        }
    }

    private handleHarvest(creep: ScreepsCreep): string | void {
        const harvestMemory: HarvestComponentMemory = creep.getComponentMemory(HarvestComponent.TYPE);

        // handle edge case where builders and couriers are scavenging
        // due to no containers existing yet
        if (harvestMemory.sourceId) {
            const src: ScreepsSource =
                this.gameManager.getObjectById(harvestMemory.sourceId) as ScreepsSource;
            if (!src.hasContainer()
                && this.components[HarvestComponent.TYPE].canHandle({ creep })) {
                return HarvestComponent.TYPE;
            }
        }

        if (this.components[ScavengeComponent.TYPE].canHandle({ creep })) {
            return ScavengeComponent.TYPE;
        }

        if (this.components[WithdrawComponent.TYPE].canHandle({ creep })) {
            return WithdrawComponent.TYPE;
        }

        if (this.components[HarvestComponent.TYPE].canHandle({ creep })) {
            return HarvestComponent.TYPE;
        }
    }
}
