import MonoPair from "./MonoPair";

export default class NumberPair extends MonoPair<number> {
    public product(): number {
        return NumberPair.product(this);
    }

    public static product(p: NumberPair): number {
        return p.x * p.y;
    }

    public sum(): number {
        return NumberPair.sum(this);
    }

    public static sum(p: NumberPair): number {
        return p.x + p.y;
    }

    public delta(): number {
        return NumberPair.delta(this);
    }

    public static delta(p: NumberPair): number {
        return p.x - p.y;
    }

    public static multiply(p1: NumberPair, p2: NumberPair): NumberPair {
        return new NumberPair(p1.x * p2.x, p1.y * p2.y);
    }

    public static add(p1: NumberPair, p2: NumberPair): NumberPair {
        return new NumberPair(p1.x + p2.x, p1.y + p2.y);
    }

    public static subtract(p1: NumberPair, p2: NumberPair): NumberPair {
        return new NumberPair(p1.x - p2.x, p1.y - p2.y);
    }

    public toRoomPosition(roomName: string): RoomPosition {
        return NumberPair.toRoomPosition(this, roomName);
    }

    public static toRoomPosition(pair: NumberPair, roomName: string): RoomPosition {
        return new RoomPosition(pair.x, pair.y, roomName);
    }
}
