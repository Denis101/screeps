import { Messaging } from "messaging";

export default class ScreepsRoomObject extends RoomObject implements Messaging.MessageSenderReceiver {
    sendMessage(receiver: string, expire: number, payload: object): number {
        return Messaging.sendMessage((this as any).id, receiver, expire, payload);
    }

    receiveMessage<T>(sender: string, tick: number, payload: object): boolean {
        return Messaging.receiveMessage(sender, tick, payload);
    }
}
