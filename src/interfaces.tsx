import { TrafficLightState } from "./common/TrafficLightState";

export interface Position {
    x: number;
    y: number;
    toString(): string;
}

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

export interface TrafficLight {
    watchedPositions: Array<Position>; // we will count amount of traffic on provided positions 
    conflicts: Array<TrafficLight>; // if one of these TrafficLights have GREEN state then current one should be RED
    state: TrafficLightState;
    stopPositions: Array<Position>; // on these positions cars/pedestrians should stop until GREEN state 
}

export interface TrafficLightsLogic {
    iterate(): void;
}