import NumberPair from "./NumberPair";
import RoomPositionPair from "./RoomPositionPair";

export default class Rect {
    private _pos: NumberPair;
    private _size: NumberPair;

    constructor(x: number, y: number, w: number, h: number) {
        this._pos = new NumberPair(x, y);
        this._size = new NumberPair(w, h);
    }

    public get x(): number {
        return this._pos.x;
    }

    public get y(): number {
        return this._pos.y;
    }

    public get w(): number {
        return this._size.x;
    }

    public get h(): number {
        return this._size.y;
    }

    public get topLeft(): NumberPair {
        return this._pos;
    }

    public get bottomRight(): NumberPair {
        return NumberPair.add(this._pos, NumberPair.subtract(this._size, NumberPair.one));
    }

    public get left(): number {
        return this.topLeft.x;
    }

    public get top(): number {
        return this.topLeft.y;
    }

    public get right(): number {
        return this.bottomRight.x;
    }

    public get bottom(): number {
        return this.bottomRight.y;
    }

    public get area(): number {
        return this._size.product();
    }

    public get perimeter(): number {
        return this._size.sum();
    }

    public get centre(): NumberPair {
        return new NumberPair(
            Math.floor(this.x + (this.w / 2)),
            Math.floor(this.y + (this.h / 2)),
        );
    }

    public toRoomPosition(roomName: string): RoomPositionPair {
        return Rect.toRoomPosition(this, roomName);
    }

    public static toRoomPosition(rect: Rect, roomName: string): RoomPositionPair {
        return new RoomPositionPair(
            new RoomPosition(rect.x, rect.y, roomName),
            new RoomPosition(rect.x + rect.w, rect.y + rect.h, roomName),
        );
    }

    public static fromRoomPosition(roomPositions: RoomPositionPair): Rect {
        return new Rect(
            roomPositions.start.x,
            roomPositions.start.y,
            roomPositions.end.x - roomPositions.start.x,
            roomPositions.end.y - roomPositions.start.y);
    }
}
