import React from 'react';
import { Menu, Sticky } from 'semantic-ui-react';

import { connect } from 'react-redux';
import uiActions from '../actions/uiActions';

const Navbar = (props) => (
    <Sticky>
        <Menu inverted color='violet'>
            <Menu.Item
                icon='user circle'
                name='Shakal'
            />

            <Menu.Item
                icon='users'
                name='Online Users'
                onClick={props.toggleList}
                active={props.isOnlineListOpen}
            />

            <Menu.Item
                icon='bug'
                position='right'
                onClick={props.toggleDebugDialog}
                active={props.isDebugDialogOpen}
            />
        </Menu>
    </Sticky>
);

const mapStateToProps = store => ({
    isOnlineListOpen: store.ui.openUsersList,
    isDebugDialogOpen: store.ui.openDebugDialog,
});

const mapDispatchToProps = dispatch => ({
    toggleList: _ => dispatch(uiActions.TOGGLE_USER_LIST()),
    toggleDebugDialog: _ => dispatch(uiActions.TOGGLE_DEBUG_DIALOG()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
