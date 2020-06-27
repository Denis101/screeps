import ErrorMapper from 'utils/ErrorMapper';

import container from './inversify.config';
import { Processor, TYPE_PROCESSOR } from 'processor/Processor';

export const loop: VoidFunc =
    ErrorMapper.wrapLoop(() =>
        container.get<Processor>(TYPE_PROCESSOR).process());
