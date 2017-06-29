import React, { Component } from 'react';
import css from './App.scss';
import logo from './assets/logo.png';

const siteName = 'Paladins Clicker';

class App extends Component {
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
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}

export default App;
