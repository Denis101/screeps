import { MatrixRow } from "./internal/MatrixRow";

export default class Matrix<T> {
    private width: number = 0;
    private height: number = 0;
    private rows: MatrixRow<T>[] = [];

    private constructor(values: T[][] | null, rows: MatrixRow<T>[] | null) {
        if (values) {
            this.height = values.length;
            this.width = values[0].length;
            this.rows = [];

            for (let y: number = 0; y < this.height; y++) {
                this.rows.push(new MatrixRow<T>(this.width, values[y]));
            }
        }
        else if (rows) {
            this.height = rows.length;
            this.width = rows[0].size();
            this.rows = rows;
        }
    }

    public get(idx: number): MatrixRow<T> {
        return this.rows[idx];
    }

    public size(): number {
        return this.rows.length;
    }

    public map<R>(mapper: Func<T, R>): Matrix<R> {
        return Matrix.map(this, mapper);
    }

    public static map<T, R>(input: Matrix<T>, mapper: Func<T, R>): Matrix<R> {
        return Matrix.fromRows<R>(input.rows.map((row: MatrixRow<T>) => row.map(mapper)));
    }

    public static empty<T>(): Matrix<T> {
        return new Matrix(null, null);
    }

    public static fromArray<T>(values: T[][]): Matrix<T> {
        return new Matrix(values, null);
    }

    public static fromRows<T>(rows: MatrixRow<T>[]): Matrix<T> {
        return new Matrix(null, rows);
    }
}
