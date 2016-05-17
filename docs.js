"use strict";
var iconSvg, videoPlayer, audioPlayer, currentMode, embedMode, currentPlayer;
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
iconSvg = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3ltYm9sIGlkPSJwbHlyLWNhcHRpb25zLW9mZiIgdmlld0JveD0iMCAwIDE4IDE4Ij48cGF0aCBkPSJNMSAxYy0uNiAwLTEgLjQtMSAxdjExYzAgLjYuNCAxIDEgMWg0LjZsMi43IDIuN2MuMi4yLjQuMy43LjMuMyAwIC41LS4xLjctLjNsMi43LTIuN0gxN2MuNiAwIDEtLjQgMS0xVjJjMC0uNi0uNC0xLTEtMUgxem00LjUyIDEwLjE1YzEuOTkgMCAzLjAxLTEuMzIgMy4yOC0yLjQxbC0xLjI5LS4zOWMtLjE5LjY2LS43OCAxLjQ1LTEuOTkgMS40NS0xLjE0IDAtMi4yLS44My0yLjItMi4zNCAwLTEuNjEgMS4xMi0yLjM3IDIuMTgtMi4zNyAxLjIzIDAgMS43OC43NSAxLjk1IDEuNDNsMS4zLS40MUM4LjQ3IDQuOTYgNy40NiAzLjc2IDUuNSAzLjc2Yy0xLjkgMC0zLjYxIDEuNDQtMy42MSAzLjcgMCAyLjI2IDEuNjUgMy42OSAzLjYzIDMuNjl6bTcuNTcgMGMxLjk5IDAgMy4wMS0xLjMyIDMuMjgtMi40MWwtMS4yOS0uMzljLS4xOS42Ni0uNzggMS40NS0xLjk5IDEuNDUtMS4xNCAwLTIuMi0uODMtMi4yLTIuMzQgMC0xLjYxIDEuMTItMi4zNyAyLjE4LTIuMzcgMS4yMyAwIDEuNzguNzUgMS45NSAxLjQzbDEuMy0uNDFjLS4yOC0xLjE1LTEuMjktMi4zNS0zLjI1LTIuMzUtMS45IDAtMy42MSAxLjQ0LTMuNjEgMy43IDAgMi4yNiAxLjY1IDMuNjkgMy42MyAzLjY5eiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsLW9wYWNpdHk9Ii41Ii8+PC9zeW1ib2w+PHN5bWJvbCBpZD0icGx5ci1jYXB0aW9ucy1vbiIgdmlld0JveD0iMCAwIDE4IDE4Ij48cGF0aCBkPSJNMSAxYy0uNiAwLTEgLjQtMSAxdjExYzAgLjYuNCAxIDEgMWg0LjZsMi43IDIuN2MuMi4yLjQuMy43LjMuMyAwIC41LS4xLjctLjNsMi43LTIuN0gxN2MuNiAwIDEtLjQgMS0xVjJjMC0uNi0uNC0xLTEtMUgxem00LjUyIDEwLjE1YzEuOTkgMCAzLjAxLTEuMzIgMy4yOC0yLjQxbC0xLjI5LS4zOWMtLjE5LjY2LS43OCAxLjQ1LTEuOTkgMS40NS0xLjE0IDAtMi4yLS44My0yLjItMi4zNCAwLTEuNjEgMS4xMi0yLjM3IDIuMTgtMi4zNyAxLjIzIDAgMS43OC43NSAxLjk1IDEuNDNsMS4zLS40MUM4LjQ3IDQuOTYgNy40NiAzLjc2IDUuNSAzLjc2Yy0xLjkgMC0zLjYxIDEuNDQtMy42MSAzLjcgMCAyLjI2IDEuNjUgMy42OSAzLjYzIDMuNjl6bTcuNTcgMGMxLjk5IDAgMy4wMS0xLjMyIDMuMjgtMi40MWwtMS4yOS0uMzljLS4xOS42Ni0uNzggMS40NS0xLjk5IDEuNDUtMS4xNCAwLTIuMi0uODMtMi4yLTIuMzQgMC0xLjYxIDEuMTItMi4zNyAyLjE4LTIuMzcgMS4yMyAwIDEuNzguNzUgMS45NSAxLjQzbDEuMy0uNDFjLS4yOC0xLjE1LTEuMjktMi4zNS0zLjI1LTIuMzUtMS45IDAtMy42MSAxLjQ0LTMuNjEgMy43IDAgMi4yNiAxLjY1IDMuNjkgMy42MyAzLjY5eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zeW1ib2w+PHN5bWJvbCBpZD0icGx5ci1lbnRlci1mdWxsc2NyZWVuIiB2aWV3Qm94PSIwIDAgMTggMTgiPjxwYXRoIGQ9Ik0xMCAzaDMuNmwtNCA0TDExIDguNGw0LTRWOGgyVjFoLTd6TTcgOS42bC00IDRWMTBIMXY3aDd2LTJINC40bDQtNHoiLz48L3N5bWJvbD48c3ltYm9sIGlkPSJwbHlyLWV4aXQtZnVsbHNjcmVlbiIgdmlld0JveD0iMCAwIDE4IDE4Ij48cGF0aCBkPSJNMSAxMmgzLjZsLTQgNEwyIDE3LjRsNC00VjE3aDJ2LTdIMXpNMTYgLjZsLTQgNFYxaC0ydjdoN1Y2aC0zLjZsNC00eiIvPjwvc3ltYm9sPjxzeW1ib2wgaWQ9InBseXItZmFzdC1mb3J3YXJkIiB2aWV3Qm94PSIwIDAgMTggMTgiPjxwYXRoIGQ9Ik03Ljg3NSA3LjE3MUwwIDF2MTZsNy44NzUtNi4xNzFWMTdMMTggOSA3Ljg3NSAxeiIvPjwvc3ltYm9sPjxzeW1ib2wgaWQ9InBseXItbXV0ZWQiIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHBhdGggZD0iTTEyLjQgMTIuNWwyLjEtMi4xIDIuMSAyLjEgMS40LTEuNEwxNS45IDkgMTggNi45bC0xLjQtMS40LTIuMSAyLjEtMi4xLTIuMUwxMSA2LjkgMTMuMSA5IDExIDExLjF6TTMuNzg2IDYuMDA4SC43MTRDLjI4NiA2LjAwOCAwIDYuMzEgMCA2Ljc2djQuNTEyYzAgLjQ1Mi4yODYuNzUyLjcxNC43NTJoMy4wNzJsNC4wNzEgMy44NThjLjUuMyAxLjE0MyAwIDEuMTQzLS42MDJWMi43NTJjMC0uNjAxLS42NDMtLjk3Ny0xLjE0My0uNjAxTDMuNzg2IDYuMDA4eiIvPjwvc3ltYm9sPjxzeW1ib2wgaWQ9InBseXItcGF1c2UiIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHBhdGggZD0iTTYgMUgzYy0uNiAwLTEgLjQtMSAxdjE0YzAgLjYuNCAxIDEgMWgzYy42IDAgMS0uNCAxLTFWMmMwLS42LS40LTEtMS0xek0xMiAxYy0uNiAwLTEgLjQtMSAxdjE0YzAgLjYuNCAxIDEgMWgzYy42IDAgMS0uNCAxLTFWMmMwLS42LS40LTEtMS0xaC0zeiIvPjwvc3ltYm9sPjxzeW1ib2wgaWQ9InBseXItcGxheSIgdmlld0JveD0iMCAwIDE4IDE4Ij48cGF0aCBkPSJNMTUuNTYyIDguMUwzLjg3LjIyNUMzLjA1Mi0uMzM3IDIgLjIyNSAyIDEuMTI1djE1Ljc1YzAgLjkgMS4wNTIgMS40NjIgMS44Ny45TDE1LjU2MyA5LjljLjU4NC0uNDUuNTg0LTEuMzUgMC0xLjh6Ii8+PC9zeW1ib2w+PHN5bWJvbCBpZD0icGx5ci1yZXN0YXJ0IiB2aWV3Qm94PSIwIDAgMTggMTgiPjxwYXRoIGQ9Ik05LjcgMS4ybC43IDYuNCAyLjEtMi4xYzEuOSAxLjkgMS45IDUuMSAwIDctLjkgMS0yLjIgMS41LTMuNSAxLjUtMS4zIDAtMi42LS41LTMuNS0xLjUtMS45LTEuOS0xLjktNS4xIDAtNyAuNi0uNiAxLjQtMS4xIDIuMy0xLjNsLS42LTEuOUM2IDIuNiA0LjkgMy4yIDQgNC4xIDEuMyA2LjggMS4zIDExLjIgNCAxNGMxLjMgMS4zIDMuMSAyIDQuOSAyIDEuOSAwIDMuNi0uNyA0LjktMiAyLjctMi43IDIuNy03LjEgMC05LjlMMTYgMS45bC02LjMtLjd6Ii8+PC9zeW1ib2w+PHN5bWJvbCBpZD0icGx5ci1yZXdpbmQiIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHBhdGggZD0iTTEwLjEyNSAxTDAgOWwxMC4xMjUgOHYtNi4xNzFMMTggMTdWMWwtNy44NzUgNi4xNzF6Ii8+PC9zeW1ib2w+PHN5bWJvbCBpZD0icGx5ci12b2x1bWUiIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHBhdGggZD0iTTE1LjYgMy4zYy0uNC0uNC0xLS40LTEuNCAwLS40LjQtLjQgMSAwIDEuNEMxNS40IDUuOSAxNiA3LjQgMTYgOWMwIDEuNi0uNiAzLjEtMS44IDQuMy0uNC40LS40IDEgMCAxLjQuMi4yLjUuMy43LjMuMyAwIC41LS4xLjctLjNDMTcuMSAxMy4yIDE4IDExLjIgMTggOXMtLjktNC4yLTIuNC01Ljd6Ii8+PHBhdGggZD0iTTExLjI4MiA1LjI4MmEuOTA5LjkwOSAwIDAgMCAwIDEuMzE2Yy43MzUuNzM1Ljk5NSAxLjQ1OC45OTUgMi40MDIgMCAuOTM2LS40MjUgMS45MTctLjk5NSAyLjQ4N2EuOTA5LjkwOSAwIDAgMCAwIDEuMzE2Yy4xNDUuMTQ1LjYzNi4yNjIgMS4wMTguMTU2YS43MjUuNzI1IDAgMCAwIC4yOTgtLjE1NkMxMy43NzMgMTEuNzMzIDE0LjEzIDEwLjE2IDE0LjEzIDljMC0uMTctLjAwMi0uMzQtLjAxMS0uNTEtLjA1My0uOTkyLS4zMTktMi4wMDUtMS41MjItMy4yMDhhLjkwOS45MDkgMCAwIDAtMS4zMTYgMHpNMy43ODYgNi4wMDhILjcxNEMuMjg2IDYuMDA4IDAgNi4zMSAwIDYuNzZ2NC41MTJjMCAuNDUyLjI4Ni43NTIuNzE0Ljc1MmgzLjA3Mmw0LjA3MSAzLjg1OGMuNS4zIDEuMTQzIDAgMS4xNDMtLjYwMlYyLjc1MmMwLS42MDEtLjY0My0uOTc3LTEuMTQzLS42MDFMMy43ODYgNi4wMDh6Ii8+PC9zeW1ib2w+PC9zdmc+";
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
            iconUrl: iconSvg,
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