import React, { Component } from 'react';
import LevelDisplay from './LevelDisplay.js';
import css from './StatsDisplay.scss';

class StatsDisplay extends Component {
  render() {
    return (
      <div className={css.wrapper}>
        <LevelDisplay account={this.props.account} level={this.props.account.level} />
        <div className={css.statsDisplay}>
          Gold: {this.props.account.gold}
          <br/>
          GPK: {this.props.stats.goldPerKill}
          <br/><br/>
          DMG: {this.props.stats.damage}
          <br/>
          CPS: {this.props.stats.cps}
        </div>
      </div>
    );
  }
}

export default StatsDisplay;