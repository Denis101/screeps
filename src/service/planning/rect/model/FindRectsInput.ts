import Matrix from "collection/Matrix";
import RectSearch from "./RectSearch";
import RectParameters from "./RectParameters";
import { HeuristicInput } from "utils/Heuristic";
import RectFinderInput from "./RectFinderInput";

export default class FindRectsInput implements HeuristicInput {
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

    public static fromRectFinderInput(input: RectFinderInput): FindRectsInput {
        return new FindRectsInput(input.matrix, input.search, input.params);
    }
}
