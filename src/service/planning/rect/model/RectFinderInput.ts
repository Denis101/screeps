import Matrix from "collection/Matrix";
import RectSearch from "./RectSearch";
import RectParameters from "./RectParameters";

export default class RectFinderInput {
    private _matrix: Matrix<number>;
    private _search: RectSearch;
    private _params: RectParameters;

    constructor(matrix: Matrix<number>, search: RectSearch, params: RectParameters) {
        this._matrix = matrix;
        this._search = search;
        this._params = params;
    }

    public get matrix(): Matrix<number> {
        return this._matrix;
    }

    public get search(): RectSearch {
        return this._search;
    }

    public get params(): RectParameters {
        return this._params;
    }
}
