import { TrafficLightsLogic as TrafficLightsLogicInterface, Map } from "../interfaces";
import { TrafficLightState } from "./TrafficLightState";
import { TrafficLight } from "./TrafficLight";
import { Position } from "./Position";

export class TrafficLightsLogic implements TrafficLightsLogicInterface {
    trafficLights: Array<TrafficLight>;
    map: Map;

    constructor(trafficLights: Array<TrafficLight>, map: Map) {
        this.trafficLights = trafficLights;
        this.map = map;

        this.calcAmountOfTraffic();
        // todo: setup timers and turn on set of lights (set few lights to GREEN state)
        // todo: build dependency tree of traffic lights ??? (Im not sure that I need it)
    }
    
    iterate(): void {
        this.calcAmountOfTraffic();
        // todo
    }

    private calcAmountOfTraffic(): void {
        let sumOfCars = 0;
        for (let light of this.trafficLights) {
            for (let position of light.watchedPositions) {
                if (this.map.isCar(position) === true) {
                    sumOfCars++;
                }
            }
            light.amountOfTraffic = sumOfCars;
            sumOfCars = 0;
        }   
    }
}