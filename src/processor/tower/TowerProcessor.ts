import { component } from "inversify.config";

import { Processor, ProcessorOutput, TYPE_PROCESSOR, timed } from "processor/Processor";

const TYPE: string = 'TowerProcessor';

interface TowerProcessorInput {
    tower: StructureTower;
}

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class TowerProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    @timed
    process(input: TowerProcessorInput | undefined): void | ProcessorOutput {
        if (!input) {
            return {
                error: 'Invalid input',
            };
        }

        const tower: StructureTower = input.tower;
        let closestDamagedStructure: Structure | null =
            tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure: Structure) =>
                    structure.hitsMax > 10000 && structure.hits < 10000
            });

        if (!closestDamagedStructure) {
            closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure: Structure) =>
                    structure.hits < structure.hitsMax
            });
        }

        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        const closestHostile: Creep | null = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
}
