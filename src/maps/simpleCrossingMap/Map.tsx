import { 
    Map as MapInterface,
    Road as RoadInterface,
    RoadTile as RoadTileInterface
} from "../../interfaces"
import { getKey } from "../../functions"
import { RoadTile } from "./RoadTile";

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

    getRoadByPosition(x:number, y:number): RoadTileInterface | undefined {
        return this.road[getKey(x, y)];
    }

    isRoad(x:number, y:number): boolean {
        return this.getRoadByPosition(x, y) !== undefined;
    }
}