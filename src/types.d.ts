type VoidFunc = () => void;
type Func<T, R> = (value: T) => R;
type BiFunc<A, B, R> = (a: A, b: B) => R;
type TriFunc<A, B, C, R> = (a: A, b: B, c: C) => R;

type Predicate<T> = (value: T) => boolean;
type BiPredicate<A, B> = (a: A, b: B) => boolean;
type TriPredicate<A, B, C> = (a: A, b: B, c: C) => boolean;

type RoomAllocation = "HUB" | "FORTRESS" | "BARRACKS" | "OUTPOST" | "MINE";
