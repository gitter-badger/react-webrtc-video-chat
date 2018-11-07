import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import Navbar from "./components/Navbar";
import { Grid, Header, Icon } from "semantic-ui-react";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />

        <Grid columns='2' divided reversed='mobile vertically' stackable={2}>
          <Grid.Row>
            <Grid.Column>
              <Header as='h2' icon textAlign='center'>
                <Icon name='user' circular />
                <Header.Content>You</Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column> <video id='localVideo' /> </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Header as='h2' icon textAlign='center'>
                <Icon name='wifi' circular />
                <Header.Content>Them</Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column> <video id='remoteVideo' /> </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
