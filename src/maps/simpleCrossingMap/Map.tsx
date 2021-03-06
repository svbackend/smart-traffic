import {
    Map as MapInterface,
    Road as RoadInterface,
    RoadTile as RoadTileInterface,
    Car as CarInterface,
    Cars as CarsInterface,
    PathFinder as PathFinderInterface,
    Positions
} from "../../interfaces"
import { getKey } from "../../functions"
import { RoadTile } from "./RoadTile";
import { Car } from "../../common/Car";
import { Position } from "../../common/Position";
import { PathFinder } from "../../common/PathFinder";

export class Map implements MapInterface {
    tilesX: Array<number>;
    tilesY: Array<number>;
    road: RoadInterface;
    cars: CarsInterface;
    pathFinder: PathFinderInterface = new PathFinder;
    movedTiles: Array<string> = [];

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
            let bottomRoadLinePosition = new Position(value, 10);
            let topRoadLinePosition = new Position(value, 9);
            this.road[bottomRoadLinePosition.toString()] = new RoadTile(bottomRoadLinePosition, [
                new Position(bottomRoadLinePosition.x+1, bottomRoadLinePosition.y)
            ]);
            this.road[topRoadLinePosition.toString()] = new RoadTile(topRoadLinePosition, [
                new Position(topRoadLinePosition.x-1, topRoadLinePosition.y)
            ]);
        }

        for (let value of this.tilesY) {
            let leftRoadLinePosition = new Position(9, value);
            let rightRoadLinePosition = new Position(10, value);
            if (this.road[leftRoadLinePosition.toString()] === undefined) {
                this.road[leftRoadLinePosition.toString()] = new RoadTile(leftRoadLinePosition, [
                    new Position(leftRoadLinePosition.x, leftRoadLinePosition.y+1)
                ]);
            } else {
                this.road[leftRoadLinePosition.toString()].directions.push(
                    new Position(leftRoadLinePosition.x, leftRoadLinePosition.y+1)
                );
            }
            if (this.road[rightRoadLinePosition.toString()] === undefined) {
                this.road[rightRoadLinePosition.toString()] = new RoadTile(rightRoadLinePosition, [
                    new Position(rightRoadLinePosition.x, rightRoadLinePosition.y-1)
                ]);
            } else {
                this.road[rightRoadLinePosition.toString()].directions.push(
                    new Position(rightRoadLinePosition.x, rightRoadLinePosition.y-1)
                );
            }

            if (value <= 8) {
                let leftRoadLinePosition2 = new Position(8, value);
                this.road[leftRoadLinePosition2.toString()] = new RoadTile(leftRoadLinePosition2, [
                    new Position(leftRoadLinePosition2.x, leftRoadLinePosition2.y+1)
                ]);
            }
        }
    }

    iterate(): void {
        //this.movedTiles = [];
        
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
            //this.movedTiles.push(car.position.toString());
            car.driveTo(nextPosition);
            this.cars[nextPosition.toString()] = car;
            delete this.cars[index];
        }
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

    carPositionValidator: CallableFunction = (current: Position, destination: Position) => {
        if (this.isRoad(destination) === false) {
            return false;
        }

        if (this.road[current.toString()].directions.find(direction => direction.toString() === destination.toString()) === undefined) {
            return false;
        }

        return true;
    }

    carPathCache: {[key: string]: Array<Position>} = {}
    getPathForCar(start: Position, destination: Position): Array<Position> {
        let cacheKey = start.toString() + destination.toString();
        let path: Array<Position>;
        
        if (this.carPathCache[cacheKey] === undefined) {
            path = this.pathFinder.getPath(start, destination, this.carPositionValidator);
            this.carPathCache[cacheKey] = path.slice(0);
        } else {
            path = this.carPathCache[cacheKey].slice(0);
        }

        return path;
    }

    
}