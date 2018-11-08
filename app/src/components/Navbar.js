import React, { Component } from 'react';
import { Menu, Sticky } from 'semantic-ui-react';

import { connect } from 'react-redux';
import sessionActions from '../actions/sessionActions';

class Navbar extends Component {
    render = () => (
        <Sticky>
            <Menu inverted color='violet'>
                <Menu.Item
                    icon='user circle'
                    name='Shakal'
                    onClick={this.handleMenuClick}
                />

                <Menu.Item
                    icon='users'
                    name='Online Users'
                    onClick={this.props.toggleList}
                    active={this.props.isOnlineListOpen}
                />
            </Menu>
        </Sticky>
    )
}

const mapStateToProps = store => ({
    isOnlineListOpen: store.openList,
});

const mapDispatchToProps = dispatch => ({
    toggleList: _ => dispatch(sessionActions.TOGGLE_LIST()),
});
    
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
    