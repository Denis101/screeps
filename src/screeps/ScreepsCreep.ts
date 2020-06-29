import { Messaging } from "messaging";

const TYPE: string = 'ScreepsCreep';

export default class ScreepsCreep extends Creep implements Messaging.MessageSenderReceiver {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    public sendMessage(receiver: string, expire: number, payload: object): number {
        throw new Error("Method not implemented.");
    }

    public receiveMessage(sender: string, tick: number, payload: object): boolean {
        throw new Error("Method not implemented.");
    }
}
