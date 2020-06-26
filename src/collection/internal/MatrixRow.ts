export class MatrixRow<T> {
    private width: number;
    private values: T[];

    constructor(width: number, values: T[]) {
        if (values.length !== width) {
            throw Error('values doesnt match width');
        }

        this.width = width;
        this.values = values;
    }

    public get(idx: number): T {
        return this.values[idx];
    }

    public size(): number {
        return this.values.length;
    }

    public map<R>(mapper: MapperFunc<T, R>): MatrixRow<R> {
        return MatrixRow.map(this, mapper);
    }

    public static map<T, R>(input: MatrixRow<T>, mapper: MapperFunc<T, R>): MatrixRow<R> {
        return new MatrixRow(input.width, input.values.map(mapper));
    }
}
