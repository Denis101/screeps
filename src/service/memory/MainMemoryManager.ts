import { injectable, inject } from "inversify";
import { Messaging } from "messaging";

import ScreepsMemory from "screeps/ScreepsMemory";
import MemoryManager from "./MemoryManager";
import GameManager, * as GameManagerMeta from "service/game/GameManager";
import KeyValuePair from "model/KeyValuePair";

@injectable()
export default class MainMemoryManager implements MemoryManager {
    private gameManager: GameManager;

    constructor(
        @inject(GameManagerMeta.TYPE) gameManager: GameManager
    ) {
        this.gameManager = gameManager;

        if (!this.getAllMessages()) {
            this.getMemory().messages = [];
        }
    }

    public isDebug(): boolean {
        return this.getMemory().debug;
    }

    public getMessageChannel(channel: number): Messaging.Message[] {
        return this.getMemory().messages[channel];
    }

    public getAllMessages(): Messaging.Message[][] {
        return this.getMemory().messages;
    }

    public getCreep(id: string) {
        return this.getMemory().creeps[id];
    }

    public getCreeps(): KeyValuePair<string, CreepMemory>[] {
        return Object.keys(this.getMemory().creeps)
            .map((k: string) => new KeyValuePair(k, this.getMemory().creeps[k]));
    }

    public prune() {
        for (let i: number = 0; i < this.getCreeps().length; i++) {
            const gameCreep: KeyValuePair<string, Creep> = this.gameManager.getCreeps()[i];
            if (!gameCreep || !gameCreep.value) {
                delete this.getMemory().creeps[gameCreep.key];
            }
        }
    }

    private getMemory(): ScreepsMemory {
        return <ScreepsMemory>Memory;
    }
}
