import React, { useLayoutEffect, useRef } from "react";

import { If } from "react-extras";
import { Grid, Header, Icon } from "semantic-ui-react";
import PlaceholderVideo from "./PlaceholderVideo";

export default function RemoteVideo({ stream }) {
  const videoref = useRef();

  useLayoutEffect(
    () => {
      videoref.current.srcObject = stream;
    },
    [stream]
  );

  return (
    <Grid.Row>
      <Grid.Column width={3}>
        <Header as="h2" icon textAlign="center">
          <Icon name="user" circular />
          <Header.Content>You</Header.Content>
        </Header>
      </Grid.Column>
      <Grid.Column width={9}>
        <If condition={!stream}>
          <PlaceholderVideo />
        </If>
        <video ref={videoref} autoPlay id="localVideo" hidden={!stream} />
      </Grid.Column>
    </Grid.Row>
  );
}
