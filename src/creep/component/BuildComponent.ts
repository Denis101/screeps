import { inject } from "inversify";

import Component from "./Component";


export default class BuildComponent implements Component {
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
