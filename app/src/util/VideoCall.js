class VideoCall {

    static CALLER = 'caller';
    static RECEIVER = 'receiver';

    constructor(ws, remote, type, peerConnectionConfig) {
        const peer = new RTCPeerConnection(peerConnectionConfig);
        peer.onicecandidate = this.onIceCandidate;
        peer.ontrack = this.onTrack;

        this.peer = peer;
        this.tracks = [];
        this.remote = remote;
        this.server = ws;

        if (type === 'caller') {
            peer.createOffer()
            .then(this.createdDescription);
        }
    }

    // * Event handlers
    onIceCandidate = ice => {
        alert('GOT ' + JSON.stringify(ice));
        if(ice.candidate !== null) {
            this.server.send({
                type: 'signal',
                ice: ice.candidate,
                to: this.remote,
            });
        }
    }

    onTrack = track => {
        alert('GOT REMOTE STREAM');
        this.tracks.push(track);
    }

    // * Helpers
    createdDescription = async description => {
        await this.peer.setLocalDescription(description);
        this.server.send({
            type: 'signal',
            sdp: this.peer.localDescription,
            to: this.remote,
        });
    }

    // * Methods
    addLocalStream = (stream) => {
        let tracks = stream.getTracks();
        tracks.forEach(this.peer.addTrack);
    }

    get getRemoteStream () {
        return new MediaStream(this.tracks);
    }

    signal = async ({ ice, sdp }) => {
        if (ice) {
            await this.peer.addIceCandidate(new RTCIceCandidate(ice));
        } 
        else if (sdp) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(sdp))
            if(sdp.type === 'offer') { // Only create answers in response to offers
                const description = await this.peer.createAnswer();
                this.createdDescription(description);
            }
        }
    }

}

export default VideoCall;
