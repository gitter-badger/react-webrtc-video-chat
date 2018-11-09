import React, { Component } from 'react';
import { Modal, Input, Form, Button } from 'semantic-ui-react';

import sessionActions from '../actions/sessionActions';
import { connect } from 'react-redux';

class StartupModal extends Component {
    state = {
        name: '',
        nameInputRef: React.createRef (),
    }

    componentDidMount = _ => {
        // focus the textbox
        this.state.nameInputRef.current.focus ();
    }

    handleNameInputChange = e => {
        this.setState ({
            name: e.target.value
        });
    }

    handleSubmitButton = _ => {
        if (this.state.name !== '')
            this.props.setName(this.state.name);
    }

    render = () => (
        <Modal open={!this.props.name} className='animated bounce'>
            <Modal.Header>Log in!</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <Input ref={this.state.nameInputRef} onChange={this.handleNameInputChange} />
                    </Form.Field>
                    <Button type='submit' onClick={this.handleSubmitButton} color={this.state.name ? 'blue' : 'grey'}>Enter room!</Button>
                </Form>
            </Modal.Content>
        </Modal>
    )
}

const mapStateToProps = store => ({
    name: store.name,
    serverConnection: store.wsConnection,
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
            dispatch(sessionActions.SET_NAME(name));
        },
    };
};

export default connect(mapStateToProps, null, mergeProps)(StartupModal);
