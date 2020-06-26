import Pair from "./Pair";

export default class MonoPair<T> extends Pair<T, T> {
    public get start(): T {
        return this.x;
    }

    public get end(): T {
        return this.y;
    }

    public get first(): T {
        return this.x;
    }

    public get second(): T {
        return this.y;
    }

    public get a(): T {
        return this.x;
    }

    public get b(): T {
        return this.y;
    }
}
