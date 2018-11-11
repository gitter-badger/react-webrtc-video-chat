import React, { Component } from 'react';
import { Menu, Sticky } from 'semantic-ui-react';

import { connect } from 'react-redux';
import uiActions from '../actions/uiActions';

class Navbar extends Component {
    render = () => (
        <Sticky>
            <Menu inverted color='violet'>
                <Menu.Item
                    icon='user circle'
                    name='Shakal'
                />
    
                <Menu.Item
                    icon='users'
                    name='Online Users'
                    onClick={this.props.toggleList}
                    active={this.props.isOnlineListOpen}
                />
    
                <Menu.Item
                    icon='bug'
                    position='right'
                    onClick={this.props.toggleDebugDialog}
                    active={this.props.isDebugDialogOpen}
                />
            </Menu>
        </Sticky>
    )
}

const mapStateToProps = store => ({
    isOnlineListOpen: store.ui.openUsersList,
    isDebugDialogOpen: store.ui.openDebugDialog,
});

const mapDispatchToProps = dispatch => ({
    toggleList: _ => dispatch(uiActions.TOGGLE_USER_LIST()),
    toggleDebugDialog: _ => dispatch(uiActions.TOGGLE_DEBUG_DIALOG()),
});
    
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
