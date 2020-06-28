export class ActiveCreeps {
    public capacity: number = 0;
    public active: Id<Creep>[] = [];
}

export default interface ScreepsSourceMemory {
    id: Id<Source>;
    containerId: Id<StructureContainer> | null;
    containerSiteId: Id<ConstructionSite> | null;
    flagId: string | null;

    pawns: ActiveCreeps;
    couriers: ActiveCreeps;
    builders: ActiveCreeps;
    miners: ActiveCreeps;
}
