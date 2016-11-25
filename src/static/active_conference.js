$(document).ready(function() {
    var confId = $("#confId").val();
    var username = $("#username").val();

    var remoteVideoCount = 0;

    var resizeRemoteVideos = function () {
        //TODO:
        // calculate height and width depending on layout
        // layout depends on the number of videos available to display
        // grid type layout
    };

    var webrtc = new SimpleWebRTC({
        //Signaling server
        url: "http://localhost:8888/",
        //Video feed
        localVideoEl: 'localVideo',
        remoteVideosEl: 'remoteVideos',
        autoRequestMedia: true,
        //Conference options
        autoRemoveVideos: true,
        adjustPeerVolume: true,
        peerVolumeWhenSpeaking: 0.01,
        media: {
            video: true,
            audio: false
        }
    });

    webrtc.on('readyToCall', function() {
        console.log("Ready to call");
        webrtc.joinRoom('anonvid-' + confId, function (err, roomDescription) {
            console.log("Join Room");
            console.log(err);
            console.log(roomDescription);
        });
    });

    webrtc.on('connectionReady', function(sessionId) {
        console.log("Connection ready");
        console.log(sessionId);
    });

    webrtc.on('createdPeer', function(peer) {
        console.log("Peer created");
        console.log(peer);
    });

    webrtc.on('leftRoom', function(roomName) {
        console.log("leftRoom");
        console.log(roomName);
    });

    webrtc.on('videoAdded', function(videoEl, peer) {
        remoteVideoCount++;
        console.log("Video added");
        console.log(videoEl);
        console.log(peer);
        resizeRemoteVideos();
    });

    webrtc.on('videoRemoved', function(videoEl, peer) {
        remoteVideoCount--;
        console.log("Video removed");
        console.log(videoEl);
        console.log(peer);
        resizeRemoteVideos();
    });
});