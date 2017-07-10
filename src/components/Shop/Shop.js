import React, { Component } from 'react';
import css from './Shop.scss';
import ShopItem from './ShopItem.js';

class Shop extends Component {
  render() {
    return (
      <div className={css.shopRoot}>
        <ShopItem item={this.props.items.bow} />
      </div>
    );
  }
}

export default Shop;
