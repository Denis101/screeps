export default class ArrayUtils {
    public static distinct<T>(values: T[], predicate: BiPredicate<T, T>) {
        return values.filter((d, i, self) => i === self.findIndex(z => predicate(z, d)));
    }
}
