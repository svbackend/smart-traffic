import { Map as MapInterface, Road as RoadInterface } from "../../interfaces"
import { getKey } from "../../functions"

export class Map implements MapInterface {
    tilesX: Array<number>;
    tilesY: Array<number>;
    road: RoadInterface;

    constructor() {
        this.tilesX = [];
        this.tilesY = [];
        this.road = {};

        // Add all tiles (20x20)
        for (let i: number = 0; i < 20; i++) {
            this.tilesX.push(i);
            this.tilesY.push(i);
        }

        // Mark which tiles are road
        for (let value of this.tilesX) {
            this.road[getKey(value, 10)] = {};
            this.road[getKey(value, 9)] = {};
        }

        for (let value of this.tilesY) {
            this.road[getKey(9, value)] = {};
            this.road[getKey(10, value)] = {};
        }
    }
}