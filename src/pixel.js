import React, { Component } from 'react';

import './board.css';

class Pixel extends Component {
  render() {
    return (
      <div id="pixel" style={this.props.colour} className="pixel">
      </div>
    );
  }
}

export default Pixel;
