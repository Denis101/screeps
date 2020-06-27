export default class TimerOutput {
    private _start: number;
    private _end: number;
    private _delta: number;

    public constructor(start: number, end: number, delta: number) {
        this._start = start;
        this._end = end;
        this._delta = delta;
    }

    public get start(): number {
        return this._start;
    }

    public get end(): number {
        return this._end;
    }

    public get delta(): number {
        return this._delta;
    }
}
