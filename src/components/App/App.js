import React, { Component } from 'react';
import css from './App.scss';
import Shop from '../Shop/Shop.js';
import ChampionDisplay from '../Champion/ChampionDisplay.js';

import logo from '../../assets/logo.png';

const siteName = 'Paladins Clicker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {
        bow: {
          name: 'Cassie\'s Bow'
        }
      },
      maxHealth: 10
    }
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
            <ChampionDisplay maxHealth={this.state.maxHealth} />
          </div>
          <div className={css.columnMiddle} />
          <div className={css.columnRight}>
            <Shop items={this.state.items} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
