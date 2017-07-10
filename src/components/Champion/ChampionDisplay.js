import React, { Component } from 'react';
import css from './ChampionDisplay.scss';

class ChampionDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentChampion: 'Fernando'
    };
  }

  render() {
    return (
      <div className={css.root}>
        <div className={css.wrapper}>
          <div className={css.name}>{this.state.currentChampion}</div>
          <div className={css.healthWrapper}></div>
          <div className={css.triangle} />
          <div className={css.champion}>
            {this.state.currentChampion}
          </div>
        </div>
      </div>
    );
  }
}

export default ChampionDisplay;
