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

        // Mark which tiles are road
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
            this.road[leftRoadLinePosition.toString()] = new RoadTile(leftRoadLinePosition, [
                new Pos(leftRoadLinePosition.x, leftRoadLinePosition.y+1)
            ]);
            this.road[rightRoadLinePosition.toString()] = new RoadTile(rightRoadLinePosition, [
                new Pos(rightRoadLinePosition.x, rightRoadLinePosition.y-1)
            ]);;
        }
    }

    iterate(): void {
        for (let index in this.cars) {
            let car: CarInterface = this.cars[index];
            car.driveTo(car.getNextPosition());

            if (car.position.toString() === car.destination.toString()) {
                delete this.cars[index];
                continue;
            }

            if (car.position.toString() === index) {
                // if position didnt changed then we cant move this car at the moment
                continue;
            }
            this.cars[car.position.toString()] = car;
            delete this.cars[index];
        }
    }

    validator: CallableFunction = (position: Position) => {
        if (this.isRoad(position) === false || this.isCar(position) === true) {
            return false;
        }

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
            if (positionValidator(candidate) === true) {
                neighbors.push(candidate);
            }
        }

        return neighbors;
    }
}