import React, { Component } from 'react';
import css from './ChampionDisplay.scss';

class ChampionDisplay extends Component {
  champions = [{
    name: 'Androxus'
  },
  {
    name: 'Ash'
  },
  {
    name: 'Barik'
  },
  {
    name: 'Bomb King'
  },
  {
    name: 'Buck'
  },
  {
    name: 'Cassie'
  },
  {
    name: 'Drogoz'
  },
  {
    name: 'Evie'
  },
  {
    name: 'Fernando'
  },
  {
    name: 'Grohk'
  },
  {
    name: 'Grover'
  },
  {
    name: 'Inara'
  },
  {
    name: 'Kinessa'
  },
  {
    name: 'Lex'
  },
  {
    name: 'Lian'
  },
  {
    name: 'Maeve'
  },
  {
    name: 'Makoa'
  },
  {
    name: 'Mal\'Damba'
  },
  {
    name: 'Pip'
  },
  {
    name: 'Ruckus'
  },
  {
    name: 'Seris'
  },
  {
    name: 'Sha Lin'
  },
  {
    name: 'Skye'
  },
  {
    name: 'Torvald'
  },
  {
    name: 'Tyra'
  },
  {
    name: 'Viktor'
  },
  {
    name: 'Willo'
  },
  {
    name: 'Ying'
  },
  {
    name: 'Zhin'
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
