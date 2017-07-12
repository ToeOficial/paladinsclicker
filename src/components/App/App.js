import React, { Component } from 'react';
import css from './App.scss';
import Shop from '../Shop/Shop.js';
import ChampionDisplay from '../Champion/ChampionDisplay.js';

import logo from '../../assets/logo.png';

const siteName = 'Paladins Clicker';

class App extends Component {
  constants = {
    balance: {
      maxXpPerLevelMulti: 1.15,
      multipleOfGpkUpgrade: 5
    },
    colors: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      items: {
        bow: {
          name: 'Cassie\'s Bow'
        }
      },
      stats: {
        maxHealth: 6,
        damage: 1,
        xpPerKill: 20,
        dmg: 1,
        dps: 0, //might replace with clicks per second
        goldPerKill: 3
      },
      account: {
        level: 1,
        gold: 0,
        oldXp: 0,
        xp: 0
      }
    }

    this.handleDead = this.handleDead.bind(this);
  }

  handleDead() {
    this.setState((prevState, props) => {
      return {
        account: {
          gold: prevState.account.gold + this.state.stats.goldPerKill,
          oldXp: prevState.account.xp,
          xp: prevState.account.xp + this.state.stats.xpPerKill
        }
      };
    });
  }

  render() {
    return (
      <div className={css.container}>
        <header className={css.navbar}>
          <div className={css.logo}>
            <img src={logo} alt={siteName} className={css.logoImg} />
            {siteName}
          </div>
          <div className={css.iconsContainer}>
            <i className={`material-icons ${css.icon}`}>settings</i>
            <i className={`material-icons ${css.icon}`}>person</i>
          </div>
        </header>
        <div className={css.columnContainer}>
          <div className={css.columnLeft}>
            <ChampionDisplay stats={this.state.stats} deadHandler={this.handleDead} />
          </div>
          <div className={css.columnMiddle}>
            Gold: {this.state.account.gold}<br/>
            XP: {this.state.account.xp}<br/>
            OldXP: {this.state.account.oldXp}
          </div>
          <div className={css.columnRight}>
            <Shop items={this.state.items} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
