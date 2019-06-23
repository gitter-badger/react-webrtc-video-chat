import React, { useEffect } from 'react';
import useSignalConnection from './util/useSignalConnection';
import useVideoCall from './util/useVideoCall';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

import { If } from 'react-extras';
import { Grid } from 'semantic-ui-react';
import Navbar from './components/Navbar';
import UserSelector from './components/UserSelector';
import LocalVideo from './components/LocalVideo';
import RemoteVideo from './components/RemoteVideo';
import StartupModal from './components/StartupModal';

import { useDispatch, useSelector } from 'react-redux';
import connectionActions from './actions/connectionActions';
import uiActions from './actions/uiActions';

const mapState = store => ({
  name: store.connection.name,
  to: store.connection.to,
});

export default function App() {
  const { name, to } = useSelector(mapState);
  const dispatch = useDispatch();

  const signal = useSignalConnection(process.env.REACT_APP_SIGNAL_ENDPOINT);
  const videoCall = useVideoCall({
    signal,
  });

  useEffect(_ => {
    if(signal) {
      dispatch(connectionActions.SET_SIGNAL_CONNECTION(signal));
    }
  }, [signal]);

  // Start peer connection.
  useEffect(_ => {
    if(to) {
      videoCall.initiate(to);
    } else if(videoCall.remote) {
      dispatch(connectionActions.SET_FROM(videoCall.remote));
    }
  }, [to, videoCall.remote]);

  // Setup
  signal.on('list', ({ list }) => {
    console.log(JSON.stringify(list));
    dispatch(uiActions.SET_USER_LIST(list));
  });
  
  signal.on('calling', ({ from }) => {
    dispatch(connectionActions.SET_FROM(from));
  });
  
  signal.on('id', ({ id }) => {
    dispatch(connectionActions.SET_ID(id));
  });
  
  signal.on('signal', videoCall.gotSignalMessage);

  // Final application
  return (
    <div className="App">
      <If condition={!name}>
        <StartupModal />
      </If>
      
      <Navbar />

      <div className="AppContent">
        <UserSelector />
        <Grid columns="2" divided stackable>
          <LocalVideo stream={videoCall.localStream} />
          <RemoteVideo stream={videoCall.remoteStream} />
        </Grid>
      </div>
    </div>
  );

}
