import React from 'react';

import { Card, List } from 'semantic-ui-react';

import { connect } from 'react-redux';
import sessionActions from '../actions/sessionActions';

function UserSelector (props) {
    let handleItemClick = (e, data) => {
        const to = data.uuid;
        props.serverConnection.send({
            type: 'call',
            to,
        });
        props.dispatch(sessionActions.SET_TO(to));
    }

    let i = 0;
    let items = props.onlineUsersList.filter(e => e.id !== props.userId).map(e => (<List.Item key={i++} uuid={e.id} disabled={props.to === e.id}> {e.name ? e.name : e.id} </List.Item>));

    return (
        <Card fluid raised className='animated bounce'>
            <Card.Content>
                <Card.Header>Select User to Call</Card.Header>
            </Card.Content>
            <Card.Content>
                <List animated divided selection items={items} onItemClick={handleItemClick} />
            </Card.Content>
        </Card>
    )
}

const mapStateToProps = store => ({
    userId: store.id,

    onlineUsersList: store.onlineUsersList,
    serverConnection: store.wsConnection,
    to: store.to,
});

export default connect (mapStateToProps) (UserSelector);
