import React from 'react';

import { Menu, Sticky } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import uiActions from '../actions/uiActions';

const mapState = store => ({
    isDebugDialogOpen: store.ui.openDebugDialog,
    isUserListOpen: store.ui.openUsersList,
});

export default function Navbar() {
    const dispatch = useDispatch();
    const { isUserListOpen, isDebugDialogOpen } = useSelector(mapState);

    return (
        <Sticky>
            <Menu inverted color='violet'>
                <Menu.Item
                    icon='user circle'
                    name='Shakal'
                />

                <Menu.Item
                    icon='users'
                    name='Online Users'
                    onClick={_ => dispatch(uiActions.TOGGLE_USER_LIST())}
                    active={isUserListOpen}
                />
    
                {/* <Menu.Item
                    icon='bug'
                    position='right'
                    onClick={_ => dispatch(uiActions.TOGGLE_DEBUG_DIALOG())}
                    active={isDebugDialogOpen}
                /> */}
            </Menu>
        </Sticky>
    );
}
