import React, { Component } from 'react';
import LevelDisplay from './LevelDisplay.js';
import css from './StatsDisplay.scss';

class StatsDisplay extends Component {
  render() {
    return (
      <div className={css.wrapper}>
        <LevelDisplay account={this.props.account} level={this.props.account.level} />
        <div>
          
        </div>
      </div>
    );
  }
}

export default StatsDisplay;