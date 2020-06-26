import ErrorMapper from 'utils/ErrorMapper';
import RectFinder from 'planning/rect/RectFinder';
import LargestRectLLUR from 'planning/rect/LargestRectLLUR';
import FindRectsVH from 'planning/rect/FindRectsVH';
import Matrix from 'collection/Matrix';
import RectSearch from 'planning/rect/model/RectSearch';
import RectParameters from 'planning/rect/model/RectParameters';
import LargestRectInput from 'planning/rect/model/LargestRectInput';
import FindRectsHeuristic from 'planning/rect/interface/FindRectsHeuristic';

export const loop = ErrorMapper.wrapLoop(() => {
    const rectFinder: RectFinder<FindRectsHeuristic, LargestRectLLUR> =
        new RectFinder(new FindRectsVH(), new LargestRectLLUR());

    const matrix: Matrix<number> = Matrix.fromArray([[0]]);
    const search: RectSearch = RectSearch.fromCoords(0, 0, 0, 0);
    const params: RectParameters = new RectParameters(0, 0);

    const input: LargestRectInput = new LargestRectInput(matrix, search, params);
    rectFinder.getLargestRect(input);
});
