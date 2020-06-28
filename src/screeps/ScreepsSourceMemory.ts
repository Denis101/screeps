export default interface ScreepsSourceMemory {
    id: Id<Source>;
    containerId: Id<StructureContainer>;
    containerSiteId: Id<ConstructionSite>;
    flagId: string;

    // capacities
    pawnCapacity: number;
    courierCapacity: number;
    builderCapacity: number;
    minerCapacity: number;

    // creeps
    pawns: Id<Creep>[];
    couriers: Id<Creep>[];
    builders: Id<Creep>[];
    miners: Id<Creep>[];
}
