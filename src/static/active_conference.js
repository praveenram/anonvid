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

    // Web RTC library and events

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
        if(debug == true) {
            console.log("Ready to call");
        }
        webrtc.joinRoom('anonvid-' + confId, function (err, roomDescription) {
            if(err) {
                //TODO: Show error alert - unable to join conference try again later
            }

            if(debug == true) {
                console.log("Join Room");
                console.log(err);
                console.log(roomDescription);
            }
        });
    });

    webrtc.on('connectionReady', function(sessionId) {
        if(debug == true) {
            console.log("Connection ready");
            console.log(sessionId);
        }
    });

    webrtc.on('createdPeer', function(peer) {
        if(debug == true) {
            console.log("Peer created");
            console.log(peer);
        }
    });

    webrtc.on('leftRoom', function(roomName) {
        if(debug == true) {
            console.log("leftRoom");
            console.log(roomName);
        }
    });

    webrtc.on('videoAdded', function(videoEl, peer) {
        remoteVideoCount++;
        resizeRemoteVideos();
        if(debug == true) {
            console.log("Video added");
            console.log(videoEl);
            console.log(peer);
        }
    });

    webrtc.on('videoRemoved', function(videoEl, peer) {
        remoteVideoCount--;
        resizeRemoteVideos();
        if(debug == true) {
            console.log("Video removed");
            console.log(videoEl);
            console.log(peer);
        }
    });

    webrtc.on('chatReceived', function (user, message) {
        // TODO: Sanitize before displaying on the browser
        // Sanitize for XSS
    });


    // Conference window events
    $(".disable-video").on('click', function () {
        $(".enable-video").removeClass("hidden");
        $(".disable-video").addClass("hidden");
        $("video#localVideo").addClass("hidden");
        // Cut video stream
    });

    $(".enable-video").on('click', function () {
        $(".enable-video").addClass("hidden");
        $(".disable-video").removeClass("hidden");
        $("video#localVideo").removeClass("hidden");
        // Re-enable video stream
    });

    $(".end-conf").on('click', function () {
        // Leave conference
        // Ajax call to server and singnaling server to leave conference
        // Redirect to index page
    });

    $(".enable-microphone").on('click', function () {
        $(".enable-microphone").addClass("hidden");
        $(".disable-microphone").removeClass("hidden");
        //Unmute local audio
    });

    $(".disable-microphone").on('click', function () {
        $(".enable-microphone").removeClass("hidden");
        $(".disable-microphone").addClass("hidden");
        //Mute local user audio
    });
});