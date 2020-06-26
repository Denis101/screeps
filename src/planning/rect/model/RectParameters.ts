export default class RectParameters {
    private _minArea: number;
    private _minPerimeter: number;

    constructor(minArea: number, minPerimeter: number) {
        this._minArea = minArea;
        this._minPerimeter = minPerimeter;
    }

    public get minArea(): number {
        return this._minArea;
    }

    public get minPerimeter(): number {
        return this._minPerimeter;
    }
}
