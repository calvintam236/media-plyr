"use strict";
var Hogan={};!function(t){function n(t,n,e){var s;return n&&"object"==typeof n&&(void 0!==n[t]?s=n[t]:e&&n.get&&"function"==typeof n.get&&(s=n.get(t))),s}function e(t,n,e,s,r,a){function i(){}function o(){}i.prototype=t,o.prototype=t.subs;var l,u=new i;u.subs=new o,u.subsText={},u.buf="",s=s||{},u.stackSubs=s,u.subsText=a;for(l in n)s[l]||(s[l]=n[l]);for(l in s)u.subs[l]=s[l];r=r||{},u.stackPartials=r;for(l in e)r[l]||(r[l]=e[l]);for(l in r)u.partials[l]=r[l];return u}function s(t){return String(null===t||void 0===t?"":t)}function r(t){return t=s(t),c.test(t)?t.replace(a,"&").replace(i,"&lt;").replace(o,"&gt;").replace(l,"&#39;").replace(u,"&quot;"):t}t.Template=function(t,n,e,s){t=t||{},this.r=t.code||this.r,this.c=e,this.options=s||{},this.text=n||"",this.partials=t.partials||{},this.subs=t.subs||{},this.buf=""},t.Template.prototype={r:function(){return""},v:r,t:s,render:function(t,n,e){return this.ri([t],n||{},e)},ri:function(t,n,e){return this.r(t,n,e)},ep:function(t,n){var s=this.partials[t],r=n[s.name];if(s.instance&&s.base==r)return s.instance;if("string"==typeof r){if(!this.c)throw new Error("No compiler available.");r=this.c.compile(r,this.options)}if(!r)return null;if(this.partials[t].base=r,s.subs){n.stackText||(n.stackText={});for(key in s.subs)n.stackText[key]||(n.stackText[key]=void 0!==this.activeSub&&n.stackText[this.activeSub]?n.stackText[this.activeSub]:this.text);r=e(r,s.subs,s.partials,this.stackSubs,this.stackPartials,n.stackText)}return this.partials[t].instance=r,r},rp:function(t,n,e,s){var r=this.ep(t,e);return r?r.ri(n,e,s):""},rs:function(t,n,e){var s=t[t.length-1];if(!p(s))return void e(t,n,this);for(var r=0;r<s.length;r++)t.push(s[r]),e(t,n,this),t.pop()},s:function(t,n,e,s,r,a,i){var o;return p(t)&&0===t.length?!1:("function"==typeof t&&(t=this.ms(t,n,e,s,r,a,i)),o=!!t,!s&&o&&n&&n.push("object"==typeof t?t:n[n.length-1]),o)},d:function(t,e,s,r){var a,i=t.split("."),o=this.f(i[0],e,s,r),l=this.options.modelGet,u=null;if("."===t&&p(e[e.length-2]))o=e[e.length-1];else for(var c=1;c<i.length;c++)a=n(i[c],o,l),void 0!==a?(u=o,o=a):o="";return r&&!o?!1:(r||"function"!=typeof o||(e.push(u),o=this.mv(o,e,s),e.pop()),o)},f:function(t,e,s,r){for(var a=!1,i=null,o=!1,l=this.options.modelGet,u=e.length-1;u>=0;u--)if(i=e[u],a=n(t,i,l),void 0!==a){o=!0;break}return o?(r||"function"!=typeof a||(a=this.mv(a,e,s)),a):r?!1:""},ls:function(t,n,e,r,a){var i=this.options.delimiters;return this.options.delimiters=a,this.b(this.ct(s(t.call(n,r)),n,e)),this.options.delimiters=i,!1},ct:function(t,n,e){if(this.options.disableLambda)throw new Error("Lambda features disabled.");return this.c.compile(t,this.options).render(n,e)},b:function(t){this.buf+=t},fl:function(){var t=this.buf;return this.buf="",t},ms:function(t,n,e,s,r,a,i){var o,l=n[n.length-1],u=t.call(l);return"function"==typeof u?s?!0:(o=this.activeSub&&this.subsText&&this.subsText[this.activeSub]?this.subsText[this.activeSub]:this.text,this.ls(u,l,e,o.substring(r,a),i)):u},mv:function(t,n,e){var r=n[n.length-1],a=t.call(r);return"function"==typeof a?this.ct(s(a.call(r)),r,e):a},sub:function(t,n,e,s){var r=this.subs[t];r&&(this.activeSub=t,r(n,e,this,s),this.activeSub=!1)}};var a=/&/g,i=/</g,o=/>/g,l=/\'/g,u=/\"/g,c=/[&<>\"\']/,p=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}}("undefined"!=typeof exports?exports:Hogan),function(t){function n(t){"}"===t.n.substr(t.n.length-1)&&(t.n=t.n.substring(0,t.n.length-1))}function e(t){return t.trim?t.trim():t.replace(/^\s*|\s*$/g,"")}function s(t,n,e){if(n.charAt(e)!=t.charAt(0))return!1;for(var s=1,r=t.length;r>s;s++)if(n.charAt(e+s)!=t.charAt(s))return!1;return!0}function r(n,e,s,o){var l=[],u=null,c=null,p=null;for(c=s[s.length-1];n.length>0;){if(p=n.shift(),c&&"<"==c.tag&&!(p.tag in k))throw new Error("Illegal content in < super tag.");if(t.tags[p.tag]<=t.tags.$||a(p,o))s.push(p),p.nodes=r(n,p.tag,s,o);else{if("/"==p.tag){if(0===s.length)throw new Error("Closing tag without opener: /"+p.n);if(u=s.pop(),p.n!=u.n&&!i(p.n,u.n,o))throw new Error("Nesting error: "+u.n+" vs. "+p.n);return u.end=p.i,l}"\n"==p.tag&&(p.last=0==n.length||"\n"==n[0].tag)}l.push(p)}if(s.length>0)throw new Error("missing closing tag: "+s.pop().n);return l}function a(t,n){for(var e=0,s=n.length;s>e;e++)if(n[e].o==t.n)return t.tag="#",!0}function i(t,n,e){for(var s=0,r=e.length;r>s;s++)if(e[s].c==t&&e[s].o==n)return!0}function o(t){var n=[];for(var e in t)n.push('"'+u(e)+'": function(c,p,t,i) {'+t[e]+"}");return"{ "+n.join(",")+" }"}function l(t){var n=[];for(var e in t.partials)n.push('"'+u(e)+'":{name:"'+u(t.partials[e].name)+'", '+l(t.partials[e])+"}");return"partials: {"+n.join(",")+"}, subs: "+o(t.subs)}function u(t){return t.replace(y,"\\\\").replace(g,'\\"').replace(v,"\\n").replace(d,"\\r").replace(m,"\\u2028").replace(x,"\\u2029")}function c(t){return~t.indexOf(".")?"d":"f"}function p(t,n){var e="<"+(n.prefix||""),s=e+t.n+w++;return n.partials[s]={name:t.n,partials:{}},n.code+='t.b(t.rp("'+u(s)+'",c,p,"'+(t.indent||"")+'"));',s}function b(t,n){n.code+="t.b(t.t(t."+c(t.n)+'("'+u(t.n)+'",c,p,0)));'}function f(t){return"t.b("+t+");"}var h=/\S/,g=/\"/g,v=/\n/g,d=/\r/g,y=/\\/g,m=/\u2028/,x=/\u2029/;t.tags={"#":1,"^":2,"<":3,$:4,"/":5,"!":6,">":7,"=":8,_v:9,"{":10,"&":11,_t:12},t.scan=function(r,a){function i(){y.length>0&&(m.push({tag:"_t",text:new String(y)}),y="")}function o(){for(var n=!0,e=w;e<m.length;e++)if(n=t.tags[m[e].tag]<t.tags._v||"_t"==m[e].tag&&null===m[e].text.match(h),!n)return!1;return n}function l(t,n){if(i(),t&&o())for(var e,s=w;s<m.length;s++)m[s].text&&((e=m[s+1])&&">"==e.tag&&(e.indent=m[s].text.toString()),m.splice(s,1));else n||m.push({tag:"\n"});x=!1,w=m.length}function u(t,n){var s="="+S,r=t.indexOf(s,n),a=e(t.substring(t.indexOf("=",n)+1,r)).split(" ");return T=a[0],S=a[a.length-1],r+s.length-1}var c=r.length,p=0,b=1,f=2,g=p,v=null,d=null,y="",m=[],x=!1,k=0,w=0,T="{{",S="}}";for(a&&(a=a.split(" "),T=a[0],S=a[1]),k=0;c>k;k++)g==p?s(T,r,k)?(--k,i(),g=b):"\n"==r.charAt(k)?l(x):y+=r.charAt(k):g==b?(k+=T.length-1,d=t.tags[r.charAt(k+1)],v=d?r.charAt(k+1):"_v","="==v?(k=u(r,k),g=p):(d&&k++,g=f),x=k):s(S,r,k)?(m.push({tag:v,n:e(y),otag:T,ctag:S,i:"/"==v?x-T.length:k+S.length}),y="",k+=S.length-1,g=p,"{"==v&&("}}"==S?k++:n(m[m.length-1]))):y+=r.charAt(k);return l(x,!0),m};var k={_t:!0,"\n":!0,$:!0,"/":!0};t.stringify=function(n){return"{code: function (c,p,i) { "+t.wrapMain(n.code)+" },"+l(n)+"}"};var w=0;t.generate=function(n,e,s){w=0;var r={code:"",subs:{},partials:{}};return t.walk(n,r),s.asString?this.stringify(r,e,s):this.makeTemplate(r,e,s)},t.wrapMain=function(t){return'var t=this;t.b(i=i||"");'+t+"return t.fl();"},t.template=t.Template,t.makeTemplate=function(t,n,e){var s=this.makePartials(t);return s.code=new Function("c","p","i",this.wrapMain(t.code)),new this.template(s,n,this,e)},t.makePartials=function(t){var n,e={subs:{},partials:t.partials,name:t.name};for(n in e.partials)e.partials[n]=this.makePartials(e.partials[n]);for(n in t.subs)e.subs[n]=new Function("c","p","t","i",t.subs[n]);return e},t.codegen={"#":function(n,e){e.code+="if(t.s(t."+c(n.n)+'("'+u(n.n)+'",c,p,1),c,p,0,'+n.i+","+n.end+',"'+n.otag+" "+n.ctag+'")){t.rs(c,p,function(c,p,t){',t.walk(n.nodes,e),e.code+="});c.pop();}"},"^":function(n,e){e.code+="if(!t.s(t."+c(n.n)+'("'+u(n.n)+'",c,p,1),c,p,1,0,0,"")){',t.walk(n.nodes,e),e.code+="};"},">":p,"<":function(n,e){var s={partials:{},code:"",subs:{},inPartial:!0};t.walk(n.nodes,s);var r=e.partials[p(n,e)];r.subs=s.subs,r.partials=s.partials},$:function(n,e){var s={subs:{},code:"",partials:e.partials,prefix:n.n};t.walk(n.nodes,s),e.subs[n.n]=s.code,e.inPartial||(e.code+='t.sub("'+u(n.n)+'",c,p,i);')},"\n":function(t,n){n.code+=f('"\\n"'+(t.last?"":" + i"))},_v:function(t,n){n.code+="t.b(t.v(t."+c(t.n)+'("'+u(t.n)+'",c,p,0)));'},_t:function(t,n){n.code+=f('"'+u(t.text)+'"')},"{":b,"&":b},t.walk=function(n,e){for(var s,r=0,a=n.length;a>r;r++)s=t.codegen[n[r].tag],s&&s(n[r],e);return e},t.parse=function(t,n,e){return e=e||{},r(t,"",[],e.sectionTags||[])},t.cache={},t.cacheKey=function(t,n){return[t,!!n.asString,!!n.disableLambda,n.delimiters,!!n.modelGet].join("||")},t.compile=function(n,e){e=e||{};var s=t.cacheKey(n,e),r=this.cache[s];if(r){var a=r.partials;for(var i in a)delete a[i].instance;return r}return r=this.generate(this.parse(this.scan(n,e.delimiters),n,e),n,e),this.cache[s]=r}}("undefined"!=typeof exports?exports:Hogan);var Mustache=function(t){function n(n,e,s,r){var a=this.f(n,e,s,0),i=e;return a&&(i=i.concat(a)),t.Template.prototype.rp.call(this,n,i,s,r)}var e=function(e,s,r){this.rp=n,t.Template.call(this,e,s,r)};e.prototype=t.Template.prototype;var s,r=function(){this.cache={},this.generate=function(t,n){return new e(new Function("c","p","i",t),n,s)}};return r.prototype=t,s=new r,{to_html:function(t,n,e,r){var a=s.compile(t),i=a.render(n,e);return r?void r(i):i}}}(Hogan),templates={};templates.controls=new Hogan.Template({code:function(t,n,e){var s=this;return s.b(e=e||""),s.b('<div class="player-controls">'),s.b("\n"+e),s.b('    <div class="player-progress">'),s.b("\n"+e),s.b('        <label for="seek{id}" class="sr-only">Seek</label>'),s.b("\n"+e),s.b('        <input id="seek{id}" class="player-progress-seek" type="range" min="0" max="100" step="0.5" value="0" data-player="seek">'),s.b("\n"+e),s.b('        <progress class="player-progress-played" max="100" value="0">'),s.b("\n"+e),s.b("            <span>0</span>% played"),s.b("\n"+e),s.b("        </progress>"),s.b("\n"+e),s.b('        <progress class="player-progress-buffer" max="100" value="0">'),s.b("\n"+e),s.b("            <span>0</span>% buffered"),s.b("\n"+e),s.b("        </progress>"),s.b("\n"+e),s.b("    </div>"),s.b("\n"+e),s.b('    <span class="player-controls-left">'),s.b("\n"+e),s.b('        <button type="button" data-player="restart">'),s.b("\n"+e),s.b('            <svg><use xlink:href="#icon-restart"></use></svg>'),s.b("\n"+e),s.b('            <span class="sr-only">Restart</span>'),s.b("\n"+e),s.b("        </button>"),s.b("\n"+e),s.b('        <button type="button" data-player="rewind">'),s.b("\n"+e),s.b('            <svg><use xlink:href="#icon-rewind"></use></svg>'),s.b("\n"+e),s.b('            <span class="sr-only">Rewind {seektime} secs</span>'),s.b("\n"+e),s.b("        </button>"),s.b("\n"+e),s.b('        <button type="button" data-player="play">'),s.b("\n"+e),s.b('            <svg><use xlink:href="#icon-play"></use></svg>'),s.b("\n"+e),s.b('            <span class="sr-only">Play</span>'),s.b("\n"+e),s.b("        </button>"),s.b("\n"+e),s.b('        <button type="button" data-player="pause">'),s.b("\n"+e),s.b('            <svg><use xlink:href="#icon-pause"></use></svg>'),s.b("\n"+e),s.b('            <span class="sr-only">Pause</span>'),s.b("\n"+e),s.b("        </button>"),s.b("\n"+e),s.b('        <button type="button" data-player="fast-forward">'),s.b("\n"+e),s.b('            <svg><use xlink:href="#icon-fast-forward"></use></svg>'),s.b("\n"+e),s.b('            <span class="sr-only">Forward {seektime} secs</span>'),s.b("\n"+e),s.b("        </button>"),s.b("\n"+e),s.b('        <span class="player-time">'),s.b("\n"+e),s.b('            <span class="sr-only">Current time</span>'),s.b("\n"+e),s.b('            <span class="player-current-time">00:00</span>'),s.b("\n"+e),s.b("        </span>"),s.b("\n"+e),s.b('        <span class="player-time">'),s.b("\n"+e),s.b('            <span class="sr-only">Duration</span>'),s.b("\n"+e),s.b('            <span class="player-duration">00:00</span>'),s.b("\n"+e),s.b("        </span>"),s.b("\n"+e),s.b("    </span>"),s.b("\n"+e),s.b('    <span class="player-controls-right">'),s.b("\n"+e),s.b('        <input class="inverted sr-only" id="mute{id}" type="checkbox" data-player="mute">'),s.b("\n"+e),s.b('        <label id="mute{id}" for="mute{id}">'),s.b("\n"+e),s.b('            <svg class="icon-muted"><use xlink:href="#icon-muted"></use></svg>'),s.b("\n"+e),s.b('            <svg><use xlink:href="#icon-volume"></use></svg>'),s.b("\n"+e),s.b('            <span class="sr-only">Toggle Mute</span>'),s.b("\n"+e),s.b("        </label>"),s.b("\n"),s.b("\n"+e),s.b('        <label for="volume{id}" class="sr-only">Volume</label>'),s.b("\n"+e),s.b('        <input id="volume{id}" class="player-volume" type="range" min="0" max="10" step="0.5" value="0" data-player="volume">'),s.b("\n"),s.b("\n"+e),s.b('        <input class="sr-only" id="captions{id}" type="checkbox" data-player="captions">'),s.b("\n"+e),s.b('        <label for="captions{id}">'),s.b("\n"+e),s.b('            <svg class="icon-captions-on"><use xlink:href="#icon-captions-on"></use></svg>'),s.b("\n"+e),s.b('            <svg><use xlink:href="#icon-captions-off"></use></svg>'),s.b("\n"+e),s.b('            <span class="sr-only">Toggle Captions</span>'),s.b("\n"+e),s.b("        </label>"),s.b("\n"),s.b("\n"+e),s.b('        <button type="button" data-player="fullscreen">'),s.b("\n"+e),s.b('            <svg class="icon-exit-fullscreen"><use xlink:href="#icon-exit-fullscreen"></use></svg>'),s.b("\n"+e),s.b('            <svg><use xlink:href="#icon-enter-fullscreen"></use></svg>'),s.b("\n"+e),s.b('            <span class="sr-only">Toggle Fullscreen</span>'),s.b("\n"+e),s.b("        </button>"),s.b("\n"+e),s.b("    </span>"),s.b("\n"+e),s.b("</div>"),s.fl()},partials:{},subs:{}});
var currentMode, currentPlayer, videoPlayer, audioPlayer, sourcePending;
plyr.setup({
    volume: 10,
    seekTime: 3,
    html: templates.controls.render({}),
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
            $("input[type=url][name=source]").focus();
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
        $("#status").text("Note: Subtitle option is available after video is selected.");
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
    $("input[type=url][name=source]").change(function() {
        var source = $(this).val();
        if (source !== undefined) {
            if (source.match(/youtube.com/) !== null || source.match(/youtu.be/) !== null) {
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