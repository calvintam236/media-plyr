"use strict";
var videoPlayer, audioPlayer, currentMode, embedMode, currentPlayer;
function toWebVTT(extension, text) {
    var rawLines = new Array(), processedLines = new Array(), cue = 0, webvtt = "", i, j;
    // remove all CR and split into array by \r\n
    rawLines = text.replace(/\r?\n|\r|\n/g, "\r\n").split("\r\n");
    switch (extension) {
        case "ass":
        case "ssa":
            var identifier = new Array();
            for (i = 0; i < rawLines.length; i++) {
                if (rawLines[i].toUpperCase().indexOf("[EVENTS]") > -1) {
                    rawLines.splice(0, i + 1);
                    break;
                }
            }
            for (i = 0; i < rawLines.length; i++) {
                var line = new Array();
                if (rawLines[i].trim().length > 0) {
                    var lineArray = new Array();
                    lineArray[0] = rawLines[i].split(": ");
                    lineArray[1] = lineArray[0][1].split(",");
                    line[0] = lineArray[0][0];
                    line = line.concat(lineArray[1]);
                    if (line[0].toUpperCase().indexOf("FORMAT") > -1) {
                        for (j = 1; j < line.length; j++) {
                            if (line[j].toUpperCase().indexOf("START") > -1) {
                                identifier[0] = j;
                                continue;
                            }
                            if (line[j].toUpperCase().indexOf("END") > -1) {
                                identifier[1] = j;
                                continue;
                            }
                            if (line[j].toUpperCase().indexOf("TEXT") > -1) {
                                identifier[2] = j;
                                continue;
                            }
                        }
                    } else {
                        processedLines[cue] = new Array();
                        processedLines[cue++] = [line[identifier[0]], line[identifier[1]], line[identifier[2]]];
                    }
                }
            }
            break;
        case "srt":
            for (i = 0; i < rawLines.length; i++) {
                var line = new Array();
                if (rawLines[i] == cue + 1) {
                    continue;
                } else if (rawLines[i].trim().length > 1) {
                    if (rawLines[i].indexOf(" --> ") > -1) {
                        line = rawLines[i].split(" --> ");
                        processedLines[cue] = new Array();
                        processedLines[cue][0] = line[0].replace(",", ".");
                        processedLines[cue][1] = line[1].replace(",", ".");
                        processedLines[cue][2] = "";
                    } else {
                        if (processedLines[cue][2].length > 0) {
                            processedLines[cue][2] += "\r\n";
                        }
                        processedLines[cue][2] += rawLines[i];
                    }
                } else if (processedLines[cue] !== undefined) {
                    cue++;
                }
            }
    }
    if (cue > 0) {
        webvtt += "WEBVTT\r\n";
        for (i = 0; i < cue; i++) {
            webvtt += "\r\n" + (i + 1) + "\r\n";
            var timing = new Array();
            for (j = 0; j < 2; j++) {
                timing[j] = new Date("0000-01-01T" + ("0" + processedLines[i][j]).slice(-12) + "Z");
                processedLines[i][j] = ("0" + timing[j].getUTCHours()).slice(-2) + ":" + ("0" + timing[j].getUTCMinutes()).slice(-2) + ":" + ("0" + timing[j].getUTCSeconds()).slice(-2) + "." + ("00" + timing[j].getUTCMilliseconds()).slice(-3);
            }
            webvtt += processedLines[i][0] + " --> " + processedLines[i][1] + "\r\n" + processedLines[i][2] + "\r\n";
        }
    }
    return webvtt;
}
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
        currentPlayer.media.addEventListener("loadstart", function() {
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
        currentPlayer.media.addEventListener("loadstart", function() {
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
    $("input[type=file]").click(function() {
        if (currentMode !== null) {
            currentPlayer.pause();
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
                        webvtt = toWebVTT(track.name.substr((~-track.name.lastIndexOf(".") >>> 0) + 2), event.target.result);
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