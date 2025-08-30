export interface Position {
    row: number;
    col: number;
}

class CustomSet {
    private keyObj: { [key: string]: Position } = {};

    has([row, col]: [number, number]): boolean {
        return `${row},${col}` in this.keyObj;
    }
    add([row, col]: [number, number]): void {
        this.keyObj[`${row},${col}`] = { row, col };
    }
    delete([row, col]: [number, number]): void {
        delete this.keyObj[`${row},${col}`];
    }
    clear(): void {
        this.keyObj = {};
    }
    get size(): number {
        return Object.keys(this.keyObj).length;
    }
    values(): Position[] {
        return Object.values(this.keyObj).sort((a: Position, b: Position) => a.row - b.row || a.col - b.col);
    }
}

export default CustomSet;