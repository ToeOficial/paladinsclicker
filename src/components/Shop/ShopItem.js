import React, { Component } from 'react';

class ShopItem extends Component {
  render() {
    return (
      <div>
        {this.props.item.name}
      </div>
    );
  }
}

export default ShopItem;
