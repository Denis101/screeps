export default class Stack<T> {
    private store: T[];

    constructor(...args: T[]) {
        this.store = [...args.reverse()];
    }

    peek(): T {
        return this.store[0];
    }

    push(value: T): number {
        return this.store.unshift(value);
    }

    pop(): T | undefined {
        return this.store.shift();
    }

    contains(value: T): boolean {
        for (const s of this.store) {
            if (s === value) {
                return true;
            }
        }

        return false;
    }

    empty(): boolean {
        return this.store.length <= 0;
    }
}
