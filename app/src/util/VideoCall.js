import { peerConnectionConfig } from './config';

class VideoCall {

    static CALLER = 'caller';
    static RECEIVER = 'receiver';

    constructor(ws, remote, type, config=peerConnectionConfig) {
        const peer = new RTCPeerConnection(config);
        peer.onicecandidate = this.onIceCandidate;
        peer.ontrack = this.onTrack;

        this.peer = peer;
        this.tracks = [];
        this.remote = remote;
        this.server = ws;

        if (type === 'caller') {
            peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,                
            })
            .then(this.createdDescription);
        }
    }

    // * Event handlers
    onIceCandidate = ice => {
        console.log('GOT CANDIDATE');
        if(ice.candidate === null) return;
        console.log('candidate is ' + JSON.stringify(ice.candidate));
        this.server.send({
            type: 'signal',
            ice: ice.candidate,
            to: this.remote,
        });
    }

    onTrack = track => {
        console.log('😆 GOT REMOTE STREAM');
        this.tracks.push(track);
    }

    // * Helpers
    createdDescription = async description => {
        console.log('got local description');
        await this.peer.setLocalDescription(description);
        this.server.send({
            type: 'signal',
            sdp: this.peer.localDescription,
            to: this.remote,
        });
    }

    // * Methods
    addLocalStream = stream => {
        console.log('added tracks')
        let tracks = stream.getTracks();
        for (let track of tracks)
            this.peer.addTrack(track);
    }

    getRemoteStream = _ => {
        return new MediaStream(this.tracks);
    }

    signal = async ({ ice, sdp }) => {
        if (ice) {
            console.log('got ice candidate');
            await this.peer.addIceCandidate(new RTCIceCandidate(ice));
        } 
        else if (sdp) {
            console.log('got remote description');
            await this.peer.setRemoteDescription(new RTCSessionDescription(sdp))
            if(sdp.type === 'offer') { // Only create answers in response to offers
                console.log ('creating answer');
                let description = await this.peer.createAnswer();
                this.createdDescription(description);
            }
        }
    }

}

export default VideoCall;
