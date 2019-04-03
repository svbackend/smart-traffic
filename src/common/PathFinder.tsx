import { PathFinder as PathFinderInterface, Positions } from "../interfaces"
import { Position } from "../common/Position";
import { Position as Pos } from "./Position";

export class PathFinder implements PathFinderInterface {
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
                throw new Error("Path from " + start + " to " + destination + " not found")
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