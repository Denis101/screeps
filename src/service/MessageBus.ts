import { injectable, inject } from "inversify";
import _ from "lodash";

import { Messaging } from "messaging";

import { GameManager, TYPE_GAME_MANAGER } from "service/GameManager";
import { MemoryManager, TYPE_MEMORY_MANAGER } from "service/MemoryManager";
import ScreepsRoomObject from "screeps/ScreepsRoomObject";


export const TYPE_MESSAGE_BUS: symbol = Symbol('MessageBus');

export interface MessageBus {
    processMessages(): void;
    processMessage(message: Messaging.Message): boolean;
};

@injectable()
export class _MessageBus implements MessageBus {
    private gameManager: GameManager;
    private memoryManager: MemoryManager;

    public constructor(
        @inject(TYPE_GAME_MANAGER) gameManager: GameManager,
        @inject(TYPE_MEMORY_MANAGER) memoryManager: MemoryManager
    ) {
        this.gameManager = gameManager;
        this.memoryManager = memoryManager;
    }

    processMessages(): void {
        const AB: number = this.gameManager.getTime() & 1;
        const messages: Messaging.Message[] =
            this.memoryManager.getMessageChannel(AB);
        if (!messages || !messages.length) {
            return;
        }

        _.remove(messages, this.processMessage);
    }

    processMessage(message: Messaging.Message): boolean {
        if (this.gameManager.getTime() > message.expire) {
            return true;
        }
        const obj: RoomObject =
            this.gameManager.getObjectById<ScreepsRoomObject>(message.receiver)
            || this.gameManager.getFlag(message.receiver);
        if (!obj) {
            return false;
        }

        return (<ScreepsRoomObject>obj).receiveMessage(message.sender, message.tick, message.payload);
    }
}
