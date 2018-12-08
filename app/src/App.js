import React, { useState, useRef, useEffect } from 'react';
import { useUserMedia } from './util/hooks';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

import { Grid, Header, Icon } from 'semantic-ui-react';
import { If } from 'react-extras';
import Navbar from './components/Navbar';
import StartupModal from './components/StartupModal';
import UserSelector from './components/UserSelector';
import PlaceholderVideo from './components/PlaceholderVideo';

import { useDispatch, useMappedState } from 'redux-react-hook';
import connectionActions from './actions/connectionActions';
import uiActions from './actions/uiActions';

import { videoConstrains } from './util/config';
import SignalConnection from './util/SignalConnection';
import VideoCall from './util/VideoCall';

const mapState = store => ({
  isUserListOpen: store.ui.openUsersList,
  serverConnection: store.connection.serverConnection,
  videoCall: store.connection.videoCall,

  name: store.connection.name,
  to: store.connection.to,
  from: store.connection.from,
});

export default function App (props) {
  const { isUserListOpen, serverConnection, videoCall, name, to, from } = useMappedState(mapState);
  const dispatch = useDispatch();

  const [remoteStream, setRemoteStream] = useState(null);
  const localStream = useUserMedia(videoConstrains);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  // Starts a peer connection.
  function startPeer() {
    let params = {
      serverConnection: serverConnection, 
      remote: to || from, 
      type: to ? VideoCall.CALLER : VideoCall.RECEIVER,
      stream: localStream,
    }
  
    const call = new VideoCall(params);
    call.on('track', track => {
      setRemoteStream(call.remoteStream);
    });
    dispatch(connectionActions.SET_VIDEOCALL(call));
  }

  // Stream setting effect.
  useEffect(_ => {
    if (localStream)
      localVideoRef.current.srcObject = localStream;
    if (remoteStream)
      remoteVideoRef.current.srcObject = remoteStream;
  }, [!!localStream, !!remoteStream]);

  // Start peer connection.
  useEffect(_ => {
    if (to || from) {
      if (!videoCall) {
        startPeer();
      }
    }
  });

  // Starts a server connection.
  function startServerConnection () {
    const socket = new SignalConnection('ws://localhost:8000/');
  
    socket.on('list', ({ list }) => {
      dispatch(uiActions.SET_USER_LIST(list));
    });
  
    socket.on('calling', ({ from }) => {
      dispatch(connectionActions.SET_FROM(from));
    });
  
    socket.on('id', ({ id }) => {
      dispatch(connectionActions.SET_ID(id));
    });
  
    socket.on('signal', data => {
      videoCall.signal(data);
    });
  
    dispatch(connectionActions.SET_SERVER(socket));
  }

  if(!serverConnection)
    startServerConnection();
  
  return (
    <div className="App">
      <Navbar />
      <If condition={!name}>
        <StartupModal />
      </If>
      
      <div className="AppContent">
        <If condition={isUserListOpen}>
          <UserSelector disabled={!localStream} />
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
              <If condition={!videoCall}>
                <PlaceholderVideo />
              </If>
              <video ref={remoteVideoRef} autoPlay id="remoteVideo" hidden={!remoteStream} />
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
              <If condition={!localStream}>
                <PlaceholderVideo />
              </If>
              <video ref={localVideoRef} autoPlay muted id="localVideo" hidden={!localStream} />
            </Grid.Column>
          </Grid.Row>
          
        </Grid>
      </div>
    </div>
  );

}
