import React from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { Card, List } from 'semantic-ui-react';

import _ from 'lodash';
import connectionActions from '../actions/connectionActions';

const mapState = store => ({
    userId: store.connection.id,
    to: store.connection.to,
    isOpen: store.ui.openUsersList,
    usersList: store.ui.onlineUsersList,
});

export default function UserSelector({ disabled }) {
    const { userId, to, isOpen, usersList } = useMappedState(mapState);
    const dispatch = useDispatch();

    const handleItemClick = (e, data) => {
        const to = data.uuid;
        dispatch(connectionActions.CALL_BY_ID(to));
    };

    const toListItem = (e, i) => (
        <List.Item 
            key={i}
            uuid={e.id}
            disabled={to === e.id}
        > 
            {e.name || e.id}
        </List.Item>);

    const items = _(usersList)
            .filter(e => e.id !== userId)
            .map(toListItem)
            .value();

    _(items).each(console.log);

    return (
        <Card id='selectorBox' hidden={isOpen} fluid raised className='animated bounceInDown'>
            <Card.Content>
                <Card.Header>Select User to Call</Card.Header>
            </Card.Content>
            <Card.Content>
                <List animated divided selection={disabled} items={items} onItemClick={handleItemClick} />
            </Card.Content>
        </Card>
    )
}
