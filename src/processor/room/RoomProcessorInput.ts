import { ProcessorInput } from "processor/Processor";

export default class RoomProcessorInput implements ProcessorInput {
    private _room: Room;

    public constructor(room: Room) {
        this._room = room;
    }

    public get room(): Room {
        return this._room;
    }
}
