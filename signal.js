var localVideo;
var remoteVideo;

var localStream;
var peerConnection;

var listOfClients = [];

var name;

var serverConnection;

var peerConnectionConfig = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    // {urls: 'stun:stun1.l.google.com:19302'},
    // {urls: 'stun:stun2.l.google.com:19302'},
    // {urls: 'stun:stun3.l.google.com:19302'},
    // {urls: 'stun:stun4.l.google.com:19302'},
  ]
};

function pageReady() {
  // uuid = createUUID();

  localVideo = document.getElementById('localVideo');
  remoteVideo = document.getElementById('remoteVideo');

  serverConnection = new WebSocket('ws://localhost:8000');
  serverConnection.onmessage = gotMessageFromServer;

  var constraints = {
    video: true,
    audio: true,
  };

  if(navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
  } else {
    alert('Your browser does not support getUserMedia API');
  }
}

function getUserMediaSuccess(stream) {
  localStream = stream;
  localVideo.srcObject = stream;
}

function start(isCaller) {


  peerConnection = new RTCPeerConnection(peerConnectionConfig);
  peerConnection.onicecandidate = ice => {
    alert(JSON.stringify(ice));
    gotIceCandidate(ice);
  };
  peerConnection.ontrack = gotRemoteStream;
  peerConnection.addStream(localStream);

  if(isCaller) {
    peerConnection.createOffer().then(createdDescription).catch(errorHandler);
  }
}

function gotMessageFromServer(message) {
  if(!peerConnection) start(false);

  var signal = JSON.parse(message.data);

  // // Ignore messages from ourself
  // if(signal.uuid == uuid) return;

  if(signal.sdp) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
      // Only create answers in response to offers
      if(signal.sdp.type == 'offer') {
        peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
      }
    }).catch(errorHandler);
  } else if(signal.ice) {
    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  }
}

function gotIceCandidate(event) {
  if(event.candidate != null) {
    serverConnection.send(JSON.stringify({type: 'signal', ice: event.candidate, to: 'vikrant gajria'}));
  }
}

function createdDescription(description) {
  console.log('got description');

  peerConnection.setLocalDescription(description).then(function() {
    serverConnection.send(JSON.stringify({sdp: peerConnection.localDescription, to: 'vikrant gajria'}));
  }).catch(errorHandler);
}

function gotRemoteStream(event) {
  console.log('got remote stream');
  remoteVideo.srcObject = event.streams[0];
}

function errorHandler(error) {
  console.error(error);
}
