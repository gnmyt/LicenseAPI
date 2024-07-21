export class LicenseMeta {
    public readonly key: string;
    public readonly value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    public getAsInteger(): number {
        return parseInt(this.value, 10);
    }

    public getAsDouble(): number {
        return parseFloat(this.value);
    }

    public getAsBoolean(): boolean {
        return this.value.toLowerCase() === "true";
    }
}
