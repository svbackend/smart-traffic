import { TrafficLightsLogic as TrafficLightsLogicInterface, Position as PositionInterface, Map } from "../interfaces";
import { TrafficLightState } from "./TrafficLightState";
import { TrafficLight } from "./TrafficLight";
import { throws } from "assert";

export class TrafficLightsLogic implements TrafficLightsLogicInterface {
    trafficLights: Array<TrafficLight>;
    map: Map;

    constructor(trafficLights: Array<TrafficLight>, map: Map) {
        this.trafficLights = trafficLights;
        this.map = map;
        // todo: build dependency tree of traffic lights ??? (Im not sure that I need it)
    }

    iterate(): void {
        for (let light of this.trafficLights) {
            let amountOfTraffic = this.calcAmountOfTraffic(light.watchedPositions);
        }
    }

    calcAmountOfTraffic(positions: Array<PositionInterface>): number {
        let sumOfCars = 0;
        for (let position of positions) {
            if (this.map.isCar(position) === true) {
                sumOfCars++;
            }
        }
        return sumOfCars;
    }
}