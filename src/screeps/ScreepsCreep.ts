import { Messaging } from "messaging";
import ScreepsCreepMemory from "./ScreepsCreepMemory";

const TYPE: string = 'ScreepsCreep';

export default class ScreepsCreep extends Creep implements Messaging.MessageSenderReceiver {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    public getMemory(): ScreepsCreepMemory {
        return this.memory as ScreepsCreepMemory;
    }

    public getComponentMemory<I>(type: string): I {
        return this.getMemory().components[type];
    }

    public getBuildTarget(): Id<ConstructionSite<BuildableStructureConstant>> | null | undefined {
        return this.getMemory().buildTarget;
    }

    public getBuildables(): BuildableStructureConstant[] {
        return this.getMemory().buildables;
    }

    public sendMessage(receiver: string, expire: number, payload: object): number {
        throw new Error("Method not implemented.");
    }

    public receiveMessage(sender: string, tick: number, payload: object): boolean {
        throw new Error("Method not implemented.");
    }
}
