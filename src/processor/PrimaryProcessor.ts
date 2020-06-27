import { injectable, inject } from "inversify";

import Timer from "timing/Timer";
import TimerOutput from "timing/TimerOutput";
import NumberPair from "model/NumberPair";

import RoomVisualUtils from "utils/RoomVisualUtils";

import { SpawnLocationFinder, TYPE_SPAWN_LOCATION_FINDER } from "service/planning/spawn/SpawnLocationFinder";
import { GameManager, TYPE_GAME_MANAGER } from "service/GameManager";
import { MemoryManager, TYPE_MEMORY_MANAGER } from "service/MemoryManager";
import { MessageBus, TYPE_MESSAGE_BUS } from "service/MessageBus";

import { Processor } from "./Processor";
import SpawnLocationInput from "service/planning/spawn/model/SpawnLocationInput";
import RectParameters from "service/planning/rect/model/RectParameters";
import SpawnLocationOutput from "service/planning/spawn/model/SpawnLocationOutput";

@injectable()
export default class PrimaryProcessor implements Processor {
    private gameManager: GameManager;
    private memoryManager: MemoryManager;
    private messageBus: MessageBus;
    private spawnLocationFinder: SpawnLocationFinder;

    public constructor(
        @inject(TYPE_GAME_MANAGER) gameManager: GameManager,
        @inject(TYPE_MEMORY_MANAGER) memoryManager: MemoryManager,
        @inject(TYPE_MESSAGE_BUS) messageBus: MessageBus,
        @inject(TYPE_SPAWN_LOCATION_FINDER) spawnLocationFinder: SpawnLocationFinder
    ) {
        this.gameManager = gameManager;
        this.memoryManager = memoryManager;
        this.messageBus = messageBus;
        this.spawnLocationFinder = spawnLocationFinder;
    }

    process(): void {
        const timingResult: TimerOutput = new Timer().timeExecution(() => {
            for (const kv of this.gameManager.getRooms()) {
                const output: SpawnLocationOutput = this.spawnLocationFinder.find(
                    new SpawnLocationInput(kv.value, new RectParameters(133, 1)));
                RoomVisualUtils.drawPoint(new NumberPair(output.location.x, output.location.y));
                RoomVisualUtils.drawRect(output.rect);
            }

            // todo; main loop
            this.messageBus.processMessages();
        });
    }
}
