import {
    Position,
    Map as MapInterface,
    Road as RoadInterface,
    RoadTile as RoadTileInterface,
    Car as CarInterface,
    Cars as CarsInterface,
    Positions
} from "../../interfaces"
import { getKey } from "../../functions"
import { RoadTile } from "./RoadTile";
import { Car } from "../../common/Car";
import { Position as Pos } from "../../common/Position";

export class Map implements MapInterface {
    tilesX: Array<number>;
    tilesY: Array<number>;
    road: RoadInterface;
    cars: CarsInterface;

    constructor() {
        this.tilesX = [];
        this.tilesY = [];
        this.road = {};
        this.cars = {};

        // Add all tiles (20x20)
        for (let i: number = 0; i < 20; i++) {
            this.tilesX.push(i);
            this.tilesY.push(i);
        }

        for (let value of this.tilesX) {
            let bottomRoadLinePosition = new Pos(value, 10);
            let topRoadLinePosition = new Pos(value, 9);
            this.road[bottomRoadLinePosition.toString()] = new RoadTile(bottomRoadLinePosition, [
                new Pos(bottomRoadLinePosition.x+1, bottomRoadLinePosition.y)
            ]);
            this.road[topRoadLinePosition.toString()] = new RoadTile(topRoadLinePosition, [
                new Pos(topRoadLinePosition.x-1, topRoadLinePosition.y)
            ]);
        }

        for (let value of this.tilesY) {
            let leftRoadLinePosition = new Pos(9, value);
            let rightRoadLinePosition = new Pos(10, value);
            if (this.road[leftRoadLinePosition.toString()] === undefined) {
                this.road[leftRoadLinePosition.toString()] = new RoadTile(leftRoadLinePosition, [
                    new Pos(leftRoadLinePosition.x, leftRoadLinePosition.y+1)
                ]);
            } else {
                this.road[leftRoadLinePosition.toString()].directions.push(
                    new Pos(leftRoadLinePosition.x, leftRoadLinePosition.y+1)
                );
            }
            if (this.road[rightRoadLinePosition.toString()] === undefined) {
                this.road[rightRoadLinePosition.toString()] = new RoadTile(rightRoadLinePosition, [
                    new Pos(rightRoadLinePosition.x, rightRoadLinePosition.y-1)
                ]);
            } else {
                this.road[rightRoadLinePosition.toString()].directions.push(
                    new Pos(rightRoadLinePosition.x, rightRoadLinePosition.y-1)
                );
            }
        }
    }

    iterate(): void {
        for (let index in this.cars) {
            let car: CarInterface = this.cars[index];
            let nextPosition = car.getNextPosition();

            if (nextPosition.toString() === car.destination.toString()) {
                delete this.cars[index];
                continue;
            }

            if (this.isCar(nextPosition) === true) {
                continue;
            }

            car.driveTo(nextPosition);
            this.cars[nextPosition.toString()] = car;
            delete this.cars[index];
        }
    }

    validator: CallableFunction = (current: Position, destination: Position) => {
        console.log("Validate:");
        console.log("From:" + current);
        console.log("To:" + destination);
        if (this.isRoad(destination) === false) {
            return false;
        }

        console.log(this.road[current.toString()]);
        if (this.road[current.toString()].directions.find(direction => direction.toString() === destination.toString()) === undefined) {
            return false;
        }

        console.log("TRUE");
        return true;
    }

    getRoadByPosition(position: Position): RoadTileInterface | undefined {
        return this.road[position.toString()];
    }

    getCarByPosition(position: Position): CarInterface | undefined {
        return this.cars[position.toString()];
    }

    isRoad(position: Position): boolean {
        return this.getRoadByPosition(position) !== undefined;
    }

    isCar(position: Position): boolean {
        return this.getCarByPosition(position) !== undefined;
    }

    addCar(position: Position, destination: Position): void {
        if (this.isRoad(position) === false || this.isRoad(destination) === false) {
            throw new Error("Position and destination should be a valid coordinates of the road");
        }

        if (this.isCar(position) === true) {
            throw new Error("There's already a car on this position");
        }

        // todo calculate path to destination as Array<Position>
        let path = this.getPathForCar(position, destination);
        this.cars[position.toString()] = new Car(position, destination, path);
    }

    getPathForCar(start: Position, destination: Position): Array<Position> {
        return this.getPath(start, destination, this.validator); // todo change validator to carPositionValidator
    }

    getPath(start: Position, destination: Position, positionValidator: CallableFunction): Array<Position> {
        let isPathFound: boolean = false;
        let frontier: Positions = {};
        let cameFrom: Positions = {};
        frontier[start.toString()] = start;
        cameFrom[start.toString()] = start;

        while (Object.keys(frontier).length > 0) {
            let currentPosition: Position = frontier[Object.keys(frontier)[0]];
            delete frontier[currentPosition.toString()];
            let neighbors: Array<Position> = this.getNeighborTilesPositions(currentPosition, positionValidator);
            
            for (let nextPosition of neighbors) {
                if (cameFrom[nextPosition.toString()] === undefined) {
                    frontier[nextPosition.toString()] = nextPosition;
                    cameFrom[nextPosition.toString()] = currentPosition;
                }
            }
        }

        let path: Array<Position> = [];
        let current = destination;
        while (current.toString() !== start.toString()) {
            path.push(current);
            current = cameFrom[current.toString()];
            if (current === undefined) {
                console.log("Path from " + start + " to " + destination + " not found")
                return [];
            }
        }
    
        return path.reverse();
    }

    getNeighborTilesPositions(position: Position, positionValidator: CallableFunction): Array<Position> {
        let neighbors: Array<Position> = [];

        let candidates = [
            new Pos(position.x+1, position.y),
            new Pos(position.x-1, position.y),
            new Pos(position.x, position.y+1),
            new Pos(position.x, position.y-1),
        ];

        for (let candidate of candidates) {
            if (positionValidator(position, candidate) === true) {
                neighbors.push(candidate);
            }
        }

        return neighbors;
    }
}