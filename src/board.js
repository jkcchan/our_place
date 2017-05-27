import React, { Component } from 'react';

import './board.css';
import Pixel from './pixel.js';

class Board extends Component {
  render() {
    return (
      <div id="board">
      	<Pixel color="#ffffff" id="1"/>
      </div>
    );
  }
}

export default Board;
