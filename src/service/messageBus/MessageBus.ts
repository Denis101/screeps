import { Messaging } from "messaging";

export const TYPE: symbol = Symbol('MessageBus');

export default interface MessageBus {
    processMessages(): void;
    processMessage(message: Messaging.Message): boolean;
};
