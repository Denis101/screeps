import Rect from "model/Rect";
import NumberPair from "model/NumberPair";
import MonoPair from "model/MonoPair";
import RoomPositionPair from "model/RoomPositionPair";

export default class RectSearch {
    private _searchArea: Rect;

    private constructor(searchArea: Rect) {
        this._searchArea = searchArea;
    }

    public get x(): number {
        return this._searchArea.x;
    }

    public get y(): number {
        return this._searchArea.y;
    }

    public get w(): number {
        return this._searchArea.w;
    }

    public get h(): number {
        return this._searchArea.h;
    }

    public get area(): number {
        return this._searchArea.area;
    }

    public get perimeter(): number {
        return this._searchArea.perimeter;
    }

    public static fromRect(rect: Rect): RectSearch {
        return new RectSearch(rect);
    }

    public static fromPairs(start: NumberPair, end: NumberPair): RectSearch {
        return new RectSearch(new Rect(start.x, start.y, end.x - start.x, end.y - start.y));
    }

    public static fromPairs2(pair: MonoPair<NumberPair>): RectSearch {
        return new RectSearch(new Rect(pair.a.x, pair.a.y, pair.b.x - pair.a.x, pair.b.y - pair.a.y));
    }

    public static fromCoords(x1: number, y1: number, x2: number, y2: number): RectSearch {
        return RectSearch.fromPairs(new NumberPair(x1, y1), new NumberPair(x2, y2));
    }

    public static fromRectCoords(x1: number, y1: number, x2: number, y2: number): RectSearch {
        return RectSearch.fromRect(new Rect(x1, y1, x2, y2));
    }

    public static fromRoomPosition(positions: RoomPositionPair): RectSearch {
        return new RectSearch(Rect.fromRoomPosition(positions));
    }
}
