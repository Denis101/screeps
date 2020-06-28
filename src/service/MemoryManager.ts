import { inject } from "inversify";
import { service } from "inversify.config";
import { Messaging } from "messaging";

import ScreepsMemory from "screeps/ScreepsMemory";
import KeyValuePair from "model/KeyValuePair";

import { GameManager, _GameManager } from "service/GameManager";
import ScreepsRoomMemory from "screeps/ScreepsRoomMemory";
import { ProcessorOutput } from "processor/Processor";

export const TYPE: string = 'MemoryManager';

export interface MemoryManager {
    type: string;
    isDebug(): boolean;
    getMessageChannel(channel: number): Messaging.Message[];
    setMessageChannel(channel: number, messages: Messaging.Message[]): void;
    getAllMessages(): Messaging.Message[][];
    getRoom(name: string): ScreepsRoomMemory;
    hasRoom(name: string): boolean;
    getCreep(id: string): CreepMemory;
    getCreeps(): KeyValuePair<string, CreepMemory>[];
    getProcessorOutput(): ProcessorOutput;
    setProcessorOutput(output: ProcessorOutput): void;
    prune(): void;
};

@service<MemoryManager>(TYPE)
export class _MemoryManager implements MemoryManager {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private gameManager: GameManager;

    constructor(
        @inject(_GameManager.TYPE) gameManager: GameManager
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

    public getRoom(name: string): ScreepsRoomMemory {
        return <ScreepsRoomMemory>this.getMemory().rooms[name];
    }

    public hasRoom(name: string): boolean {
        return this.getRoom(name) !== null
            && this.getRoom(name) !== undefined;
    }

    public getCreep(id: string) {
        return this.getMemory().creeps[id];
    }

    public getCreeps(): KeyValuePair<string, CreepMemory>[] {
        return Object.keys(this.getMemory().creeps)
            .map((k: string) => new KeyValuePair(k, this.getMemory().creeps[k]));
    }

    public getProcessorOutput(): ProcessorOutput {
        return this.getMemory().processorOutput;
    }

    public setProcessorOutput(output: ProcessorOutput): void {
        this.getMemory().processorOutput = output;
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
