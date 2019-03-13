import { Position as PositionInterface } from "../interfaces"
import { getKey } from "../functions";

export class Position implements PositionInterface {
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