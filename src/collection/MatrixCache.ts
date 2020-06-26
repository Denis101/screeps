import Matrix from './Matrix';

export default class MatrixCache<T> {
    private invalid: T;
    private store: number[];

    constructor(size: number, value: number, invalid: T) {
        this.invalid = invalid;
        this.store = [];
        for (let i: number = 0; i < size; i++) {
            this.store[i] = value;
        }
    }

    update(y: number, width: number, matrix: Matrix<T>): void {
        for (let x: number = 0; x < width; x++) {
            if (matrix.get(y).get(x) !== this.invalid) {
                this.store[x]++;
            }
            else {
                this.store[x] = 0;
            }
        }
    }

    get(x: number): number {
        return this.store[x];
    }
}
