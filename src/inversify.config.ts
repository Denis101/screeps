import "reflect-metadata";
import { Container } from "inversify";

import MemoryManager, * as MemoryManagerMeta from "service/memory/MemoryManager";
import MainMemoryManager from "service/memory/MainMemoryManager";

import MessageBus, * as MessageBusMeta from "service/messageBus/MessageBus";
import MainMessageBus from "service/messageBus/MainMessageBus";

import Processor, * as ProcessorMeta from "processor/Processor";
import PrimaryProcessor from "processor/PrimaryProcessor";

const container: Container = new Container();
container.bind<MemoryManager>(MemoryManagerMeta.TYPE).to(MainMemoryManager);
container.bind<MessageBus>(MessageBusMeta.TYPE).to(MainMessageBus);
container.bind<Processor>(ProcessorMeta.TYPE).to(PrimaryProcessor);

export default container;
