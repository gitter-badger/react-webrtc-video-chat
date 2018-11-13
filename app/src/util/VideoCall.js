import { peerConnectionConfig } from './config';

class VideoCall extends EventTarget {

    static CALLER = 'caller';
    static RECEIVER = 'receiver';

    constructor(params, peerconfig=peerConnectionConfig) {
        super();
        const peer = new RTCPeerConnection(peerconfig);
        peer.onicecandidate = this.onIceCandidate;
        peer.ontrack = this.onTrack;

        this.peer = peer;
        this.tracks = [];
        this.remote = params.remote;
        this.server = params.serverConnection;

        const tracks = params.stream.getTracks();
        for (let track of tracks)
            peer.addTrack(track);

        if (params.type === 'caller') {
            peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,                
            })
            .then(this.createdDescription);
        }
    }

    // Short hand form.
    on = this.addEventListener;

    // * Event handlers
    onIceCandidate = ice => {
        console.log('got self ice candidate');
        if(ice.candidate === null) return;
        console.log('candidate is ' + JSON.stringify(ice.candidate));
        this.server.send({
            type: 'signal',
            ice: ice.candidate,
            to: this.remote,
        });
    }

    onTrack = tevent => {
        console.log('😆 GOT REMOTE STREAM');
        this.tracks.push(tevent.track);
        this.dispatchEvent(new CustomEvent('track', { detail: tevent.track }));
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

    get remoteStream () {
        return new MediaStream(this.tracks);
    }

    signal = async ({ ice, sdp }) => {
        if (ice) {
            console.log('got remote ice candidate');
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
