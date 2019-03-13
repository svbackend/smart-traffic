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

export class Map implements MapInterface {
    tilesX: Array<number>;
    tilesY: Array<number>;
    road: RoadInterface;
    cars: CarsInterface

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

        this.cars[position.toString()] = new Car(position, destination);
    }
}