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
      health: Math.round(this.props.stats.maxHealth * this.getMulti(selectedChampion.role)),
      multi: this.getMulti(selectedChampion.role),
      dead: false, //needed for animation
      championImage: selectedChampion.name
    };
  }

  respawn() {
    const selectedChampion = this.champions[Math.floor(Math.random()*this.champions.length)];

    this.setState({
      champion: selectedChampion.name,
      health: Math.round(this.props.stats.maxHealth * this.getMulti(selectedChampion.role)),
      multi: this.getMulti(selectedChampion.role)
    });
  }

  getMulti(role) {
    switch (role) {
      case 'Front Line':
        return 2;
      case 'Support':
        return 1.5;
      case 'Damage':
        return 1.5;
      case 'Flank':
        return 1;
      default:
        return 1;
    }
  }

  click() {
    if (this.state.dead) {
      return;
    }

    if (this.state.health - this.props.stats.damage <= 0) {
      this.setState({
        dead: true
      });
      setTimeout(()=>{
        this.setState((prevState, props) => {
          return {
            dead: false,
            championImage: prevState.champion
          };
        });
      }, 500);

      this.respawn();
      return;
    }

    this.setState((prevState, props) => {
      return {
        health: prevState.health - this.props.stats.damage
      };
    });
  }

  render() {
    const imageSource = require(`../../assets/champions/${this.state.championImage}.png`);

    let progressWidth = (Math.round((1-(this.state.health/(this.props.stats.maxHealth*this.state.multi)))*100))+'%';
    if (this.state.dead) {
      progressWidth = '100%';
    }

    return (
      <div className={css.root}>
        <div className={css.wrapper}>
          <div className={css.name}>
            {this.state.dead ? '' : this.state.champion}
          </div>
          <div className={css.healthWrapper}>
            <div className={css.healthProgress} style={{ width: progressWidth }} />
          </div>
          <div className={`${css.triangle}${this.state.dead ? ` ${css.dead}` : ''}`} />
          <div className={css.champion} onClick={()=>{this.click()}}>
            <img className={`${css.image}${this.state.dead ? ` ${css.dead}` : ''}`} src={imageSource} width="225px" height="225px" draggable="false" alt={this.state.champion} />
          </div>
        </div>
      </div>
    );
  }
}

export default ChampionDisplay;
