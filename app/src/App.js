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

class App extends Component {
  state = {
    localVideoRef: React.createRef(),
    remoteVideoRef: React.createRef(),
  }

  constructor (props) {
    super (props);

    if (navigator.mediaDevices.getUserMedia) {
      // Local video constraints.
      const constraints = {
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 360,
          },
        },
        audio: true,
      };
      // Get the stream.
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          this.props.dispatch (sessionActions.SET_LOCAL_STREAM(stream));
        })
        .catch((e) => {
          console.error(e);
          alert(e);
        });
    } else {
      alert ('Switch to Chrome or Firefox!');
    }
  }

  componentDidMount = _ => {
    this.setStreams();
  }

  componentDidUpdate = _ => {
    this.setStreams();
  }

  // * helper functions
  setStreams = _ => {
    let localVideo = this.state.localVideoRef.current;
    localVideo.srcObject = this.props.localStream;
  }

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

const mapStateToProps = store => ({
  localStream: store.localVideoStream,
  remoteStream: store.remoteVideoStream,
  openList: store.openList,
});

export default connect (mapStateToProps)(App);
