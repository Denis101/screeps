
export const TYPE: symbol = Symbol('Processor');
export default interface Processor {
    process(): void;
}
