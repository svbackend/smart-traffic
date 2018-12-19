<template>
    <div id="app">
        <div class="map-actions">
            <a href="#!" @click="run">Start</a> |
            <a href="#!" @click="stop">Stop</a> |
            <a href="#!" v-if="interval === null" @click="iteration">Iteration++</a>
            ({{ carsPassed }} cars passed in {{ i }} iterations)
        </div>
        <div class="modifiers-form">
            <div class="field">
                <label for="yCarsModifierField">Y line cars modifier:</label>
                <input id="yCarsModifierField" type="number" v-model="yCarsModifier">
            </div>
            <div class="field">
                <label for="xCarsModifierField">X line cars modifier:</label>
                <input id="xCarsModifierField" type="number" v-model="xCarsModifier">
            </div>
        </div>
        <div class="map">
            <div class="line-y" v-for="y in verticalLines">
                <div class="line-x" v-for="x in horizontalBoxes">
                    <div class="box" :class="{
                        'with-car': getCar(x, y) !== null,
                        'with-road': getRoad(x, y) !== null,
                        'direction-y': getCar(x, y) !== null && getCar(x, y).direction === 'down',
                        'direction-x': getCar(x, y) !== null && getCar(x, y).direction === 'right'
                        }">
                        {{ y }} / {{ x }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {getMap} from "./maps/simpleCrossingMap";
  import {getKey, getPositionByKey} from "./utils";

  export default {
    name: 'app',
    data() {
      return {
        interval: null,
        i: 0,
        verticalLines: [],
        horizontalBoxes: [],
        cars: {},
        road: {},
        lights: {},
        topLightCounter: 5,
        leftLightCounter: 0,
        carsPassed: 0,
        xCarsModifier: 2,
        yCarsModifier: 5,
      }
    },
    methods: {
      run() {
        this.interval = setInterval(() => {
          this.iteration()
        }, 500)
      },
      stop() {
        clearInterval(this.interval)
        this.interval = null
      },
      iteration() {
        if (this.yCarsModifier !== 0 && this.i % this.yCarsModifier === 0) {
          let carKey = this.getKey(9, 0);
          this.cars[carKey] = {direction: 'down'};
        }
        if (this.xCarsModifier !== 0 && this.i % this.xCarsModifier === 0) {
          let car2Key = this.getKey(0, 9);
          this.cars[car2Key] = {direction: 'right'};
        }

        this.trafficLightsLogic();
        this.moveCars();
        this.$forceUpdate();
        this.i++;
      },
      moveCars() {
        Object.keys(this.cars).forEach((key) => {
          if (this.cars.hasOwnProperty(key) === false) {
            return;
          }
          let car = this.cars[key];
          if (this.lights.hasOwnProperty(key) && this.lights[key].color === 'red') {
            return;
          }

          if (this.lights.hasOwnProperty(key) && this.lights[key] !== null) {
            this.carsPassed++
          }

          if (car.direction === 'right') {
            this.moveRight(key)
          }
          if (car.direction === 'down') {
            this.moveDown(key)
          }
        });
      },
      moveDown(carKey) {
        let position = this.getPositionByKey(carKey)
        position.y += 1;

        let newPositionKey = this.getKey(position.x, position.y)

        if (this.road.hasOwnProperty(newPositionKey) === false) {
          delete this.cars[carKey]
          return
        }

        if (this.cars.hasOwnProperty(newPositionKey) && this.cars[newPositionKey] !== null) {
          return;
        }

        this.cars[this.getKey(position.x, position.y)] = this.cars[carKey];
        delete this.cars[carKey]
      },
      moveRight(carKey) {
        let position = this.getPositionByKey(carKey)
        position.x += 1;
        let newPositionKey = this.getKey(position.x, position.y)

        if (this.road.hasOwnProperty(newPositionKey) === false) {
          delete this.cars[carKey]
          return
        }

        if (this.cars.hasOwnProperty(newPositionKey) && this.cars[newPositionKey] !== null) {
          return;
        }

        this.cars[newPositionKey] = this.cars[carKey];
        delete this.cars[carKey]
      },

      trafficLightsLogic() {
        let carsFromTopCount = 0;
        let carsFromLeftCount = 0;
        for (let y = 0; y <= 8; y++) {
          if (this.cars.hasOwnProperty(this.getKey(9, y)) && this.cars[this.getKey(9, y)] !== null) {
            carsFromTopCount++
          }
        }
        for (let x = 0; x <= 8; x++) {
          if (this.cars.hasOwnProperty(this.getKey(x, 9)) && this.cars[this.getKey(x, 9)] !== null) {
            carsFromLeftCount++
          }
        }

        //if (carsFromTopCount > carsFromLeftCount) {
          if (this.lights[this.getKey(9, 8)].color === 'green') {
            this.topLightCounter--;
            if (carsFromTopCount > carsFromLeftCount && this.i % 2 === 0) {
              this.topLightCounter++;
              console.log('carsFromTopCount more than in left so increase counter by 1')
              // if current line with green light have more cars dont decrease timer every 2nd iteration
            }

            if (this.topLightCounter === 0) {
              this.lights[this.getKey(9, 8)] = {color: 'red'}
              this.lights[this.getKey(8, 9)] = {color: 'green'}
              this.leftLightCounter = carsFromLeftCount+1
            }
          } else {
            this.leftLightCounter--;

            if (carsFromLeftCount > carsFromTopCount && this.i % 2 === 0) {
              this.leftLightCounter++;
              // if current line with green light have more cars dont decrease timer every 2nd iteration
            }

            if (this.leftLightCounter === 0) {
              this.lights[this.getKey(9, 8)] = {color: 'green'}
              this.lights[this.getKey(8, 9)] = {color: 'red'}
              this.topLightCounter = carsFromTopCount+1
            }
          }
        //}
      },
      getKey(x, y) {
        return getKey(x, y)
      },
      getPositionByKey(key) {
        return getPositionByKey(key)
      },
      getCar(x, y) {
        if (this.cars.hasOwnProperty(this.getKey(x, y)) === true) {
          return this.cars[this.getKey(x, y)];
        }
        return null;
      },
      getRoad(x, y) {
        if (this.road.hasOwnProperty(this.getKey(x, y)) === true) {
          return this.road[this.getKey(x, y)];
        }
        return null;
      }
    },
    created() {
      let map = getMap(this.getKey);
      this.verticalLines = map.y;
      this.horizontalBoxes = map.x;
      this.road = map.road;
      this.lights = map.lights;
      this.run();
    }
  }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .map {
        margin: 0 auto;
        max-width: 100%;
        .line-x {
            display: inline;
        }
        .line-y {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
        }
        .box {
            -webkit-transition: .8s;
            transition: .8s;
            display: inline-block;
            width: 36px;
            height: 36px;
            vertical-align: middle;
            padding: 4px;
            background-color: navajowhite;
            &.with-road {
                background-color: grey;
                &.with-car {
                    background-color: darkmagenta;
                    &.direction-y {
                        background-color: cornflowerblue;
                    }
                    &.direction-x {
                        background-color: darkslategrey;
                    }
                }
            }
        }
    }
</style>
