import { injectable, inject } from "inversify";

import _ from "lodash";
import ScreepsRoomObject from "screeps/ScreepsRoomObject";
import MessageBus from "./MessageBus";
import MemoryManager, * as MemoryManagerMeta from "service/memory/MemoryManager";
import { Messaging } from "messaging";

@injectable()
export default class MainMessageBus implements MessageBus {
    private memoryManager: MemoryManager;

    public constructor(
        @inject(MemoryManagerMeta.TYPE) memoryManager: MemoryManager
    ) {
        this.memoryManager = memoryManager;
    }

    processMessages(): void {
        const messages: Messaging.Message[][] = this.memoryManager.getMemory().messages;

        const AB: number = Game.time & 1;
        if (!messages[AB] || !messages[AB].length) {
            return;
        }

        _.remove(messages[AB], this.processMessage);
    }

    processMessage(message: Messaging.Message): boolean {
        if (Game.time > message.expire) {
            return true;
        }
        const obj: RoomObject = Game.getObjectById<ScreepsRoomObject>(message.receiver) || Game.flags[message.receiver];
        if (!obj) {
            return false;
        }

        return (<ScreepsRoomObject>obj).receiveMessage(message.sender, message.tick, message.payload);
    }
}
