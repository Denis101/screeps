import Pair from "./Pair";

export default class KeyValuePair<K, V> extends Pair<K, V> {
    public get key(): K {
        return this.x;
    }

    public get value(): V {
        return this.y;
    }
}
