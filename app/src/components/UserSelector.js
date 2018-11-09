import React from 'react';
import { Card, List } from 'semantic-ui-react';

import { connect } from 'react-redux';
import sessionActions from '../actions/sessionActions';

function UserSelector (props) {
    let handleItemClick = (e, data) => {
        props.setTo(data.uuid);
    }

    let i = 0;
    let items = props.onlineUsersList.map(e => (<List.Item key={i++} uuid={e.id} disabled={props.to === e.id}> {e.name ? e.name : e.id} </List.Item>));

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
    onlineUsersList: store.onlineUsersList,
    to: store.to,
});

const mapDispatchToProps = dispatch => ({
    setTo: uuid => dispatch(sessionActions.SET_TO(uuid)),
});

export default connect (mapStateToProps, mapDispatchToProps)(UserSelector);
