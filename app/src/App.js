import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

import { connect } from 'react-redux';
import sessionActions from './actions/sessionActions';

import { Grid, Header, Icon, Button } from 'semantic-ui-react';
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
    localVideoRef: React.createRef(),
    remoteVideoRef: React.createRef(),
  }

  // * event handlers
  errorHandler = e => {
    alert(e);
    console.error(e);
  }

  // * helpers
  setStreams = _ => {
    let localVideo = this.state.localVideoRef.current;
    if (localVideo.srcObject !== this.props.localStream)
      localVideo.srcObject = this.props.localStream;

    let remoteVideo = this.state.remoteVideoRef.current;
    if (this.props.videoCall) {
      remoteVideo.srcObject = this.props.videoCall.getRemoteStream();
    }
  }

  startServerConnection = _ => {
    const socket = new SignalConnection('ws://localhost:8000/');

    socket.on('list', ({ list }) => {
      this.props.dispatch(sessionActions.SET_LIST(list));
    });

    socket.on('calling', ({ from }) => {
      this.props.dispatch(sessionActions.SET_FROM(from));
    });

    socket.on('id', ({ id }) => {
      this.props.dispatch(sessionActions.SET_ID(id));
    });

    socket.on('signal', data => {
      this.props.videoCall.signal(data);
    });

    this.props.dispatch(sessionActions.SET_WS(socket));
  }

  startPeer = _ => {
    const call = new VideoCall(
      this.props.serverConnection, 
      this.props.to || this.props.from, 
      this.props.to ? VideoCall.CALLER : VideoCall.RECEIVER
    );
    
    this.props.dispatch(sessionActions.SET_VIDEOCALL(call));

    call.addLocalStream(this.props.localStream);
  }

  startLocalVideo = _ => {
    if (navigator.mediaDevices.getUserMedia) {
      // Get the stream.
      navigator.mediaDevices.getUserMedia(videoConstrains)
        .then(stream => {
          this.props.dispatch(sessionActions.SET_LOCAL_STREAM(stream));
        })
        .catch(this.errorHandler);
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
    this.setStreams();
  }

  componentDidUpdate = _ => {
    this.setStreams();

    if (this.props.to || this.props.from) {
      if (!this.props.videoCall)
        this.startPeer();
    }
  };

  // * main component
  render() {
    return (
      <div className="App">
        <Navbar />

        <StartupModal />
        
        <div className="AppContent">
          {this.props.openList ? <UserSelector /> : null}

          <Button onClick={_ => {
            alert (this.props.videoCall.peer.iceGatheringState)
          }}> Submit </Button>

          <Grid columns="2" divided stackable>
            
            <Grid.Row>
              <Grid.Column width={2}>
                <Header as="h2" icon textAlign="center">
                  <Icon name='wifi' circular />
                  <Header.Content>Them</Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <If condition={!this.props.videoCall}>
                  <PlaceholderVideo />
                </If>

                <video ref={this.state.remoteVideoRef} autoPlay muted id="id" hidden={false} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={2}>
                <Header as="h2" icon textAlign="center">
                  <Icon name='user' circular />
                  <Header.Content>You</Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column width={9}>
                <If condition={!this.props.localStream}>
                  <PlaceholderVideo />
                </If>

                <video ref={this.state.localVideoRef} autoPlay muted id="id" hidden={this.props.localStream ? false : true} />
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
  localStream: store.localVideoStream,
  remoteStream: store.remoteVideoStream,
  openList: store.openList,
  serverConnection: store.wsConnection,
  videoCall: store.videoCall,

  to: store.to,
  from: store.from,
});

export default connect (mapStateToProps)(App);
