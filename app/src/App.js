import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

import { connect } from 'react-redux';
import connectionActions from './actions/connectionActions';
import uiActions from './actions/uiActions';

import { Grid, Header, Icon } from 'semantic-ui-react';
import { If } from 'react-extras';
import Navbar from './components/Navbar';
import StartupModal from './components/StartupModal';
import UserSelector from './components/UserSelector';
import PlaceholderVideo from './components/PlaceholderVideo';

import { videoConstrains } from './util/config';
import SignalConnection from './util/SignalConnection';
import VideoCall from './util/VideoCall';

// -----

class App extends Component {

  state = {
    localStream: undefined,
    remoteStream: undefined,
  }

  constructor (props) {
    super (props);
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
  }

  // * event handlers
  errorHandler = e => {
    alert(e);
    console.error(e);
  }

  setLocalStream = _ => {
    this.localVideoRef.current.srcObject = this.state.localStream;
  }

  setRemoteStream = _ => {
    this.remoteVideoRef.current.srcObject = this.state.remoteStream;
  }

  // * helpers

  startServerConnection = _ => {
    const socket = new SignalConnection('ws://localhost:8000/');

    socket.on('list', ({ list }) => {
      this.props.dispatch(uiActions.SET_USER_LIST(list));
    });

    socket.on('calling', ({ from }) => {
      this.props.dispatch(connectionActions.SET_FROM(from));
    });

    socket.on('id', ({ id }) => {
      this.props.dispatch(connectionActions.SET_ID(id));
    });

    socket.on('signal', data => {
      this.props.videoCall.signal(data);
    });

    this.props.dispatch(connectionActions.SET_SERVER(socket));
  }

  startPeer = _ => {
    let params = {
      serverConnection: this.props.serverConnection, 
      remote: this.props.to || this.props.from, 
      type: this.props.to ? VideoCall.CALLER : VideoCall.RECEIVER,
      stream: this.state.localStream,
    }

    const call = new VideoCall(params);
    this.props.dispatch(connectionActions.SET_VIDEOCALL(call));
  }

  startLocalVideo = async _ => {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        let localStream = await navigator.mediaDevices.getUserMedia(videoConstrains);
        this.setState({
          localStream,
        });
        this.setLocalStream();
      } catch (error) {
        this.errorHandler(error);
      }
    } else {
      alert ('Switch to Chrome or Firefox!');
      return Error();
    }
  }

  // * hooks
  // TODO: Fix hooks.

  componentDidMount = _ => {
    this.startServerConnection();

    this.startLocalVideo();
    // this.setStreams();
  }

  componentDidUpdate = _ => {
    // this.setStreams();

    if (this.props.to || this.props.from) {
      if (!this.props.videoCall)
        this.startPeer();
    }
  };

  // * main component
  render = () => {
    return (
      <div className="App">
        <Navbar />

        <If condition={!this.props.name}>
          <StartupModal />
        </If>
        
        <div className="AppContent">
          <If condition={this.props.isUserListOpen}>
            <UserSelector disabled={!this.state.localStream} />
          </If>

          <Grid columns="2" divided stackable>
            
            <Grid.Row>
              <Grid.Column width={3}>
                <Header as="h2" icon textAlign="center">
                  <Icon name='wifi' circular />
                  <Header.Content>Them</Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column width={9} textAlign='center'>
                <If condition={!this.props.videoCall}>
                  <PlaceholderVideo />
                </If>
                <video ref={this.remoteVideoRef} autoPlay muted id="remoteVideo" hidden={!this.props.videoCall} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={3}>
                <Header as="h2" icon textAlign="center">
                  <Icon name='user' circular />
                  <Header.Content>You</Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <If condition={!this.state.localStream}>
                  <PlaceholderVideo />
                </If>
                <video ref={this.localVideoRef} autoPlay muted id="localVideo" hidden={!this.state.localStream} />
              </Grid.Column>
            </Grid.Row>
            
          </Grid>
        </div>
      </div>
    );
  }
}

// -----

const mapStateToProps = store => ({
  isUserListOpen: store.ui.openUsersList,
  serverConnection: store.connection.serverConnection,
  videoCall: store.connection.videoCall,

  name: store.connection.name,
  to: store.connection.to,
  from: store.connection.from,
});

export default connect (mapStateToProps)(App);
