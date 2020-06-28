export interface HeuristicInput {
    heuristic: string;
}
export interface HeuristicOutput { }

export default interface Heuristic<I extends HeuristicInput, O extends HeuristicOutput> {
    execute(input: I): O;
}
