import React, { Component } from 'react';
import { Map } from './interfaces'
import { Map as simpleCrossingMap } from './maps/simpleCrossingMap/Map'
import './App.scss';
import { Position } from './common/Position';

class App extends Component {
  map: Map;
  interval: any;
  iteration: number = 0;
  constructor(props: any) {
    super(props);
    this.map = new simpleCrossingMap; // todo: pass as a property when we would have more than 1 map
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      this.iterate();
    }, 1000);
  }

  iterate = () => {
    this.map.iterate();

    try {
      if (this.iteration % 2) {
        this.map.addCar(new Position(9, 0), new Position(19, 10));
        this.map.addCar(new Position(8, 0), new Position(0, 9));
        this.map.addCar(new Position(10, 19), new Position(10, 0));
      }
    } catch (error) {
      console.log(error)
    }
    
    this.forceUpdate();
    this.iteration++;
    if (this.iteration === 20) {
      //clearInterval(this.interval);
    }
  }

  renderTiles = () => {
    let tilesY = [];
    let tilesX = [];

    for (let y of this.map.tilesY) {
      tilesX = [];

      for (let x of this.map.tilesX) {
        let position = new Position(x, y);
        let layer1CssClasses = "tile";
        let layer2CssClasses = "tile";
        let layer3CssClasses = "tile";

        if (this.map.isRoad(position) === true) {
          layer1CssClasses += " with-road";
        }

        if (this.map.isCar(position) === true) {
          let destination = this.map.cars[position.toString()].getNextPosition();
          layer2CssClasses += " with-car";
          layer2CssClasses += " " + this.getCssClassByDestination(position, destination);
          if (this.map.movedTiles.indexOf(position.toString()) !== -1) {
            layer2CssClasses += " move";
          }
        }

        tilesX.push(
          <div className="line-x" key={x}>
            <div className="box">
              <div className="info">{x} / {y}</div>
              <div className="layer z-index-bottom"><div className={layer1CssClasses}></div></div>
              <div className="layer z-index-middle"><div className={layer2CssClasses}></div></div>
              <div className="layer z-index-top"><div className={layer3CssClasses}></div></div>
            </div>
          </div>
        );
      }
      tilesY.push(<div className="line-y" key={y}>{tilesX}</div>);
    }

    return tilesY;
  }

  render() {
    return (
      <div className="App">
        <div className="map">
          {this.renderTiles()}
        </div>
      </div>
    );
  }

  getCssClassByDestination(position: Position, destination: Position): string {
    if (destination.x > position.x) {
      return 'to-right';
    }

    if (destination.x < position.x) {
      return 'to-left';
    }

    if (destination.y > position.y) {
      return 'to-bottom';
    }

    if (destination.y < position.y) {
      return 'to-top';
    }

    return '';
  }
}

export default App;