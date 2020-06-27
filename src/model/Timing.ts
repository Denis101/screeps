export default class Timing {
    private _lastTickMs: number;
    private _lastTick: number;
    private _tickCounter: number;
    private _tickTimeTotal: number;

    public constructor(
        lastTickMs: number,
        lastTick: number,
        tickCounter: number,
        tickTimeTotal: number
    ) {
        this._lastTickMs = lastTickMs;
        this._lastTick = lastTick;
        this._tickCounter = tickCounter;
        this._tickTimeTotal = tickTimeTotal;
    }

    public get lastTickMs(): number {
        return this._lastTickMs;
    }

    public get lastTick(): number {
        return this._lastTick;
    }

    public get tickCounter(): number {
        return this._tickCounter;
    }

    public get tickTimeTotal(): number {
        return this._tickTimeTotal;
    }
}
