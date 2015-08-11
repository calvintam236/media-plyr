"use strict";
var currentMode, currentPlayer, videoPlayer, audioPlayer, sourcePending;
plyr.setup({
    tooltips: true,
    volume: 10,
    seekTime: 3,
    captions: {
        defaultActive: true
    },
    onSetup: function() {
        var t = this,
            n = t.media.tagName.toLowerCase(),
            e = document.querySelector("[data-toggle='fullscreen']");
    }
});
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
    videoPlayer = $(".video .player")[0].plyr;
    audioPlayer = $(".audio .player")[0].plyr;
    function init() {
        hidePlayers();
        defaultStatus();
        $(".btn-url").on("mouseenter click", function() {
            $("input[type=text][name=source]").focus();
        });
        $(".btn").mouseleave(function() {
            $("input").blur();
        });
        $("a[href=#]").click(function() {
            $("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        });
    }
    function hidePlayers() {
        sourcePending = false;
        $(".track, .video, .audio").hide();
    }
    function defaultStatus() {
        $("#status").text("Subtitle option will be available after video is selected");
    }
    function pausePlayers() {
        videoPlayer.pause();
        audioPlayer.pause();
    }
    function showPlayer(source) {
        $("." + currentMode).show();
        currentPlayer.source(source);
    }
    function videoMode() {
        $("input").blur();
        sourcePending = true;
        currentMode = "video";
        currentPlayer = videoPlayer;
    }
    function audioMode() {
        $("input").blur();
        sourcePending = true;
        currentMode = "audio";
        currentPlayer = audioPlayer;
    }
    $(document).keydown(function(event) {
        if ($("input:focus").length == 0 && currentPlayer !== undefined) {
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
        pausePlayers();
    });
    $("input[type=file][name=source]").change(function() {
        var source = this.files[0];
        if (source !== undefined) {
            if (source.type.match(/^video/) !== null) {
                videoMode();
            } else if (source.type.match(/^audio/) !== null) {
                audioMode();
            }
            $("input[type=text][name=source]").val("");
            if (sourcePending === true) {
                hidePlayers();
                $("#status").text("Loading " + currentMode + "... This might take a while, and your browser might freeze or crash");
                var reader = new FileReader();
                reader.onload = function(event) {
                    showPlayer(event.target.result);
                }
                reader.readAsDataURL(source);
            } else {
                $("#status").text("Not supported format... Officially support MP4, WEBM, MP3 and OGG formats");
                setTimeout(defaultStatus, 5000);
            }
        }
    });
    $("input[type=text][name=source]").change(function() {
        var source = $(this).val();
        if (source !== undefined && source.length > 0) {
            if (source.match(/youtube.com/) !== null || source.match(/youtu.be/) !== null || source.match(/(\w|-){11}/)) {
                videoMode();
            } else {
                var extension = source.substr((~-source.lastIndexOf(".") >>> 0) + 2);
                switch (extension) {
                    case "mp4":
                    case "webm":
                    case "ogv":
                        videoMode();
                        break;
                    case "mp3":
                    case "wav":
                    case "ogg":
                        audioMode();
                }
            }
            if (sourcePending === true) {
                hidePlayers();
                $("#status").text("Loading " + currentMode + "... This might take a while which depends on your Internet speed");
                setTimeout(function() {
                    showPlayer(source);
                }, 1000);
            } else {
                $("#status").text("Not supported service or format... Officially support YouTube, MP4, WEBM, MP3 and OGG formats");
                setTimeout(defaultStatus, 5000);
            }
        }
    });
    videoPlayer.media.addEventListener("loadstart", function() {
        $(".track").show();
        $("#status").text("Video is ready! Look for player below and click 'Play'/ spacebar");
        setTimeout(defaultStatus, 10000);
    });
    audioPlayer.media.addEventListener("loadstart", function() {
        $("#status").text("Audio is ready! Look for player below and click 'Play'/ spacebar");
        setTimeout(defaultStatus, 10000);
    });
    $("input[name=track]").change(function() {
        var track = this.files[0];
        if (track !== undefined) {
            var extension = track.name.substr((~-track.name.lastIndexOf(".") >>> 0) + 2);
            switch (extension) {
                case "ass":
                case "ssa":
                case "srt":
                case "vtt":
                    $("#status").text("Loading subtitle... You might encounter sync problem while playing");
                    var reader = new FileReader(), webvtt;
                    reader.onload = function(event) {
                        switch (extension) {
                            case "vtt":
                                webvtt = event.target.result.replace(/\r?\n|\r|\n/g, "\r\n");
                                break;
                            default:
                                webvtt = toWebVTT(extension, event.target.result);
                        }
                        console.log(webvtt);
                        //currentPlayer.track("data:text/vtt;base64," + window.btoa(webvtt));
                    }
                    reader.readAsText(track);
                    $("#status").text("Subtitle is ready! Click 'Caption' at the bottom of the player to enable subtitle");
                    setTimeout(defaultStatus, 10000);
                    break;
                default:
                    $("#status").text("Not supported format or missing file extension... Officially support ASS, SSA, SRT and VTT formats");
                    setTimeout(defaultStatus, 5000);
            }
        }
    });
    init();
});