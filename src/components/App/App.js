import React, { Component } from 'react';
import css from './App.scss';
import Shop from '../Shop/Shop.js';
import ChampionDisplay from '../Champion/ChampionDisplay.js';
import StatsDisplay from '../StatsDisplay/StatsDisplay.js';

import logo from '../../assets/logo.png';

const siteName = 'Paladins Clicker';

class App extends Component {
  constants = {
    balance: {
      maxXpPerLevelMulti: 1.15,
      multipleOfGpkUpgrade: 5
    }
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
        maxHealth: 4,
        damage: 1,
        xpPerKill: 20,
        dmg: 1,
        cps: 0,
        goldPerKill: 3
      },
      account: {
        level: 1,
        gold: 0,
        oldXp: 0,
        xp: 0,
        maxXp: 100
      }
    }

    this.handleDead = this.handleDead.bind(this);
  }

  handleDead() {
    this.setState((prevState, props) => {
      while (prevState.account.xp + prevState.stats.xpPerKill >= prevState.account.maxXp) {
        let newState = prevState;
        newState.account.gold = prevState.account.gold + prevState.stats.goldPerKill;
        newState.account.oldXp = 0;
        newState.account.xp = (prevState.account.xp + prevState.stats.xpPerKill) - prevState.account.maxXp;
        newState.account.level = prevState.account.level + 1;
        newState.account.maxXp = Math.floor(prevState.account.maxXp * this.constants.balance.maxXpPerLevelMulti);
        newState.stats.maxHealth = prevState.stats.maxHealth + Math.round(newState.account.level / 2);
        if(newState.account.level % this.constants.balance.multipleOfGpkUpgrade === 0) {
            newState.stats.goldPerKill += newState.account.level/this.constants.balance.multipleOfGpkUpgrade;
        }
        return newState;
      }

      let newState = prevState;
      newState.account.gold = prevState.account.gold + prevState.stats.goldPerKill;
      newState.account.oldXp = prevState.account.xp;
      newState.account.xp = prevState.account.xp + prevState.stats.xpPerKill
      return newState;
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
            <StatsDisplay account={this.state.account} stats={this.state.stats} />
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
