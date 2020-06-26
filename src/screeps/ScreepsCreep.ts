import { Messaging } from "messaging";

export default class ScreepsCreep extends Creep implements Messaging.MessageSenderReceiver {
    sendMessage(receiver: string, expire: number, payload: object): number {
        throw new Error("Method not implemented.");
    }
    receiveMessage(sender: string, tick: number, payload: object): boolean {
        throw new Error("Method not implemented.");
    }

}
