import React, { useRef, useEffect } from 'react';
import { useDispatch, } from 'react-redux';
import { useInput } from '../util/hooks';
import useSignalConnection from '../util/useSignalConnection';

import { Modal, Input, Form, Button } from 'semantic-ui-react';
import connectionActions from '../actions/connectionActions.js';


export default function StartupModal () {
    const name = useInput();
    const nameInputRef = useRef();
    const dispatch = useDispatch();
    const { connection } = useSignalConnection();

    useEffect(() => nameInputRef.current.focus(), []);

    const handleSubmitButton = _ => {
        if (name.value !== '') {
            connection.send({
                type: 'name',
                name: name.value,
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
                    disabled={!connection}
                    onClick={handleSubmitButton} 
                    color={name.value && connection ? 'blue' : 'grey'}>
                        Join room!
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}
