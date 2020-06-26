import ErrorMapper from 'utils/ErrorMapper';

import container from './inversify.config';
import Processor, * as ProcessorMeta from 'processor/Processor';

export const loop: VoidFunc = ErrorMapper.wrapLoop(() => container.get<Processor>(ProcessorMeta.TYPE).process());
