import React, { Component } from 'react';
import { Map } from './interfaces'
import { Map as simpleCrossingMap } from './maps/simpleCrossingMap/Map'
import './App.scss';

class App extends Component {
  map: Map;
  constructor(props: any) {
    super(props);
    this.map = new simpleCrossingMap; // todo: pass as a property when we would have more than 1 map
  }

  renderTiles = () => {
    let tilesY = [];
    let tilesX = [];

    for (let y of this.map.tilesY) {
      tilesX = [];

      for (let x of this.map.tilesX) {
        tilesX.push(
          <div className="line-x">
            <div className="box">{y} / {x}</div>
          </div>
        );
      }
      tilesY.push(<div className="line-y">{tilesX}</div>);
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