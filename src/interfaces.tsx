import { Position } from "./common/Position"

export interface Map {
    tilesX: Array<number>;
    tilesY: Array<number>;
    road: Road;
    cars: Cars;
    movedTiles: Array<string>;

    getRoadByPosition(position: Position): RoadTile | undefined;
    getCarByPosition(position: Position): Car | undefined;
    isRoad(position: Position): boolean;
    isCar(position: Position): boolean;
    addCar(position: Position, destination: Position): void;
    iterate(): void;
}

export interface Road {
    [key: string]: RoadTile;
}

export interface Cars {
    [key: string]: Car;
}

export interface Positions {
    [key: string]: Position;
}

export interface RoadTile {
    position: Position;
    directions: Array<Position>
    // todo (directions, background etc.)
}

export interface Car {
    position: Position;
    destination: Position;
    driveTo(position: Position): void;
    getNextPosition(): Position;
}

export interface PathFinder {
    getPath(start: Position, destination: Position, positionValidator: CallableFunction): Array<Position>;
}