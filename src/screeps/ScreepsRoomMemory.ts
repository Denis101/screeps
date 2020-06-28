import ScreepsSourceMemory from "./ScreepsSourceMemory";

export default interface ScreepsRoomMemory extends RoomMemory {
    sources: {
        [id: string]: ScreepsSourceMemory
    };
    owned: boolean;
}
