import { injectable, inject } from "inversify";
import { Messaging } from "messaging";

import ScreepsMemory from "screeps/ScreepsMemory";
import KeyValuePair from "model/KeyValuePair";

import { GameManager, TYPE_GAME_MANAGER } from "service/GameManager";

export const TYPE_MEMORY_MANAGER: symbol = Symbol('MemoryManager');

export interface MemoryManager {
    isDebug(): boolean;
    getMessageChannel(channel: number): Messaging.Message[];
    setMessageChannel(channel: number, messages: Messaging.Message[]): void;
    getAllMessages(): Messaging.Message[][];
    getCreep(id: string): CreepMemory;
    getCreeps(): KeyValuePair<string, CreepMemory>[];
    prune(): void;
};

@injectable()
export class _MemoryManager implements MemoryManager {
    private gameManager: GameManager;

    constructor(
        @inject(TYPE_GAME_MANAGER) gameManager: GameManager
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

    public setMessageChannel(channel: number, messages: Messaging.Message[]): void {
        this.getMemory().messages[channel] = messages;
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
