import React from 'react';

import { Menu, Sticky } from 'semantic-ui-react';

import { useDispatch, useMappedState } from 'redux-react-hook';
import uiActions from '../actions/uiActions';

const mapState = store => ({
    isOnlineListOpen: store.ui.openUsersList,
    isDebugDialogOpen: store.ui.openDebugDialog,
});

export default function Navbar() {
    const dispatch = useDispatch();
    const { isOnlineListOpen, isDebugDialogOpen } = useMappedState(mapState);

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
                    active={isOnlineListOpen}
                />
    
                <Menu.Item
                    icon='bug'
                    position='right'
                    onClick={_ => dispatch(uiActions.TOGGLE_DEBUG_DIALOG())}
                    active={isDebugDialogOpen}
                />
            </Menu>
        </Sticky>
    );
}
