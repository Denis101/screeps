import { Messaging } from "messaging";

const TYPE = 'ScreepsRoomObject';

export default class ScreepsRoomObject extends RoomObject implements Messaging.MessageSenderReceiver {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    sendMessage(receiver: string, expire: number, payload: object): number {
        return Messaging.sendMessage((this as any).id, receiver, expire, payload);
    }

    receiveMessage<T>(sender: string, tick: number, payload: object): boolean {
        return Messaging.receiveMessage(sender, tick, payload);
    }
}
