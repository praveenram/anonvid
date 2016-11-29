var debug = false;

$(document).ready(function() {
    var confId = $("#confId").val();
    var username = $("#username").val();

    var remoteVideoCount = 0;

    var resizeRemoteVideos = function() {
        //TODO:
        // calculate height and width depending on layout
        // layout depends on the number of videos available to display
        // grid type layout
    };

    // Web RTC library and events
    var webrtc = new SimpleWebRTC({
        debug: debug,
        //Signaling server
        url: $("#signalmaster_url").val().trim(),
        //Video feed
        localVideoEl: 'localVideo',
        remoteVideosEl: 'remoteVideos',
        autoRequestMedia: true,
        //Conference options
        autoRemoveVideos: true,
        autoAdjustMic: true,
        detectSpeakingEvents: true,
        adjustPeerVolume: true,
        peerVolumeWhenSpeaking: 0.01,
        media: {
            video: true,
            audio: false
        }
    });

    webrtc.on('readyToCall', function() {
        if (debug === true) {
            console.log("Ready to call");
        }
        webrtc.joinRoom('anonvid-' + confId, function(err, roomDescription) {
            if (err) {
                //TODO: Show error alert - unable to join conference try again later
            }

            if (debug === true) {
                console.log("Join Room");
                console.log(err);
                console.log(roomDescription);
            }
        });
    });

    webrtc.on('connectionReady', function(sessionId) {
        if (debug === true) {
            console.log("Connection ready");
            console.log(sessionId);
        }
    });

    webrtc.on('createdPeer', function(peer) {
        if (debug === true) {
            console.log("Peer created");
            console.log(peer);
        }
    });

    webrtc.on('leftRoom', function(roomName) {
        if (debug === true) {
            console.log("leftRoom");
            console.log(roomName);
        }
    });

    webrtc.on('videoAdded', function(videoEl, peer) {
        remoteVideoCount++;
        resizeRemoteVideos();
        if (debug === true) {
            console.log("Video added");
            console.log(videoEl);
            console.log(peer);
        }
    });

    webrtc.on('videoRemoved', function(videoEl, peer) {
        remoteVideoCount--;
        resizeRemoteVideos();
        if (debug === true) {
            console.log("Video removed");
            console.log(videoEl);
            console.log(peer);
        }
    });

    // Conference window events
    $(".disable-video").on('click', function() {
        $(".enable-video").removeClass("hidden");
        $(".disable-video").addClass("hidden");
        $("video#localVideo").addClass("hidden");
        // Cut video stream
        webrtc.pauseVideo();
    });

    $(".enable-video").on('click', function() {
        $(".enable-video").addClass("hidden");
        $(".disable-video").removeClass("hidden");
        $("video#localVideo").removeClass("hidden");
        // Re-enable video stream
        webrtc.resumeVideo();
    });

    $(".end-conf").on('click', function() {
        // Leave conference
        // Call to server and singnaling server to leave conference
        // Redirects to index page
        webrtc.leaveRoom();
        webrtc.disconnect();
        $("#leaveConferenceForm").submit();
    });

    $(".enable-microphone").on('click', function() {
        $(".enable-microphone").addClass("hidden");
        $(".disable-microphone").removeClass("hidden");
        //Unmute local audio
        webrtc.unmute();
    });

    $(".disable-microphone").on('click', function() {
        $(".enable-microphone").removeClass("hidden");
        $(".disable-microphone").addClass("hidden");
        //Mute local user audio
        webrtc.mute();
    });

    //Chat functionality
    var showMessageOnScreen = function(username, msg) {
        if(msg !== undefined || msg !== null || msg !== "") {
            // Escape characters of HTML / JS from this.
            var escapeCharacters = ["&", "<", ">", '"', "'", "/"];
            var escapeMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "/": "&#x2F;"
            };
            for(var i = 0; i < escapeCharacters.length; i++) {
                msg = msg.replace(escapeCharacters[i], escapeMap[escapeCharacters[i]]);
            }
            $(".message-feed").append("<p>" + username + ": " + msg + "</p>");
        }
    };

    var sendChatMessageToAll = function(username, msg) {
        if(msg !== undefined || msg !== null || msg !== "") {
            webrtc.sendToAll("chatReceived", {
                user: username,
                msg: msg
            });
        }
    };

    webrtc.on('chatReceived', function(payload) {
        showMessageOnScreen(payload['user'], payload['msg']);
    });

    var sendChatHandler = function() {
        var msg = $("#chatInput").val().trim();
        showMessageOnScreen(username, msg);
        sendChatMessageToAll(username, msg);
        $("#chatInput").val(''); //Clear the value for next chat message
    };

    $("button.send-chat").on('click', sendChatHandler);

    //Add event to check if enter key is pressed on the #chatInput
    $("#chatInput").keyup(function (event) {
        var code = event.which;
        if(code === 13) { //Enter key is pressed
            event.preventDefault();
            sendChatHandler();
        }
    });
});