import { Position, Car as CarInterface } from "../interfaces";

export class Car {
    position: Position;
    destination: Position;
    path: Array<Position>; // Each position to get to destination

    constructor(position: Position, destination: Position, path: Array<Position>) {
        this.position = position;
        this.destination = destination;
        this.path = path;
    }

    driveTo(position: Position): void {
        this.position = position;
        let index = this.path.indexOf(position);
        if (index !== -1) {
            delete this.path[index];
            this.path.shift();
        }
    }

    getNextPosition(): Position {
        if (this.path.length === 0) {
            return this.destination;
        }
        return this.path[0];
    }
}