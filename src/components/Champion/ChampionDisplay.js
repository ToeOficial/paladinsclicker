import React, { Component } from 'react';
import css from './ChampionDisplay.scss';

class ChampionDisplay extends Component {
  champions = [{ name: 'Androxus', role: 'Flank' },
    { name: 'Ash', role: 'Front Line' },
    { name: 'Barik', role: 'Front Line' },
    { name: 'Bomb King', role: 'Damage' },
    { name: 'Buck', role: 'Flank' },
    { name: 'Cassie', role: 'Damage' },
    { name: 'Drogoz', role: 'Damage' },
    { name: 'Evie', role: 'Flank' },
    { name: 'Fernando', role: 'Front Line' },
    { name: 'Grohk', role: 'Support' },
    { name: 'Grover', role: 'Support' },
    { name: 'Inara', role: 'Front Line' },
    { name: 'Kinessa', role: 'Damage' },
    { name: 'Lex', role: 'Flank' },
    { name: 'Lian', role: 'Damage' },
    { name: 'Maeve', role: 'Flank' },
    { name: 'Makoa', role: 'Front Line' },
    { name: 'Mal\'Damba', role: 'Support' },
    { name: 'Pip', role: 'Support' },
    { name: 'Ruckus', role: 'Front Line' },
    { name: 'Seris', role: 'Support' },
    { name: 'Sha Lin', role: 'Damage' },
    { name: 'Skye', role: 'Flank' },
    { name: 'Torvald', role: 'Front Line' },
    { name: 'Tyra', role: 'Damage' },
    { name: 'Viktor', role: 'Damage' },
    { name: 'Willo', role: 'Damage' },
    { name: 'Ying', role: 'Support' },
    { name: 'Zhin', role: 'Flank' }];

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
