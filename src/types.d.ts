type VoidFunc = () => void;
type Func<T, R> = (value: T) => R;
type BiFunc<A, B, R> = (a: A, b: B) => R;
type TriFunc<A, B, C, R> = (a: A, b: B, c: C) => R;
