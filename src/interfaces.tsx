export interface Position {
    x: number;
    y: number;
    toString(): string;
}

export interface Map {
    tilesX: Array<number>;
    tilesY: Array<number>;
    road: Road;

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

export interface RoadTile {
    // todo (directions, background etc.)
}

export interface Car {
    position: Position;
    destination: Position;
    driveTo(position: Position): void;
}