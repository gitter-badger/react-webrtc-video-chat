import React, { useEffect } from 'react';
import { useUserMedia } from './util/hooks';
import useVideoCall from './util/useVideoCall';
import useSignalConnection from './util/useSignalConnection';
import { videoConstrains } from './util/config';
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

  const localStream = useUserMedia(videoConstrains)
  const { connection } = useSignalConnection();
  const videoCall = useVideoCall({
    signal: connection,
    localStream,
  });

  useEffect(() => {
    // Setup
    connection.on('list', ({ list }) => {
      console.log(JSON.stringify(list));
      dispatch(uiActions.SET_USER_LIST(list));
    });
    
    connection.on('calling', ({ from }) => {
      dispatch(connectionActions.SET_FROM(from));
    });
    
    connection.on('id', ({ id }) => {
      dispatch(connectionActions.SET_ID(id));
    });
    
    connection.on('signal', videoCall.gotSignalMessage);
  }, [connection]);

  // Start peer connection.
  useEffect(_ => {
    if(to) {
      videoCall.initiate(to);
    } else if(videoCall.remote) {
      dispatch(connectionActions.SET_FROM(videoCall.remote));
    }
  }, [to, videoCall.remote]);

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
          <LocalVideo stream={localStream} />
          <RemoteVideo stream={videoCall.remoteStream} />
        </Grid>
      </div>
    </div>
  );

}
