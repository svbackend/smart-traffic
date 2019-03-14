import {
    Position,
    Map as MapInterface,
    Road as RoadInterface,
    RoadTile as RoadTileInterface,
    Car as CarInterface,
    Cars as CarsInterface
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
        let roadTile = new RoadTile;
        for (let value of this.tilesX) {
            this.road[getKey(value, 10)] = roadTile;
            this.road[getKey(value, 9)] = roadTile;
        }

        for (let value of this.tilesY) {
            this.road[getKey(9, value)] = roadTile;
            this.road[getKey(10, value)] = roadTile;
        }
    }

    iterate(): void {
        for (let index in this.cars) {
            let car: CarInterface = this.cars[index];
            car.driveTo(car.getNextPosition());

            console.log(car)
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
        this.cars[position.toString()] = new Car(position, destination, [
            new Pos(9, 1),
            new Pos(9, 2),
            new Pos(9, 3),
            destination
        ]);
    }
}