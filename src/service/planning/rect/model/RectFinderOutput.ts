import Rect from "model/Rect";

export default class RectFinderOutput {
    private _rects: Rect[];

    public constructor(rect: Rect[]) {
        this._rects = rect;
    }

    public get rects(): Rect[] {
        return this._rects;
    }
}
