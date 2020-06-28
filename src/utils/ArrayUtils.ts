export default class ArrayUtils {
    public static distinct<T>(values: T[], predicate: BiPredicate<T, T>) {
        return values.filter((d, i, self) => i === self.findIndex(z => predicate(z, d)));
    }

    public static sum<T>(values: T[], getter: Func<T, number> = (t: T) => <number>(<unknown>t)): number {
        let result: number = 0;
        for (const v of values) {
            result += getter(v);
        }
        return result;
    }
}
