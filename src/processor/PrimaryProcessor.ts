import { injectable, inject } from "inversify";

import Processor from "./Processor";

import MemoryManager, * as MemoryManagerMeta from "service/memory/MemoryManager";
import MessageBus, * as MessageBusMeta from "service/messageBus/MessageBus";

import RectFinder from "planning/rect/RectFinder";
import FindRectsHeuristic from "planning/rect/interface/FindRectsHeuristic";
import LargestRectLLUR from "planning/rect/LargestRectLLUR";
import FindRectsVH from "planning/rect/FindRectsVH";
import Matrix from "collection/Matrix";
import RectSearch from "planning/rect/model/RectSearch";
import RectParameters from "planning/rect/model/RectParameters";
import LargestRectInput from "planning/rect/model/LargestRectInput";

@injectable()
export default class PrimaryProcessor implements Processor {
    private memoryManager: MemoryManager;
    private messageBus: MessageBus;

    public constructor(
        @inject(MemoryManagerMeta.TYPE) memoryManager: MemoryManager,
        @inject(MessageBusMeta.TYPE) messageBus: MessageBus
    ) {
        this.memoryManager = memoryManager;
        this.messageBus = messageBus;
    }

    process(): void {
        // const rectFinder: RectFinder<FindRectsHeuristic, LargestRectLLUR> =
        //     new RectFinder(new FindRectsVH(), new LargestRectLLUR());

        // const matrix: Matrix<number> = Matrix.fromArray([[0]]);
        // const search: RectSearch = RectSearch.fromCoords(0, 0, 0, 0);
        // const params: RectParameters = new RectParameters(0, 0);

        // const input: LargestRectInput = new LargestRectInput(matrix, search, params);
        // rectFinder.getLargestRect(input);

        this.messageBus.processMessages();
    }
}
