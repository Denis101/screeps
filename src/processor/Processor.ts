
export const TYPE_PROCESSOR: symbol = Symbol('Processor');

export interface Processor {
    process(): void;
}
