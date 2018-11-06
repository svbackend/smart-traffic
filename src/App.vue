<template>
  <div id="app">
    <div class="map">
      <div class="line-y" v-for="y in verticalLines">
        <div class="line-x" v-for="x in horizontalBoxes">
          <div class="box">{{ y }} / {{ x }}</div>
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
          positions: [],
          verticalLines: [],
          horizontalBoxes: [],
          y: [],
          x: [],
      }
    },
    methods: {
      generateMap() {

          for (let y = 0; y++< 20;) {
              this.verticalLines.push(y)
            for (let x = 0; x++ < 10;) {
              let position = {x: x, y: y};
              this.positions.push(position)
            }
          }

          for (let x = 0; x++ <= 20;) {
              this.horizontalBoxes.push(x)
          }
      }
    },
    created() {
      this.generateMap();
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
  margin-top: 60px;
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
      display: inline-block;
      width: 36px;
      height: 36px;
      vertical-align: middle;
      padding: 4px;
      background-color: black;
      &.newLine {

      }
    }
  }
</style>
