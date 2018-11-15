<template>
    <div id="app">
        <div class="map-actions">
            <a href="#!" @click="run">Start</a> |
            <a href="#!" @click="stop">Stop</a> |
            <a href="#!" v-if="interval === null" @click="iteration">Iteration++</a>
        </div>
        <div class="map">
            <div class="line-y" v-for="y in verticalLines">
                <div class="line-x" v-for="x in horizontalBoxes">
                    <div class="box" :class="{
                        'with-car': getCar(x, y) !== null,
                        'with-road': getRoad(x, y) !== null
                        }">
                        {{ y }} / {{ x }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        interval: null,
        i: 0,
        positions: [],
        verticalLines: [],
        horizontalBoxes: [],
        y: [],
        x: [],
        cars: {},
        road: {},
        map: {},
      }
    },
    methods: {
      generateMap() {

        for (let y = 0; y < 20; y++) {
          this.verticalLines.push(y)
        }

        for (let x = 0; x < 20; x++) {
          this.horizontalBoxes.push(x)
        }

        this.loadRoad()
      },
      run() {
        console.log('run')
        this.interval = setInterval(() => {
          this.iteration()
        }, 500)
      },
      stop() {
        clearInterval(this.interval)
        this.interval = null
      },
      iteration() {
        console.log('iteration')
        console.log(this.cars)
        if (this.i % 2 === 0) {
          let carKey = this.getKey(9, 0);
          this.cars[carKey] = {direction: 'down'};
          let car2Key = this.getKey(0, 9);
          this.cars[car2Key] = {direction: 'right'};
        }

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
          console.log('there already a car on position ' + newPositionKey)
          return;
        }

        this.cars[newPositionKey] = this.cars[carKey];
        delete this.cars[carKey]
      },
      getKey(x, y) {
        return x + '-' + y;
      },
      getPositionByKey(key) {
        let xy = key.split('-')
        return {x: Number.parseInt(xy[0]), y: Number.parseInt(xy[1])}
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
      },
      loadRoad() {
        for (let y = 0; y < this.verticalLines.length; y++) {
          this.road[this.getKey(9, y)] = {};
          this.road[this.getKey(10, y)] = {};
        }

        for (let x = 0; x < this.horizontalBoxes.length; x++) {
          this.road[this.getKey(x,10)] = {};
          this.road[this.getKey(x,9)] = {};
        }
      }
    },
    created() {
      this.generateMap();
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
                }
            }
        }
    }
</style>
