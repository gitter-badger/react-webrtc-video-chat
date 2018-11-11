import React from 'react';

import { Card, List } from 'semantic-ui-react';

import { connect } from 'react-redux';
import connectionActions from '../actions/connectionActions';

function UserSelector (props) {
    let handleItemClick = (e, data) => {
        const to = data.uuid;
        props.serverConnection.send({
            type: 'call',
            to,
        });
        props.dispatch(connectionActions.SET_TO(to));
    }

    let i = 0;
    let items = props.onlineUsersList.filter(e => e.id !== props.userId).map(e => (<List.Item key={i++} uuid={e.id} disabled={props.to === e.id}> {e.name ? e.name : e.id} </List.Item>));

    return (
        <Card fluid raised className='animated bounceIn'>
            <Card.Content>
                <Card.Header>Select User to Call</Card.Header>
            </Card.Content>
            <Card.Content>
                <List animated divided selection={props.disabled} items={items} onItemClick={handleItemClick} />
            </Card.Content>
        </Card>
    )
}

const mapStateToProps = store => ({
    userId: store.connection.id,

    onlineUsersList: store.ui.onlineUsersList,
    serverConnection: store.connection.serverConnection,

    to: store.connection.to,
});

export default connect (mapStateToProps)(UserSelector);
