import { injectable, inject } from "inversify";
import _ from "lodash";

import { Messaging } from "messaging";

import GameManager, * as GameManagerMeta from "service/game/GameManager";
import MemoryManager, * as MemoryManagerMeta from "service/memory/MemoryManager";

import MessageBus from "./MessageBus";
import ScreepsRoomObject from "screeps/ScreepsRoomObject";


@injectable()
export default class MainMessageBus implements MessageBus {
    private gameManager: GameManager;
    private memoryManager: MemoryManager;

    public constructor(
        @inject(GameManagerMeta.TYPE) gameManager: GameManager,
        @inject(MemoryManagerMeta.TYPE) memoryManager: MemoryManager
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
