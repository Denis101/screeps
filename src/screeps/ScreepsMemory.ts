import { Messaging } from "messaging";

export default interface ScreepsMemory extends Memory {
    debug: boolean;
    messages: Messaging.Message[][];
}
