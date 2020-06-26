export default interface Component {
    canHandle(): boolean;
    handleBegin(): void;
    handleTick(): void;
    handleEnd(): void;
}
