import Matrix from "collection/Matrix";
import RectSearch from "./RectSearch";
import RectParameters from "./RectParameters";
import { HeuristicInput } from "utils/Heuristic";

export default class FindRectsInput implements HeuristicInput {
    private _heuristic: symbol;
    private _matrix: Matrix<number>;
    private _search: RectSearch;
    private _params: RectParameters;

    constructor(
        heuristic: symbol,
        matrix: Matrix<number>,
        search: RectSearch,
        params: RectParameters
    ) {
        this._heuristic = heuristic;
        this._matrix = matrix;
        this._search = search;
        this._params = params;
    }

    public get heuristic(): symbol {
        return this._heuristic;
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
