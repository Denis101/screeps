import TimerOutput from "./TimerOutput";

export default class Timer {
    public timeExecution(func: VoidFunc): TimerOutput {
        const start: number = Date.now();
        func();
        const end: number = Date.now();
        return new TimerOutput(start, end, end - start);
    }
}
