import ScreepsRoomMemory, { ScreepsSourceMemories } from "./ScreepsRoomMemory";

export default class ScreepsSource extends Source {
    public getContainer(): Id<StructureContainer> | null {
        const sources: ScreepsSourceMemories = (Memory.rooms[this.room.name] as ScreepsRoomMemory).sources;
        for (const src of Object.values(sources)) {
            if (src.id !== this.id) {
                continue;
            }

            return src.containerId;
        }

        return null;
    }

    public hasContainer(): boolean {
        return this.getContainer() !== null;
    }
}
