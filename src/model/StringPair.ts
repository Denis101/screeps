import MonoPair from "./MonoPair";

export class StringPair extends MonoPair<string> {
    public concat(): string {
        return StringPair.concat(this);
    }

    public static concat(p: StringPair): string {
        return `${p.x}${p.y}`;
    }

    public concatDelim(d: string): string {
        return StringPair.concatDelim(this, d);
    }

    public static concatDelim(p: StringPair, d: string): string {
        return `${p.x}${d}${p.y}`;
    }
}
