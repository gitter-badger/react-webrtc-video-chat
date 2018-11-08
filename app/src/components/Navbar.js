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
        color='blue'>
        <Menu.Item
            icon='user circle'
            name='Shakal'
            onClick={this.handleMenuClick}
            active={this.state.activeItem}
        />
    </Menu>)
}
    
export default Navbar;
    