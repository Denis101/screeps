import { component } from "inversify.config";
import { Processor, TYPE_PROCESSOR, timed } from "processor/Processor";

const TYPE: string = 'RoomOwnedProcessor';

@component<Processor>(TYPE_PROCESSOR, TYPE)
export class RoomOwnedProcessor implements Processor {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    @timed
    process(): void {
        console.log('room owned processor');
    }

}
