export interface Position {
    x: number;
    y: number;
}

export interface Map {
    tilesX: Array<number>;
    tilesY: Array<number>;
    road: Road;

    getRoadByPosition(x: number, y: number): RoadTile | undefined; // should x, y be changed to Position interface?
    isRoad(x: number, y: number): boolean
}

export interface Road {
    [key: string]: RoadTile;
}

export interface RoadTile {
    // todo (directions, background etc.)
}

export interface Car {
    position: Position;
    destination: Position;
    driveTo(position: Position): void;
}