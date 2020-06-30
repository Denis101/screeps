import { inject } from "inversify";
import { service } from "inversify.config";
import { Messaging } from "messaging";

import ScreepsMemory from "screeps/ScreepsMemory";
import KeyValuePair from "model/KeyValuePair";

import { GameManager, GameManagerImpl } from "service/GameManager";
import ScreepsRoomMemory from "screeps/ScreepsRoomMemory";
import { ProcessorOutput } from "processor/Processor";
import ScreepsStructureMemory from "screeps/ScreepsStructureMemory";

export const TYPE: string = 'MemoryManager';

export interface StructureSegments {
    [name: string]: ScreepsStructureMemory[]
}

export interface MemoryManager {
    type: string;
    getMode(): GameMode;
    setMode(mode: GameMode): void;
    isDebug(): boolean;
    getMessageChannel(channel: number): Messaging.Message[];
    setMessageChannel(channel: number, messages: Messaging.Message[]): void;
    getAllMessages(): Messaging.Message[][];
    getRoom(name: string): ScreepsRoomMemory;
    getRoomCount(): number;
    setRoom(name: string, memory: ScreepsRoomMemory): void;
    hasRoom(name: string): boolean;
    getCreep(id: string): CreepMemory;
    getCreeps(): KeyValuePair<string, CreepMemory>[];
    setSegments(segments: StructureSegments): void;
    getProcessorOutput(): ProcessorOutput;
    setProcessorOutput(output: ProcessorOutput): void;
    prune(): void;
};

@service<MemoryManager>(TYPE)
export class MemoryManagerImpl implements MemoryManager {
    public static readonly TYPE: string = TYPE;
    public readonly type: string = TYPE;

    private gameManager: GameManager;

    constructor(
        @inject(GameManagerImpl.TYPE) gameManager: GameManager
    ) {
        this.gameManager = gameManager;

        if (!this.getAllMessages()) {
            this.getMemory().messages = [];
        }
    }

    public getMode(): GameMode {
        return this.getMemory().mode;
    }

    public setMode(mode: GameMode): void {
        this.getMemory().mode = mode;
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
        return this.getMemory().rooms[name] as ScreepsRoomMemory;
    }

    public getRoomCount(): number {
        return Object.keys(this.getMemory().rooms).length;
    }

    public setRoom(name: string, memory: ScreepsRoomMemory): void {
        this.getMemory().rooms[name] = memory;
    }

    public hasRoom(name: string): boolean {
        return this.getRoom(name) !== null
            && this.getRoom(name) !== undefined;
    }

    public getCreep(id: string): CreepMemory {
        return this.getMemory().creeps[id];
    }

    public getCreeps(): KeyValuePair<string, CreepMemory>[] {
        return Object.keys(this.getMemory().creeps)
            .map((k: string) => new KeyValuePair(k, this.getMemory().creeps[k]));
    }

    public setSegments(segments: StructureSegments): void {
        this.getMemory().segments = segments;
    }

    public getProcessorOutput(): ProcessorOutput {
        return this.getMemory().processorOutput;
    }

    public setProcessorOutput(output: ProcessorOutput): void {
        this.getMemory().processorOutput = output;
    }

    public prune(): void {
        for (let i: number = 0; i < this.getCreeps().length; i++) {
            const gameCreep: KeyValuePair<string, Creep> = this.gameManager.getCreeps()[i];
            if (!gameCreep || !gameCreep.value) {
                delete this.getMemory().creeps[gameCreep.key];
            }
        }
    }

    private getMemory(): ScreepsMemory {
        return Memory as ScreepsMemory;
    }
}
