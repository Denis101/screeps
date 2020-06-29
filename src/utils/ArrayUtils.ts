export default class ArrayUtils {
    public static distinct<T>(values: T[], predicate: BiPredicate<T, T>): T[] {
        return values.filter((d: T, i: number, self: T[]) =>
            i === self.findIndex((z: T) => predicate(z, d)));
    }

    public static sum<T>(
        values: T[],
        getter: Func<T, number> = (t: T) => (t as unknown) as number
    ): number {
        let result: number = 0;
        for (const v of values) {
            result += getter(v);
        }
        return result;
    }
}
