import React from 'react';
import { useUserMedia } from '../util/hooks';

import { Grid, Header, Icon } from 'semantic-ui-react';

import { videoConstrains } from './util/config';

export default function LocalVideo() {
    const localStream = useUserMedia(videoConstrains);

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
          <If condition={!localStream}>
            <PlaceholderVideo />
          </If>
          <video
            ref={video => this.video = video}
            autoPlay
            muted
            id="localVideo"
            hidden={!localStream}
          />
        </Grid.Column>
      </Grid.Row>
    );
}
