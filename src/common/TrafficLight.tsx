import { TrafficLight as TrafficLightInterface, Position as PositionInterface } from "../interfaces";
import { TrafficLightState } from "./TrafficLightState";

export class TrafficLight implements TrafficLightInterface {
    watchedPositions: Array<PositionInterface>;
    conflicts: Array<TrafficLightInterface>;
    state: TrafficLightState;
    stopPositions: Array<PositionInterface>;

    constructor(watchedPositions: Array<PositionInterface>, conflicts: Array<TrafficLightInterface>, stopPositions: Array<PositionInterface>) {
        this.watchedPositions = watchedPositions;
        this.stopPositions = stopPositions;
        this.conflicts = conflicts;
        this.state = TrafficLightState.red;
    }
}