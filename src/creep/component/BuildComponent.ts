import { inject } from "inversify";
import MemoryManager, * as MemoryManagerMeta from "service/memory/MemoryManager";

import Component from "./Component";


export default class BuildComponent implements Component {
    private memoryManager: MemoryManager;

    constructor(
        @inject(MemoryManagerMeta.TYPE) memoryManager: MemoryManager
    ) {
        this.memoryManager = memoryManager;
    }

    canHandle(): boolean {
        throw new Error("Method not implemented.");
    }
    handleBegin(): void {
        throw new Error("Method not implemented.");
    }
    handleTick(): void {
        throw new Error("Method not implemented.");
    }
    handleEnd(): void {
        throw new Error("Method not implemented.");
    }

}
