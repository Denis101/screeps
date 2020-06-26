import { injectable } from "inversify";
import ScreepsMemory from "screeps/ScreepsMemory";
import MemoryManager from "./MemoryManager";

@injectable()
export default class MainMemoryManager implements MemoryManager {
    public getMemory(): ScreepsMemory {
        return <ScreepsMemory>Memory;
    }
}
