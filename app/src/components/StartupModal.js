import React, { useRef, useEffect } from 'react';
import { useInput } from '../util/hooks';

import { Modal, Input, Form, Button } from 'semantic-ui-react';

import connectionActions from '../actions/connectionActions.js';
import { connect } from 'react-redux';

function StartupModal (props) {
    const name = useInput();
    const nameInputRef = useRef();

    useEffect(_ => nameInputRef.current.focus());

    const handleSubmitButton = _ => {
        if (name.value !== '')
            props.setName(name);
    }

    return (
        <Modal open className='animated bounceIn'>
            <Modal.Header>Enter a username!</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <Input ref={nameInputRef} {...name} />
                    </Form.Field>
                    <Button type='submit' onClick={handleSubmitButton} color={name.value && props.serverConnection ? 'blue' : 'grey'}>Join room!</Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

const mapStateToProps = store => ({
    serverConnection: store.connection.serverConnection,
});

const mergeProps = (stateProps, dispatchProps) => {
    const { serverConnection } = stateProps;
    const { dispatch } = dispatchProps;

    return {
        ...stateProps,

        setName: name => {
            serverConnection.send({
                type: 'name',
                name,
            });
            dispatch(connectionActions.SET_NAME(name));
        },
    };
};

export default connect(mapStateToProps, null, mergeProps)(StartupModal);
