import React, { useLayoutEffect } from 'react';

import { Grid, Header, Icon } from 'semantic-ui-react';

export default function RemoteVideo({ stream }) {
    useLayoutEffect(() => {
        this.video.srcObject = stream;
    }, [stream]);

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
          <video
            ref={video => this.video = video}
            autoPlay
            muted
            id="localVideo"
            hidden={!stream}
          />
        </Grid.Column>
      </Grid.Row>
    );
}
