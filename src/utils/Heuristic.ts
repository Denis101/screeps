export interface HeuristicInput { }
export interface HeuristicOutput { }

export default interface Heuristic<I extends HeuristicInput, O extends HeuristicOutput> {
    execute(input: I): O;
}
