import { Position, Car as CarInterface } from "../interfaces";

export class Car  {
    position: Position;
    destination: Position;

    constructor(position: Position, destination: Position) {
        this.position = position;
        this.destination = destination;
    }

    driveTo(position: Position): void {
        this.position = position;
    }
}