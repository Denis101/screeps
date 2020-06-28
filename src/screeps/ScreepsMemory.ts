import { Messaging } from "messaging";
import TimerOutput from "timing/TimerOutput";

export default interface ScreepsMemory extends Memory {
    debug: boolean;
    messages: Messaging.Message[][];
    previousExecutionTime: TimerOutput;
}
