import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

import { connect } from 'react-redux';
import sessionActions from './actions/sessionActions';

import { Grid, Header, Icon, Placeholder } from 'semantic-ui-react';
import Navbar from './components/Navbar';
import StartupModal from './components/StartupModal';

const PlaceholderVideo = _ => (
  <Placeholder style={{ 'minHeight': '360px', width: '100%' }}>
    <Placeholder.Image />
  </Placeholder>
);

class App extends Component {
  state = {
    localVideoRef: React.createRef(),
    remoteVideoRef: React.createRef(),
  }

  constructor(props) {
    super(props);

    if (this.props.localStream) {
      this.state.localVideoRef.current.srcObject = this.props.localStream;
    } else {
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
            this.state.localVideoRef.current.srcObject = this.props.localStream;
          })
          .catch((e) => {
            console.error(e);
            alert(e);
          });
      } else {
        // TODO: not supported
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar />

        <StartupModal />

        <Grid columns="2" divided stackable>
          <Grid.Row>
            <Grid.Column width={4}>
              <Header as="h2" icon textAlign="center">
                <Icon name="wifi" circular />
                <Header.Content>Them</Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column width={9}>
            {
                this.props.remoteStream ? 
                <video ref={this.state.remoteStream} autoPlay muted id="remoteVideo" />
                :
                <PlaceholderVideo />
              }
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <Header as="h2" icon textAlign="center">
                <Icon name="user" circular />
                <Header.Content>You</Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column width={9}>
              {
                this.props.localStream ? 
                <video ref={this.state.localVideoRef} autoPlay muted id="localVideo" />
                :
                <PlaceholderVideo />
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localStream: state.localVideoStream,
  remoteStream: state.remoteVideoStream,
});

export default connect (mapStateToProps)(App);
