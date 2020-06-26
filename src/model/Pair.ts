export default class Pair<X, Y> {
    private _x: X;
    private _y: Y;

    constructor(x: X, y: Y) {
        this._x = x;
        this._y = y;
    }

    public get x(): X {
        return this._x;
    }

    public get y(): Y {
        return this._y;
    }

    public invert(): Pair<Y, X> {
        return Pair.invert(this);
    }

    public static invert<X, Y>(p: Pair<X, Y>): Pair<Y, X> {
        return new Pair(p.y, p.x);
    }
}
