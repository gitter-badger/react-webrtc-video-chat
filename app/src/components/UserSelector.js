import React from 'react';
import { useSelector } from 'react-redux';
import useSignalConnection from '../util/useSignalConnection';

import { Card, List } from 'semantic-ui-react';

import _ from 'lodash';

const mapState = store => ({
    userId: store.connection.id,
    to: store.connection.to,
    isOpen: store.ui.openUsersList,
    usersList: store.ui.onlineUsersList,
});

export default function UserSelector({ disabled }) {
    const { userId, to, isOpen, usersList } = useSelector(mapState);
    const { callById } = useSignalConnection();

    const handleItemClick = (e, data) => {
        const to = data.uuid;
        callById(to);
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
