import { getKey } from "../functions";

export class Position {
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return getKey(this.x, this.y);
    }
}