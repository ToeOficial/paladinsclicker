import React, { Component } from 'react';
import css from './LevelDisplay.scss';

class LevelDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLevelUpping: false
    };
  }

  colors = {
    cyan: '#54E9E6',
    darkCyan: '#128D8A',
    gray: '#222222'
  };

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate(prevProps) {
    this.updateCanvas();        
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.level !== nextProps.level) {
      this.setState({ isLevelUpping: true });
    }
    else if (this.state.isLevelUpping === true) {
      this.setState({ isLevelUpping: false });
    }
  }

  updateCanvas() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 114;

    const { xp, oldXp, maxXp } = this.props.account;

    //Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Bigger circle - border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 28;
    ctx.strokeStyle = this.colors.darkCyan;
    ctx.stroke();

    //Grey circle - empty space
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 24;
    ctx.strokeStyle = this.colors.gray;
    ctx.stroke();

    //New xp
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 3.5 * Math.PI, (3.5+(2*(xp/maxXp)))*Math.PI, false);
    ctx.strokeStyle = this.colors.cyan;
    ctx.stroke();

    //Old xp
    ctx.beginPath();
    ctx.arc(centerX, centerY, 114, 3.5 * Math.PI, (3.5+(2*(oldXp/maxXp)))*Math.PI, false);
    ctx.strokeStyle = this.colors.darkCyan;
    ctx.stroke();
  }

  render() {
    return (
      <div className={css.levelWrapper}>
        <canvas ref="canvas" width={260} height={260} />
        <div className={`${css.levelDisplay}${this.state.isLevelUpping ? ` ${css.levelUp}` : ''}`}><div className={css.levelTooltipBase}>{this.props.account.level}<span role="tooltip" className={css.levelTooltip}>{this.props.account.xp}/{this.props.account.maxXp}</span></div></div>
      </div>
    );
  }
}

export default LevelDisplay;