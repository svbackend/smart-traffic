import { RoadTile as RoadTileInterface, Position as PositionInterface } from "../../interfaces"
export class RoadTile implements RoadTileInterface {
    position: PositionInterface;
    directions: Array<PositionInterface>;
    constructor(position: PositionInterface, directions: Array<PositionInterface>) {
        this.position = position;
        this.directions = directions;
    }
}