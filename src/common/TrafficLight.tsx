import { TrafficLight as TrafficLightInterface } from "../interfaces";
import { TrafficLightState } from "./TrafficLightState";
import { Position } from "./Position";

export class TrafficLight implements TrafficLightInterface {
    watchedPositions: Array<Position>;
    conflicts: Array<TrafficLightInterface>;
    state: TrafficLightState;
    stopPositions: Array<Position>;
    amountOfTraffic: number = 0;

    constructor(watchedPositions: Array<Position>, conflicts: Array<TrafficLightInterface>, stopPositions: Array<Position>) {
        this.watchedPositions = watchedPositions;
        this.stopPositions = stopPositions;
        this.conflicts = conflicts;
        this.state = TrafficLightState.red;
    }
}