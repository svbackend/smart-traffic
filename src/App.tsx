import React, { Component } from 'react';
import { Map } from './interfaces'
import { Map as simpleCrossingMap } from './maps/simpleCrossingMap/Map'
import './App.scss';
import { Position } from './common/Position';

class App extends Component {
  map: Map;
  interval: NodeJS.Timeout | undefined;
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
      if (this.iteration === 0) {
        this.map.addCar(new Position(9, 0), new Position(9, 19));
      }
    } catch (error) {
      console.log(error)
    }
    
    this.forceUpdate();
    this.iteration++;
  }

  renderTiles = () => {
    let tilesY = [];
    let tilesX = [];

    for (let y of this.map.tilesY) {
      tilesX = [];

      for (let x of this.map.tilesX) {
        let position = new Position(x, y);
        let cssClasses = "box";

        if (this.map.isRoad(position) === true) {
          cssClasses += " with-road";
        }

        if (this.map.isCar(position) === true) {
          cssClasses += " with-car";
        }

        tilesX.push(
          <div className="line-x" key={x}>
            <div className={cssClasses}>{y} / {x}</div>
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
}

export default App;