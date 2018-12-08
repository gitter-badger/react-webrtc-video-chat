import React, { useRef, useEffect } from 'react';
import { useInput } from '../util/hooks';

import { Modal, Input, Form, Button } from 'semantic-ui-react';

import { useDispatch, useMappedState } from 'redux-react-hook';
import connectionActions from '../actions/connectionActions.js';

const mapState = store => ({
    serverConnection: store.connection.serverConnection,
});

export default function StartupModal () {
    const name = useInput();
    const nameInputRef = useRef();
    const dispatch = useDispatch();
    const { serverConnection } = useMappedState(mapState);

    useEffect(_ => nameInputRef.current.focus());

    const handleSubmitButton = _ => {
        if (name.value !== '') {
            serverConnection.send({
                type: 'name',
                name,
            });
            dispatch(connectionActions.SET_NAME(name));
        }
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
                    <Button 
                    type='submit' 
                    onClick={handleSubmitButton} 
                    color={name.value && serverConnection ? 'blue' : 'grey'}>
                        Join room!
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}
