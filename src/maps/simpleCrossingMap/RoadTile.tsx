import { RoadTile as RoadTileInterface } from "../../interfaces"
import { Position as PositionInterface } from "../../common/Position";
export class RoadTile implements RoadTileInterface {
    position: PositionInterface;
    directions: Array<PositionInterface>;
    constructor(position: PositionInterface, directions: Array<PositionInterface>) {
        this.position = position;
        this.directions = directions;
    }
}