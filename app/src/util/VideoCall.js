class VideoCall {

    static CALLER = 'caller';
    static RECEIVER = 'receiver';

    constructor(ws, to, type, peerConnectionConfig) {
        const peer = new RTCPeerConnection(peerConnectionConfig);
        this.peer = peer;
        this.tracks = [];
        this.to = to;
        this.server = ws;

        peer.onicecandidate = this.onIceCandidate;
        peer.ontrack = this.onTrack;

        if (type === 'caller') {
            peer.createOffer()
            .then(description => this.createdDescription(description, this.to));
        }
    }

    // * Event handlers
    onIceCandidate = ice => {
        if(ice.candidate) {
            this.server.send({
                type: 'signal',
                ice: ice.candidate,
                to: this.to,
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
            to: this.to,
        });
    }

    // * Methods
    set addLocalStream (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(this.peer.addTrack);
    }

    get getRemoteStream () {
        return new MediaStream(this.tracks);
    }

    signal = async ({ ice, sdp, from }) => {
        if (ice) {
            await this.peer.addIceCandidate(new RTCIceCandidate(ice));
        } 
        else if (sdp) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(sdp))
            if(sdp.type === 'offer') { // Only create answers in response to offers
                const description = await this.peer.createAnswer();
                this.createdDescription(description, from);
            }
        }
    }

}

export default VideoCall;
