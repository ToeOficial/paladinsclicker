import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        background: 'glacier-keep'
      }
    };
  }

  render() {
    return (
      <div className={`pc-container pc-container-bg-${this.state.options.background}`}>
        <header className="pc-header">
          <div className="pc-logo">
            <img src="https://tchojnacki.github.io/paladinsclicker/img/logo.png" draggable="false" />
            Paladins Clicker
          </div>
          <nav className="pc-navbaritems">
            <i className="material-icons">settings</i>
            <i className="material-icons">assignment</i>
            <i className="material-icons">account_box</i>
          </nav>
        </header>
        <main className="pc-content">
          <section className="pc-column">
            CHAMPION
          </section>
          <section className="pc-column pc-column-darken">
            LEVEL

            STATS
          </section>
          <section className="pc-column pc-column-darken pc-column-items">
            ITEMS
          </section>
        </main>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
