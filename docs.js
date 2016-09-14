"use strict";
var videoPlayer, audioPlayer, currentMode, embedMode, currentPlayer;
$(document).ready(function() {
    videoPlayer = ".video .js-media-player";
    audioPlayer = ".audio .js-media-player";
    function init() {
        resetVar();
        $(".video, .audio, .track").hide();
        defaultStatus();
        $(".btn--url").on("mouseenter click", function() {
            $("input[type=text]").focus();
        });
        $(".btn").mouseleave(function() {
            $("input").blur();
        });
        $("#up").click(function() {
            $("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        });
    }
    function resetVar() {
        currentMode = null;
        embedMode = null;
        currentPlayer = null;
    }
    function setupPlayer(player) {
        return plyr.setup(player, {
            iconUrl: './plyr.svg',
            tooltips: true,
            volume: 10,
            seekTime: 3,
            captions: {
                defaultActive: true
            },
            debug: true
        })[0];
    }
    function killPlayer()
    {
        currentPlayer.pause();
        $("input").blur();
        $("." + currentMode).hide();
        currentPlayer.destroy();
    }
    function defaultStatus() {
        $("#status").text("Subtitle option will be available after video is selected");
    }
    function loadingSourceStatus() {
        $("#status").text("Loading " + currentMode + "... This might take a while, and your browser might freeze or crash");
    }
    function readySourceStatus() {
        $("#status").text("Your " + currentMode + " is ready!");
        setTimeout(defaultStatus, 10000);
    }
    function loadingTrackStatus() {
        $("#status").text("Loading subtitle... You might encounter sync problem while playing");
    }
    function readyTrackStatus() {
        $("#status").text("Subtitle is ready!");
        setTimeout(defaultStatus, 10000);
    }
    function showPlayer(source) {
        if (embedMode !== null) {
            currentPlayer.source({
                type: currentMode,
                sources: [{
                    src: source,
                    type: embedMode
                }]
            });
        } else {
            currentPlayer.source({
                type: currentMode,
                sources: [{
                    src: source
                }]
            });
        }
        $("." + currentMode).show();
    }
    function videoMode() {
        currentMode = "video";
        currentPlayer = setupPlayer(videoPlayer);
        currentPlayer.on("loadstart", function() {
            $(".track").show();
            readySourceStatus();
        });
    }
    function videoEmbedMode(videoSite) {
        embedMode = videoSite;
        videoMode();
    }
    function audioMode() {
        currentMode = "audio";
        currentPlayer = setupPlayer(audioPlayer);
        currentPlayer.on("loadstart", function() {
            readySourceStatus();
        });
    }
    $(document).keydown(function(event) {
        if ($("input:focus").length == 0 && currentMode !== null) {
            switch(event.which) {
                case 8: //backspace or delete
                    currentPlayer.toggleMute();
                    return false;
                case 9: //tab
                    if (currentMode == "video") {
                        currentPlayer.toggleCaptions();
                    }
                    return false;
                case 13: //enter
                    if (currentMode == "video") {
                        currentPlayer.toggleFullscreen();
                    }
                    return false;
                case 27: //esc
                    currentPlayer.restart();
                    return false;
                case 32: //spacebar
                    currentPlayer.togglePlay();
                    return false;
                case 37: //left arrow
                    currentPlayer.rewind();
                    return false;
                case 38: //up arrow
                    currentPlayer.setVolume(currentPlayer.media.volume * 10 + 1);
                    return false;
                case 39: //right arrow
                    currentPlayer.forward();
                    return false;
                case 40: //down arrow
                    currentPlayer.setVolume(currentPlayer.media.volume * 10 - 1);
                    return false;
            }
        }
    });
    $("input[type=file][name=source]").change(function() {
        var source = this.files[0];
        if (source !== undefined) {
            if (currentMode !== null) {
                killPlayer();
                resetVar();
            }
            if (source.type.match(/^video/) !== null) {
                videoMode();
            } else if (source.type.match(/^audio/) !== null) {
                audioMode();
            }
            if (currentMode !== null) {
                $("input[type=text][name=source]").val("");
                loadingSourceStatus();
                var reader = new FileReader();
                reader.onload = function(event) {
                    showPlayer(event.target.result);
                }
                reader.readAsDataURL(source);
            } else {
                $("#status").text("Not supported format... Officially support MP4, WEBM, MP3, WAV and OGG formats");
                setTimeout(defaultStatus, 5000);
            }
        }
    });
    $("input[type=text][name=source]").change(function() {
        var source = $(this).val();
        if (source !== undefined && source.length > 0) {
            if (currentMode !== null) {
                killPlayer();
                resetVar();
            }
            if (source.match(/(\w|-){11}/) !== null) {
                videoEmbedMode("youtube");
            } else if (source.match(/(\d)/) !== null) {
                videoEmbedMode("vimeo");
            } else if (source.match(/\.(mp4|webm|ogv)/) !== null) {
                videoMode();
            } else if (source.match(/\.(mp3|wav|ogg)/) !== null) {
                audioMode();
            }
            if (currentMode !== null) {
                loadingSourceStatus();
                setTimeout(function() {
                    showPlayer(source);
                }, 1000);
            } else {
                $("#status").text("Not supported service or format... Officially support YouTube, Vimeo, MP4, WEBM, MP3 and OGG formats");
                setTimeout(defaultStatus, 5000);
            }
        }
    });
    $("input[name=track]").change(function() {
        var track = this.files[0];
        if (track !== undefined) {
            if (track.name.match(/\.(ass|ssa|srt|vtt)/) !== null) {
                loadingTrackStatus();
                var reader = new FileReader(), webvtt;
                reader.onload = function(event) {
                    if (track.name.match(/\.(vtt)/) !== null) {
                        webvtt = event.target.result.replace(/\r?\n|\r|\n/g, "\r\n");
                    }
                    else
                    {
                        webvtt = webvtt_subtitler(track.name.substr((~-track.name.lastIndexOf(".") >>> 0) + 2), event.target.result);
                    }
                    console.log(webvtt);
                    currentPlayer.source({
                        tracks: [{
                            src: "data:text/vtt;base64," + window.btoa(webvtt),
                            default: true
                        }]
                    });
                }
                reader.readAsText(track);
                readyTrackStatus();
            } else {
                $("#status").text("Not supported format... Officially support ASS, SSA, SRT and VTT formats");
                setTimeout(defaultStatus, 5000);
            }
        }
    });
    init();
});