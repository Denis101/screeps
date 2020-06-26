import { Messaging } from "messaging";

export default interface ScreepsMemory extends Memory {
    debug: string;
    messages: Messaging.Message[][];
}
