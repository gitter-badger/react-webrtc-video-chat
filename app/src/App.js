import React, { useState, useRef, useEffect } from 'react';
import { useUserMedia } from './util/hooks';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

import { If } from 'react-extras';
import LocalVideo from './components/LocalVideo';
import RemoteVideo from './components/RemoteVideo';
import Navbar from './components/Navbar';
import StartupModal from './components/StartupModal';
import UserSelector from './components/UserSelector';
import PlaceholderVideo from './components/PlaceholderVideo';

import { useDispatch, useMappedState } from 'redux-react-hook';
import connectionActions from './actions/connectionActions';
import uiActions from './actions/uiActions';

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

export default function App () {
  const { isUserListOpen, serverConnection, videoCall, name, to, from } = useMappedState(mapState);
  const dispatch = useDispatch();

  const [remoteStream, setRemoteStream] = useState(null);
  const localStream = useUserMedia(videoConstrains);
  const [usersList, setUsersList] = useState([]);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

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
    }
  }, [!!to, !!from, !!videoCall]);

  if(!serverConnection) {
    const socket = new SignalConnection('ws://localhost:8000/');
  
    socket.on('list', ({ list }) => {
      setUsersList(list);
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
  
  return (
    <div className="App">
      <Navbar />
      <If condition={!name}>
        <StartupModal />
      </If>
      
      <div className="AppContent">
        <UserSelector open={isUserListOpen} list={usersList} disabled={!localStream} />

        <Grid columns="2" divided stackable>
          <LocalVideo />
          <RemoteVideo />
        </Grid>
      </div>
    </div>
  );

}
