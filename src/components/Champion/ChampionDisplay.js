import React, { Component } from 'react';
import css from './ChampionDisplay.scss';

class ChampionDisplay extends Component {
  champions = [{
    name: 'Fernando',
    multi: 2
  },
  {
    name: 'Kinessa',
    multi: 1
  }];

  constructor(props) {
    super(props);

    const selectedChampion = this.champions[Math.floor(Math.random()*this.champions.length)];

    this.state = {
      champion: selectedChampion.name,
      health: this.props.maxHealth * selectedChampion.multi
    };
  }

  respawn() {
    const selectedChampion = this.champions[Math.floor(Math.random()*this.champions.length)];

    this.setState({
      champion: selectedChampion.name,
      health: this.props.maxHealth * selectedChampion.multi
    });
  }

  render() {
    const imageSource = require(`../../assets/champions/${this.state.champion}.png`);

    return (
      <div className={css.root}>
        <div className={css.wrapper}>
          <div className={css.name}>{this.state.champion}</div>
          <div className={css.healthWrapper}>{this.state.health}</div>
          <div className={css.triangle} />
          <div className={css.champion}>
            <img className={css.image} src={imageSource} width="225px" height="225px" draggable="false" alt={this.state.champion} />
          </div>
        </div>
      </div>
    );
  }
}

export default ChampionDisplay;
