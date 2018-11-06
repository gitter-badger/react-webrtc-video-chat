import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

class Navbar extends Component {
    state = {
        activeItem: false
    }

    handleMenuClick = (e) => {
        this.setState ({
            activeItem: !this.state.activeItem
        });
    }

    render = () => (
    <Menu
        color='primary'>
        <Menu.Item
            name='Hello'
            onClick={this.handleMenuClick}
            active={this.state.activeItem}
        />
    </Menu>)
}
    
export default Navbar;
    