import { inject } from "inversify";
import { service } from "inversify.config";
import _ from "lodash";

import { Messaging } from "messaging";

import { GameManager, GameManagerImpl } from "service/GameManager";
import { MemoryManager, MemoryManagerImpl } from "service/MemoryManager";
import ScreepsRoomObject from "screeps/ScreepsRoomObject";

export const TYPE: string = 'MessageBus';

export interface MessageBus {
    type: string;
    processMessages(): void;
    processMessage(message: Messaging.Message): boolean;
};

@service<MessageBus>(TYPE)
export class MessageBusImpl implements MessageBus {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private gameManager: GameManager;
    private memoryManager: MemoryManager;

    public constructor(
        @inject(GameManagerImpl.TYPE) gameManager: GameManager,
        @inject(MemoryManagerImpl.TYPE) memoryManager: MemoryManager
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

        return (obj as ScreepsRoomObject).receiveMessage(message.sender, message.tick, message.payload);
    }
}
