export interface Position {
    x: number;
    y: number;
}

export interface Map {
    tilesX: Array<number>;
    tilesY: Array<number>;
    road: Road;
}

export interface Road {
    [key: string]: Object;
}