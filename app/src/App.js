import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

import { connect } from 'react-redux';
import sessionActions from './actions/sessionActions';

import { Grid, Header, Icon } from 'semantic-ui-react';
import { If } from 'react-extras';
import Navbar from './components/Navbar';
import StartupModal from './components/StartupModal';
import UserSelector from './components/UserSelector';
import PlaceholderVideo from './components/PlaceholderVideo';

import { videoConstrains, peerConnectionConfig } from './util/config';
import { SignalConnection } from './util';
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
    if (remoteVideo.srcObject !== this.props.remoteStream)
      remoteVideo.srcObject = this.props.remoteStream;
  }

  startServerConnection = _ => {
    const socket = new SignalConnection('ws://localhost:8000/');

    socket.on('list', ({ list }) => {
      this.props.dispatch(sessionActions.SET_LIST(list));
    });

    socket.on('calling', ({ from }) => {
      this.props.dispatch(sessionActions.SET_FROM(from));
    });

    socket.on('signal', data => {
      this.props.videoCall.signal(data);
    });

    this.props.dispatch(sessionActions.SET_WS(socket));
  }

  startPeer = _ => {
    const call = new VideoCall(
      this.props.serverConnection, 
      this.props.to | this.props.from, 
      this.props.to ? VideoCall.CALLER : VideoCall.RECEIVER, 
      peerConnectionConfig
    );
    this.props.dispatch(sessionActions.SET_VIDEOCALL(call));
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
      this.startPeer();
    }
  };

  // * subcomponents
  videoRow = ({ icon, header, stream, passToRef, id }) => (
    <Grid.Row>
      <Grid.Column width={2}>
        <Header as="h2" icon textAlign="center">
          <Icon name={icon} circular />
          <Header.Content>{header}</Header.Content>
        </Header>
      </Grid.Column>
      <Grid.Column width={9}>
        <If condition={!stream}>
          <PlaceholderVideo />
        </If>

        <video ref={passToRef} autoPlay muted id="id" hidden={stream ? false : true} />
      </Grid.Column>
    </Grid.Row>
  );

  // * main component
  render() {
    return (
      <div className="App">
        <Navbar />

        <StartupModal />
        
        <div className="AppContent">
          {this.props.openList ? <UserSelector /> : null}

          <Grid columns="2" divided stackable>
            <this.videoRow icon='wifi' header='Them' passToRef={this.state.remoteVideoRef} stream={this.props.remoteStream} id='remoteVideo' />
            <this.videoRow icon='user' header='You' passToRef={this.state.localVideoRef} stream={this.props.localStream} id='localVideo' />
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
