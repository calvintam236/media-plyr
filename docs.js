var Hogan = {};
! function(t) {
    function n(t, n, e) {
        var s;
        return n && "object" == typeof n && (void 0 !== n[t] ? s = n[t] : e && n.get && "function" == typeof n.get && (s = n.get(t))), s
    }

    function e(t, n, e, s, a, r) {
        function i() {}

        function o() {}
        i.prototype = t, o.prototype = t.subs;
        var l, u = new i;
        u.subs = new o, u.subsText = {}, u.buf = "", s = s || {}, u.stackSubs = s, u.subsText = r;
        for (l in n) s[l] || (s[l] = n[l]);
        for (l in s) u.subs[l] = s[l];
        a = a || {}, u.stackPartials = a;
        for (l in e) a[l] || (a[l] = e[l]);
        for (l in a) u.partials[l] = a[l];
        return u
    }

    function s(t) {
        return String(null === t || void 0 === t ? "" : t)
    }

    function a(t) {
        return t = s(t), c.test(t) ? t.replace(r, "&amp;").replace(i, "&lt;").replace(o, "&gt;").replace(l, "&#39;").replace(u, "&quot;") : t
    }
    t.Template = function(t, n, e, s) {
        t = t || {}, this.r = t.code || this.r, this.c = e, this.options = s || {}, this.text = n || "", this.partials = t.partials || {}, this.subs = t.subs || {}, this.buf = ""
    }, t.Template.prototype = {
        r: function() {
            return ""
        },
        v: a,
        t: s,
        render: function(t, n, e) {
            return this.ri([t], n || {}, e)
        },
        ri: function(t, n, e) {
            return this.r(t, n, e)
        },
        ep: function(t, n) {
            var s = this.partials[t],
                a = n[s.name];
            if (s.instance && s.base == a) return s.instance;
            if ("string" == typeof a) {
                if (!this.c) throw new Error("No compiler available.");
                a = this.c.compile(a, this.options)
            }
            if (!a) return null;
            if (this.partials[t].base = a, s.subs) {
                n.stackText || (n.stackText = {});
                for (key in s.subs) n.stackText[key] || (n.stackText[key] = void 0 !== this.activeSub && n.stackText[this.activeSub] ? n.stackText[this.activeSub] : this.text);
                a = e(a, s.subs, s.partials, this.stackSubs, this.stackPartials, n.stackText)
            }
            return this.partials[t].instance = a, a
        },
        rp: function(t, n, e, s) {
            var a = this.ep(t, e);
            return a ? a.ri(n, e, s) : ""
        },
        rs: function(t, n, e) {
            var s = t[t.length - 1];
            if (!p(s)) return e(t, n, this), void 0;
            for (var a = 0; a < s.length; a++) t.push(s[a]), e(t, n, this), t.pop()
        },
        s: function(t, n, e, s, a, r, i) {
            var o;
            return p(t) && 0 === t.length ? !1 : ("function" == typeof t && (t = this.ms(t, n, e, s, a, r, i)), o = !! t, !s && o && n && n.push("object" == typeof t ? t : n[n.length - 1]), o)
        },
        d: function(t, e, s, a) {
            var r, i = t.split("."),
                o = this.f(i[0], e, s, a),
                l = this.options.modelGet,
                u = null;
            if ("." === t && p(e[e.length - 2])) o = e[e.length - 1];
            else
                for (var c = 1; c < i.length; c++) r = n(i[c], o, l), void 0 !== r ? (u = o, o = r) : o = "";
            return a && !o ? !1 : (a || "function" != typeof o || (e.push(u), o = this.mv(o, e, s), e.pop()), o)
        },
        f: function(t, e, s, a) {
            for (var r = !1, i = null, o = !1, l = this.options.modelGet, u = e.length - 1; u >= 0; u--)
                if (i = e[u], r = n(t, i, l), void 0 !== r) {
                    o = !0;
                    break
                }
            return o ? (a || "function" != typeof r || (r = this.mv(r, e, s)), r) : a ? !1 : ""
        },
        ls: function(t, n, e, a, r) {
            var i = this.options.delimiters;
            return this.options.delimiters = r, this.b(this.ct(s(t.call(n, a)), n, e)), this.options.delimiters = i, !1
        },
        ct: function(t, n, e) {
            if (this.options.disableLambda) throw new Error("Lambda features disabled.");
            return this.c.compile(t, this.options).render(n, e)
        },
        b: function(t) {
            this.buf += t
        },
        fl: function() {
            var t = this.buf;
            return this.buf = "", t
        },
        ms: function(t, n, e, s, a, r, i) {
            var o, l = n[n.length - 1],
                u = t.call(l);
            return "function" == typeof u ? s ? !0 : (o = this.activeSub && this.subsText && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text, this.ls(u, l, e, o.substring(a, r), i)) : u
        },
        mv: function(t, n, e) {
            var a = n[n.length - 1],
                r = t.call(a);
            return "function" == typeof r ? this.ct(s(r.call(a)), a, e) : r
        },
        sub: function(t, n, e, s) {
            var a = this.subs[t];
            a && (this.activeSub = t, a(n, e, this, s), this.activeSub = !1)
        }
    };
    var r = /&/g,
        i = /</g,
        o = />/g,
        l = /\'/g,
        u = /\"/g,
        c = /[&<>\"\']/,
        p = Array.isArray || function(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }
}("undefined" != typeof exports ? exports : Hogan),
function(t) {
    function n(t) {
        "}" === t.n.substr(t.n.length - 1) && (t.n = t.n.substring(0, t.n.length - 1))
    }

    function e(t) {
        return t.trim ? t.trim() : t.replace(/^\s*|\s*$/g, "")
    }

    function s(t, n, e) {
        if (n.charAt(e) != t.charAt(0)) return !1;
        for (var s = 1, a = t.length; a > s; s++)
            if (n.charAt(e + s) != t.charAt(s)) return !1;
        return !0
    }

    function a(n, e, s, o) {
        var l = [],
            u = null,
            c = null,
            p = null;
        for (c = s[s.length - 1]; n.length > 0;) {
            if (p = n.shift(), c && "<" == c.tag && !(p.tag in k)) throw new Error("Illegal content in < super tag.");
            if (t.tags[p.tag] <= t.tags.$ || r(p, o)) s.push(p), p.nodes = a(n, p.tag, s, o);
            else {
                if ("/" == p.tag) {
                    if (0 === s.length) throw new Error("Closing tag without opener: /" + p.n);
                    if (u = s.pop(), p.n != u.n && !i(p.n, u.n, o)) throw new Error("Nesting error: " + u.n + " vs. " + p.n);
                    return u.end = p.i, l
                }
                "\n" == p.tag && (p.last = 0 == n.length || "\n" == n[0].tag)
            }
            l.push(p)
        }
        if (s.length > 0) throw new Error("missing closing tag: " + s.pop().n);
        return l
    }

    function r(t, n) {
        for (var e = 0, s = n.length; s > e; e++)
            if (n[e].o == t.n) return t.tag = "#", !0
    }

    function i(t, n, e) {
        for (var s = 0, a = e.length; a > s; s++)
            if (e[s].c == t && e[s].o == n) return !0
    }

    function o(t) {
        var n = [];
        for (var e in t) n.push('"' + u(e) + '": function(c,p,t,i) {' + t[e] + "}");
        return "{ " + n.join(",") + " }"
    }

    function l(t) {
        var n = [];
        for (var e in t.partials) n.push('"' + u(e) + '":{name:"' + u(t.partials[e].name) + '", ' + l(t.partials[e]) + "}");
        return "partials: {" + n.join(",") + "}, subs: " + o(t.subs)
    }

    function u(t) {
        return t.replace(m, "\\\\").replace(g, '\\"').replace(d, "\\n").replace(v, "\\r").replace(y, "\\u2028").replace(x, "\\u2029")
    }

    function c(t) {
        return~ t.indexOf(".") ? "d" : "f"
    }

    function p(t, n) {
        var e = "<" + (n.prefix || ""),
            s = e + t.n + w++;
        return n.partials[s] = {
            name: t.n,
            partials: {}
        }, n.code += 't.b(t.rp("' + u(s) + '",c,p,"' + (t.indent || "") + '"));', s
    }

    function b(t, n) {
        n.code += "t.b(t.t(t." + c(t.n) + '("' + u(t.n) + '",c,p,0)));'
    }

    function f(t) {
        return "t.b(" + t + ");"
    }
    var h = /\S/,
        g = /\"/g,
        d = /\n/g,
        v = /\r/g,
        m = /\\/g,
        y = /\u2028/,
        x = /\u2029/;
    t.tags = {
        "#": 1,
        "^": 2,
        "<": 3,
        $: 4,
        "/": 5,
        "!": 6,
        ">": 7,
        "=": 8,
        _v: 9,
        "{": 10,
        "&": 11,
        _t: 12
    }, t.scan = function(a, r) {
        function i() {
            m.length > 0 && (y.push({
                tag: "_t",
                text: new String(m)
            }), m = "")
        }

        function o() {
            for (var n = !0, e = w; e < y.length; e++)
                if (n = t.tags[y[e].tag] < t.tags._v || "_t" == y[e].tag && null === y[e].text.match(h), !n) return !1;
            return n
        }

        function l(t, n) {
            if (i(), t && o())
                for (var e, s = w; s < y.length; s++) y[s].text && ((e = y[s + 1]) && ">" == e.tag && (e.indent = y[s].text.toString()), y.splice(s, 1));
            else n || y.push({
                tag: "\n"
            });
            x = !1, w = y.length
        }

        function u(t, n) {
            var s = "=" + S,
                a = t.indexOf(s, n),
                r = e(t.substring(t.indexOf("=", n) + 1, a)).split(" ");
            return T = r[0], S = r[r.length - 1], a + s.length - 1
        }
        var c = a.length,
            p = 0,
            b = 1,
            f = 2,
            g = p,
            d = null,
            v = null,
            m = "",
            y = [],
            x = !1,
            k = 0,
            w = 0,
            T = "{{",
            S = "}}";
        for (r && (r = r.split(" "), T = r[0], S = r[1]), k = 0; c > k; k++) g == p ? s(T, a, k) ? (--k, i(), g = b) : "\n" == a.charAt(k) ? l(x) : m += a.charAt(k) : g == b ? (k += T.length - 1, v = t.tags[a.charAt(k + 1)], d = v ? a.charAt(k + 1) : "_v", "=" == d ? (k = u(a, k), g = p) : (v && k++, g = f), x = k) : s(S, a, k) ? (y.push({
            tag: d,
            n: e(m),
            otag: T,
            ctag: S,
            i: "/" == d ? x - T.length : k + S.length
        }), m = "", k += S.length - 1, g = p, "{" == d && ("}}" == S ? k++ : n(y[y.length - 1]))) : m += a.charAt(k);
        return l(x, !0), y
    };
    var k = {
        _t: !0,
        "\n": !0,
        $: !0,
        "/": !0
    };
    t.stringify = function(n) {
        return "{code: function (c,p,i) { " + t.wrapMain(n.code) + " }," + l(n) + "}"
    };
    var w = 0;
    t.generate = function(n, e, s) {
        w = 0;
        var a = {
            code: "",
            subs: {},
            partials: {}
        };
        return t.walk(n, a), s.asString ? this.stringify(a, e, s) : this.makeTemplate(a, e, s)
    }, t.wrapMain = function(t) {
        return 'var t=this;t.b(i=i||"");' + t + "return t.fl();"
    }, t.template = t.Template, t.makeTemplate = function(t, n, e) {
        var s = this.makePartials(t);
        return s.code = new Function("c", "p", "i", this.wrapMain(t.code)), new this.template(s, n, this, e)
    }, t.makePartials = function(t) {
        var n, e = {
                subs: {},
                partials: t.partials,
                name: t.name
            };
        for (n in e.partials) e.partials[n] = this.makePartials(e.partials[n]);
        for (n in t.subs) e.subs[n] = new Function("c", "p", "t", "i", t.subs[n]);
        return e
    }, t.codegen = {
        "#": function(n, e) {
            e.code += "if(t.s(t." + c(n.n) + '("' + u(n.n) + '",c,p,1),c,p,0,' + n.i + "," + n.end + ',"' + n.otag + " " + n.ctag + '")){t.rs(c,p,function(c,p,t){', t.walk(n.nodes, e), e.code += "});c.pop();}"
        },
        "^": function(n, e) {
            e.code += "if(!t.s(t." + c(n.n) + '("' + u(n.n) + '",c,p,1),c,p,1,0,0,"")){', t.walk(n.nodes, e), e.code += "};"
        },
        ">": p,
        "<": function(n, e) {
            var s = {
                partials: {},
                code: "",
                subs: {},
                inPartial: !0
            };
            t.walk(n.nodes, s);
            var a = e.partials[p(n, e)];
            a.subs = s.subs, a.partials = s.partials
        },
        $: function(n, e) {
            var s = {
                subs: {},
                code: "",
                partials: e.partials,
                prefix: n.n
            };
            t.walk(n.nodes, s), e.subs[n.n] = s.code, e.inPartial || (e.code += 't.sub("' + u(n.n) + '",c,p,i);')
        },
        "\n": function(t, n) {
            n.code += f('"\\n"' + (t.last ? "" : " + i"))
        },
        _v: function(t, n) {
            n.code += "t.b(t.v(t." + c(t.n) + '("' + u(t.n) + '",c,p,0)));'
        },
        _t: function(t, n) {
            n.code += f('"' + u(t.text) + '"')
        },
        "{": b,
        "&": b
    }, t.walk = function(n, e) {
        for (var s, a = 0, r = n.length; r > a; a++) s = t.codegen[n[a].tag], s && s(n[a], e);
        return e
    }, t.parse = function(t, n, e) {
        return e = e || {}, a(t, "", [], e.sectionTags || [])
    }, t.cache = {}, t.cacheKey = function(t, n) {
        return [t, !! n.asString, !! n.disableLambda, n.delimiters, !! n.modelGet].join("||")
    }, t.compile = function(n, e) {
        e = e || {};
        var s = t.cacheKey(n, e),
            a = this.cache[s];
        if (a) {
            var r = a.partials;
            for (var i in r) delete r[i].instance;
            return a
        }
        return a = this.generate(this.parse(this.scan(n, e.delimiters), n, e), n, e), this.cache[s] = a
    }
}("undefined" != typeof exports ? exports : Hogan);
var Mustache = function(t) {
    function n(n, e, s, a) {
        var r = this.f(n, e, s, 0),
            i = e;
        return r && (i = i.concat(r)), t.Template.prototype.rp.call(this, n, i, s, a)
    }
    var e = function(e, s, a) {
        this.rp = n, t.Template.call(this, e, s, a)
    };
    e.prototype = t.Template.prototype;
    var s, a = function() {
            this.cache = {}, this.generate = function(t, n) {
                return new e(new Function("c", "p", "i", t), n, s)
            }
        };
    return a.prototype = t, s = new a, {
        to_html: function(t, n, e, a) {
            var r = s.compile(t),
                i = r.render(n, e);
            return a ? (a(i), void 0) : i
        }
    }
}(Hogan),
    templates = {};
templates.controls = new Hogan.Template({
    code: function(t, n, e) {
        var s = this;
        return s.b(e = e || ""), s.b('<div class="player-controls">'), s.b("\n" + e), s.b('    <div class="player-progress">'), s.b("\n" + e), s.b('        <label for="seek{id}" class="sr-only">Seek</label>'), s.b("\n" + e), s.b('        <input id="seek{id}" class="player-progress-seek" type="range" min="0" max="100" step="0.5" value="0" data-player="seek">'), s.b("\n" + e), s.b('        <progress class="player-progress-played" max="100" value="0">'), s.b("\n" + e), s.b("            <span>0</span>% played"), s.b("\n" + e), s.b("        </progress>"), s.b("\n" + e), s.b('        <progress class="player-progress-buffer" max="100" value="0">'), s.b("\n" + e), s.b("            <span>0</span>% buffered"), s.b("\n" + e), s.b("        </progress>"), s.b("\n" + e), s.b("    </div>"), s.b("\n" + e), s.b('    <span class="player-controls-left">'), s.b("\n" + e), s.b('        <button type="button" data-player="restart">'), s.b("\n" + e), s.b('            <svg><use xlink:href="#icon-restart"></use></svg>'), s.b("\n" + e), s.b('            <span class="sr-only">Restart</span>'), s.b("\n" + e), s.b("        </button>"), s.b("\n" + e), s.b('        <button type="button" data-player="rewind">'), s.b("\n" + e), s.b('            <svg><use xlink:href="#icon-rewind"></use></svg>'), s.b("\n" + e), s.b('            <span class="sr-only">Rewind {seektime} secs</span>'), s.b("\n" + e), s.b("        </button>"), s.b("\n" + e), s.b('        <button type="button" data-player="play">'), s.b("\n" + e), s.b('            <svg><use xlink:href="#icon-play"></use></svg>'), s.b("\n" + e), s.b('            <span class="sr-only">Play</span>'), s.b("\n" + e), s.b("        </button>"), s.b("\n" + e), s.b('        <button type="button" data-player="pause">'), s.b("\n" + e), s.b('            <svg><use xlink:href="#icon-pause"></use></svg>'), s.b("\n" + e), s.b('            <span class="sr-only">Pause</span>'), s.b("\n" + e), s.b("        </button>"), s.b("\n" + e), s.b('        <button type="button" data-player="fast-forward">'), s.b("\n" + e), s.b('            <svg><use xlink:href="#icon-fast-forward"></use></svg>'), s.b("\n" + e), s.b('            <span class="sr-only">Forward {seektime} secs</span>'), s.b("\n" + e), s.b("        </button>"), s.b("\n" + e), s.b('        <span class="player-time">'), s.b("\n" + e), s.b('            <span class="sr-only">Current time</span>'), s.b("\n" + e), s.b('            <span class="player-current-time">00:00</span>'), s.b("\n" + e), s.b("        </span>"), s.b("\n" + e), s.b('        <span class="player-time">'), s.b("\n" + e), s.b('            <span class="sr-only">Duration</span>'), s.b("\n" + e), s.b('            <span class="player-duration">00:00</span>'), s.b("\n" + e), s.b("        </span>"), s.b("\n" + e), s.b("    </span>"), s.b("\n" + e), s.b('    <span class="player-controls-right">'), s.b("\n" + e), s.b('        <input class="inverted sr-only" id="mute{id}" type="checkbox" data-player="mute">'), s.b("\n" + e), s.b('        <label id="mute{id}" for="mute{id}">'), s.b("\n" + e), s.b('            <svg class="icon-muted"><use xlink:href="#icon-muted"></use></svg>'), s.b("\n" + e), s.b('            <svg><use xlink:href="#icon-volume"></use></svg>'), s.b("\n" + e), s.b('            <span class="sr-only">Toggle Mute</span>'), s.b("\n" + e), s.b("        </label>"), s.b("\n"), s.b("\n" + e), s.b('        <label for="volume{id}" class="sr-only">Volume</label>'), s.b("\n" + e), s.b('        <input id="volume{id}" class="player-volume" type="range" min="0" max="10" step="0.5" value="0" data-player="volume">'), s.b("\n"), s.b("\n" + e), s.b('        <input class="sr-only" id="captions{id}" type="checkbox" data-player="captions">'), s.b("\n" + e), s.b('        <label for="captions{id}">'), s.b("\n" + e), s.b('            <svg class="icon-captions-on"><use xlink:href="#icon-captions-on"></use></svg>'), s.b("\n" + e), s.b('            <svg><use xlink:href="#icon-captions-off"></use></svg>'), s.b("\n" + e), s.b('            <span class="sr-only">Toggle Captions</span>'), s.b("\n" + e), s.b("        </label>"), s.b("\n"), s.b("\n" + e), s.b('        <button type="button" data-player="fullscreen">'), s.b("\n" + e), s.b('            <svg class="icon-exit-fullscreen"><use xlink:href="#icon-exit-fullscreen"></use></svg>'), s.b("\n" + e), s.b('            <svg><use xlink:href="#icon-enter-fullscreen"></use></svg>'), s.b("\n" + e), s.b('            <span class="sr-only">Toggle Fullscreen</span>'), s.b("\n" + e), s.b("        </button>"), s.b("\n" + e), s.b("    </span>"), s.b("\n" + e), s.b("</div>"), s.fl()
    },
    partials: {},
    subs: {}
});
plyr.setup({
    volume: 10,
    seekTime: 3,
    html: templates.controls.render({}),
    captions: {
        defaultActive: !0
    },
    onSetup: function() {
        var t = this,
            n = t.media.tagName.toLowerCase(),
            e = document.querySelector("[data-toggle='fullscreen']");
    }
});
(function(d,p){
    var a=new XMLHttpRequest(),
        b=d.body;
    a.open("GET",p,!0);
    a.send();
    a.onload=function(){
        var c=d.createElement("div");
        c.style.display="none";
        c.innerHTML=a.responseText;
        b.insertBefore(c,b.childNodes[0])
    }
})(document, "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3ltYm9sIGlkPSJpY29uLWNhcHRpb25zLW9mZiIgdmlld0JveD0iMCAwIDE4IDE4Ij48dGl0bGU+aWNvbi1jYXB0aW9ucy1vZmY8L3RpdGxlPjxnPjxwYXRoIGQ9Ik0xIDJjLS41NTIgMC0xIC40NDgtMSAxdjEyYzAgLjU1Mi40NDggMSAxIDFoMTZjLjU1MiAwIDEtLjQ0OCAxLTFWM2MwLS41NTItLjQ0OC0xLTEtMUgxem0xIDEyVjRoMTR2MTBIMnoiLz48L2c+PC9zeW1ib2w+PHN5bWJvbCBpZD0iaWNvbi1jYXB0aW9ucy1vbiIgdmlld0JveD0iMCAwIDE4IDE4Ij48dGl0bGU+aWNvbi1jYXB0aW9ucy1vbjwvdGl0bGU+PGc+PHBhdGggZD0iTTEgMmMtLjU1MiAwLTEgLjQ0OC0xIDF2MTJjMCAuNTUyLjQ0OCAxIDEgMWgxNmMuNTUyIDAgMS0uNDQ4IDEtMVYzYzAtLjU1Mi0uNDQ4LTEtMS0xSDF6bTEgMTJWNGgxNHYxMEgyeiIvPjxwYXRoIGQ9Ik0zIDExaDN2MkgzeiIvPjxwYXRoIGQ9Ik0xMiAxMWgzdjJoLTN6Ii8+PHBhdGggZD0iTTcgMTFoNHYySDd6Ii8+PC9nPjwvc3ltYm9sPjxzeW1ib2wgaWQ9Imljb24tZW50ZXItZnVsbHNjcmVlbiIgdmlld0JveD0iMCAwIDE4IDE4Ij48dGl0bGU+ZXhwYW5kPC90aXRsZT48Zz48Zz48cGF0aCBkPSJNNi40MjQgMTAuMTY1bC0yLjU3IDIuNTY4LjAxOC0xLjg0NWMtLjAwMy0uNTUyLS40NS0xLTEuMDAyLTEuMDAyLS41NS0uMDAzLS45OTQuNDQyLS45OTIuOTkybC0uMDIzIDQuMjJjLjAwMi4yNjMuMTA3LjUxNy4yOTYuNzA2bC4wMjUuMDIzYy4wMS4wMDcuMDE2LjAxNy4wMjQuMDI1LjE4Ny4xODguNDQuMjk0LjcwNi4yOTVsNC4yMTgtLjAyM2MuNTUuMDAyLjk5NS0uNDQyLjk5Mi0uOTkyLS4wMDItLjU1LS40NS0xLTEtMS4wMDJsLTEuODQ3LjAxNiAyLjU2Ny0yLjU2OGMuMzg3LS4zODcuMzg3LTEuMDEzIDAtMS40bC0uMDEzLS4wMTNjLS4zODYtLjM4Ni0xLjAxMy0uMzg2LTEuNCAweiIvPjxwYXRoIGQ9Ik0xNC4xNTQgNS4yNjZsLS4wMTcgMS44NDZjLjAwMy41NS40NSAxIDEuMDAyIDEgLjU1LjAwNC45OTQtLjQ0Ljk5LS45OWwuMDI0LTQuMjJjMC0uMjY0LS4xMDYtLjUxNy0uMjk1LS43MDZsLS4wMjYtLjAyNC0uMDIzLS4wMjRjLS4xODctLjE4OC0uNDQyLS4yOTQtLjcwNi0uMjk2bC00LjIyLjAyM2MtLjU1LS4wMDItLjk5NC40NDItLjk5Ljk5Mi4wMDIuNTUuNDUgMSAxIDEuMDAybDEuODQ3LS4wMTctMi41NjggMi41N2MtLjM4Ni4zODUtLjM4NiAxLjAxMiAwIDEuMzk4LjQuNCAxLjAyNi40IDEuNDEzLjAxNGwyLjU3LTIuNTY4eiIvPjwvZz48L2c+PC9zeW1ib2w+PHN5bWJvbCBpZD0iaWNvbi1leGl0LWZ1bGxzY3JlZW4iIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHRpdGxlPmNvbGxhcHNlPC90aXRsZT48Zz48Zz48cGF0aCBkPSJNMTQuNDI0IDIuMTY1bC0yLjU3IDIuNTY4LjAxOC0xLjg0NWMtLjAwMy0uNTUyLS40NS0xLTEuMDAyLTEuMDAyLS41NS0uMDAzLS45OTQuNDQyLS45OTIuOTkybC0uMDIzIDQuMjJjLjAwMi4yNjMuMTA3LjUxNy4yOTYuNzA2bC4wMjUuMDIzYy4wMS4wMDcuMDE2LjAxNy4wMjQuMDI1LjE4Ny4xODguNDQuMjk0LjcwNi4yOTVsNC4yMTgtLjAyM2MuNTUuMDAyLjk5NS0uNDQyLjk5Mi0uOTkyLS4wMDItLjU1LS40NS0xLTEtMS4wMDJsLTEuODQ3LjAxNiAyLjU2Ny0yLjU2OGMuMzg3LS4zODcuMzg3LTEuMDEzIDAtMS40bC0uMDEzLS4wMTNjLS4zODYtLjM4Ni0xLjAxMy0uMzg2LTEuNCAweiIvPjxwYXRoIGQ9Ik02LjE1NCAxMy4yNjZsLS4wMTcgMS44NDZjLjAwMy41NS40NSAxIDEuMDAyIDEgLjU1LjAwNC45OTQtLjQ0Ljk5LS45OWwuMDI0LTQuMjJjMC0uMjY0LS4xMDYtLjUxNy0uMjk1LS43MDZsLS4wMjYtLjAyNC0uMDIzLS4wMjRjLS4xODctLjE4OC0uNDQyLS4yOTQtLjcwNi0uMjk2bC00LjIyLjAyM2MtLjU1LS4wMDItLjk5NC40NDItLjk5Ljk5Mi4wMDIuNTUuNDUgMSAxIDEuMDAybDEuODQ3LS4wMTctMi41NjggMi41N2MtLjM4Ni4zODUtLjM4NiAxLjAxMiAwIDEuMzk4LjQuNCAxLjAyNi40IDEuNDEzLjAxNGwyLjU3LTIuNTY4eiIvPjwvZz48L2c+PC9zeW1ib2w+PHN5bWJvbCBpZD0iaWNvbi1mYXN0LWZvcndhcmQiIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHBhdGggZD0iTTE3LjU3IDguMjQ2TDcgMmMtLjU1MiAwLTEgLjQ0OC0xIDF2MS45NTRMMSAyYy0uNTUyIDAtMSAuNDQ4LTEgMXYxMmMwIC41NTIuNDQ4IDEgMSAxbDUtMi45NTVWMTVjMCAuNTUyLjQ0OCAxIDEgMWwxMC41Ny02LjI0NmMuMjY2LS4xNTguNDMtLjQ0NC40My0uNzU0cy0uMTY0LS41OTctLjQzLS43NTR6TTYgMTAuNzIybC00IDIuMzY0VjQuOTE0bDQgMi4zNjR2My40NDR6bTIgMi4zNjRWNC45MTRMMTQuOTE1IDkgOCAxMy4wODZ6Ii8+PC9zeW1ib2w+PHN5bWJvbCBpZD0iaWNvbi1tdXRlZCIgdmlld0JveD0iMCAwIDE4IDE4Ij48dGl0bGU+bXV0ZWQ8L3RpdGxlPjxnPjxnPjxwYXRoIGQ9Ik05LjIxNCAyYy0uMTEgMC0uMjI1LjAzMi0uMzM0LjFMNC44MzIgNC45MUM0Ljc1IDQuOTcgNC42NSA1IDQuNTUgNUguOTk1Qy40NDYgNSAwIDUuNDQ4IDAgNnY2YzAgLjU1Mi40NDYgMSAuOTk2IDFINC41NWMuMSAwIC4yLjAzLjI4Mi4wOUw4Ljg4IDE1LjljLjExLjA2OC4yMjMuMS4zMzQuMS4zOTIgMCAuNzQ3LS40Ljc0Ny0uOTVWMi45NWMwLS41NS0uMzU0LS45NS0uNzQ2LS45NXpNNy45NyAxMi44MzRMNS41OCAxMS4xNzdjLS4xNjYtLjExNS0uMzY0LS4xNzgtLjU2Ni0uMTc4SDIuNDljLS4yNzQgMC0uNDk3LS4yMjUtLjQ5Ny0uNXYtM2MwLS4yNzcuMjIzLS41LjQ5OC0uNWgyLjUyNmMuMjAyIDAgLjQtLjA2My41NjYtLjE4TDcuOTcgNS4xNjV2Ny42N3pNMTQuOTM0IDguOGMtLjA4Ni0xLjc1LTEuNTE0LTIuOTkyLTIuNTA3LTMuNjUtLjQ3LS4zMTItMS4wOTQtLjEyMi0xLjMyNS40MDhsLS4wMzguMDg2Yy0uMTg4LjQzLS4wNDUuOTQuMzM2IDEuMTk0LjcwNi40NzMgMS41ODYgMS4yNDcgMS42MjQgMi4wNjUuMDMyLjY3Ni0uNTUzIDEuNDY4LTEuNjYzIDIuMjctLjM5Ny4yODgtLjUyOC44NC0uMjg0IDEuMjc1bC4wNDIuMDc1Yy4yNjYuNDc1Ljg2Ni42MjQgMS4zLjMxMiAxLjc0LTEuMjUgMi41ODYtMi42MDYgMi41MTYtNC4wMzd6Ii8+PHBhdGggZD0iTTEzLjk1NiA5LjJjLjA4NiAxLjc0NyAxLjUxNCAyLjk5IDIuNTA3IDMuNjQ4LjQ3LjMxMiAxLjA5NC4xMjIgMS4zMjUtLjQwOGwuMDM4LS4wODZjLjE4OC0uNDMuMDQ1LS45NC0uMzM2LTEuMTk0LS43MDYtLjQ3My0xLjU4Ni0xLjI0Ny0xLjYyNC0yLjA2NS0uMDMyLS42NzYuNTUzLTEuNDY4IDEuNjYzLTIuMjcuMzk3LS4yODguNTI4LS44NC4yODQtMS4yNzVsLS4wNDItLjA3NWMtLjI2Ni0uNDc1LS44NjYtLjYyNC0xLjMtLjMxMi0xLjc0IDEuMjUtMi41ODYgMi42MDYtMi41MTYgNC4wMzd6Ii8+PC9nPjwvZz48L3N5bWJvbD48c3ltYm9sIGlkPSJpY29uLXBhdXNlIiB2aWV3Qm94PSIwIDAgMTggMTgiPjx0aXRsZT5wYXVzZTwvdGl0bGU+PGc+PGc+PHBhdGggZD0iTTIgNHYxMGMwIDIgMiAyIDIgMmgyczIgMCAyLTJWNGMwLTItMi0yLTItMkg0UzIgMiAyIDR6bTIgMGgydjEwSDRWNHoiLz48cGF0aCBkPSJNMTAgNHYxMGMwIDIgMiAyIDIgMmgyczIgMCAyLTJWNGMwLTItMi0yLTItMmgtMnMtMiAwLTIgMnptMiAwaDJ2MTBoLTJWNHoiLz48L2c+PC9nPjwvc3ltYm9sPjxzeW1ib2wgaWQ9Imljb24tcGxheSIgdmlld0JveD0iMCAwIDE4IDE4Ij48cGF0aCBkPSJNNSA0LjkxNEwxMS45MTUgOSA1IDEzLjA4NlY0LjkxNHpNNCAyYy0uNTUyIDAtMSAuNDQ4LTEgMXYxMmMwIC41NTIuNDQ4IDEgMSAxbDEwLjU3LTYuMjQ2Yy4yNjYtLjE1OC40My0uNDQ0LjQzLS43NTRzLS4xNjQtLjU5Ny0uNDMtLjc1NEw0IDJ6Ii8+PC9zeW1ib2w+PHN5bWJvbCBpZD0iaWNvbi1yZXN0YXJ0IiB2aWV3Qm94PSIwIDAgMTggMTgiPjx0aXRsZT5pY29uLXJlc3RhcnQ8L3RpdGxlPjxnPjxwYXRoIGQ9Ik0xIDJjLjU1MiAwIDEgLjQ0OCAxIDF2NC4zMThMMTEgMmMuNTUyIDAgMSAuNDQ4IDEgMXYxLjk1NEwxNyAyYy41NTIgMCAxIC40NDggMSAxdjEyYzAgLjU1Mi0uNDQ4IDEtMSAxbC01LTIuOTU1VjE1YzAgLjU1Mi0uNDQ4IDEtMSAxbC05LTUuMzE4VjE1YzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xVjNjMC0uNTUyLjQ0OC0xIDEtMXptMTEgOC43MjJsNCAyLjM2NFY0LjkxNGwtNCAyLjM2NHYzLjQ0NHptLTIgMi4zNjRWNC45MTRMMy4wODUgOSAxMCAxMy4wODZ6Ii8+PC9nPjwvc3ltYm9sPjxzeW1ib2wgaWQ9Imljb24tcmV3aW5kIiB2aWV3Qm94PSIwIDAgMTggMjEiPjx0aXRsZT5yZXdpbmQ8L3RpdGxlPjxnPjxwYXRoIGQ9Ik0uNDMgMTAuNzU0TDExIDE3Yy41NTIgMCAxLS40NDggMS0xdi0xLjk1NEwxNyAxN2MuNTUyIDAgMS0uNDQ4IDEtMVY0YzAtLjU1Mi0uNDQ4LTEtMS0xbC01IDIuOTU1VjRjMC0uNTUyLS40NDgtMS0xLTFMLjQzIDkuMjQ2Qy4xNjUgOS40MDQgMCA5LjY5IDAgMTBzLjE2NC41OTcuNDMuNzU0ek0xMiA4LjI3OGw0LTIuMzY0djguMTcybC00LTIuMzY0VjguMjc4em0tMi0yLjM2NHY4LjE3MkwzLjA4NSAxMCAxMCA1LjkxNHoiLz48L2c+PC9zeW1ib2w+PHN5bWJvbCBpZD0iaWNvbi12b2x1bWUiIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHBhdGggZD0iTTEwLjIxNCAyYy0uMTEgMC0uMjI1LjAzMi0uMzM0LjFMNS44MzIgNC45MUM1Ljc1IDQuOTcgNS42NSA1IDUuNTUgNUgxLjk5NUMxLjQ0NiA1IDEgNS40NDggMSA2djZjMCAuNTUyLjQ0NiAxIC45OTYgMUg1LjU1Yy4xIDAgLjIuMDMuMjgyLjA5TDkuODggMTUuOWMuMTEuMDY4LjIyMy4xLjMzNC4xLjM5MiAwIC43NDctLjQuNzQ3LS45NVYyLjk1YzAtLjU1LS4zNTQtLjk1LS43NDYtLjk1ek04Ljk3IDEyLjgzNEw2LjU4IDExLjE3N2MtLjE2Ni0uMTE1LS4zNjQtLjE3OC0uNTY2LS4xNzhIMy40OWMtLjI3NCAwLS40OTctLjIyNS0uNDk3LS41di0zYzAtLjI3Ny4yMjMtLjUuNDk4LS41aDIuNTI2Yy4yMDIgMCAuNC0uMDYzLjU2Ni0uMThMOC45NyA1LjE2NXY3LjY3ek0xNi45MzQgOC44Yy0uMDg2LTEuNzUtMS41MTQtMi45OTItMi41MDctMy42NS0uNDctLjMxMi0xLjA5NC0uMTIyLTEuMzI1LjQwOGwtLjAzOC4wODZjLS4xODguNDMtLjA0NS45NC4zMzYgMS4xOTQuNzA2LjQ3MyAxLjU4NiAxLjI0NyAxLjYyNCAyLjA2NS4wMzIuNjc2LS41NTMgMS40NjgtMS42NjMgMi4yNy0uMzk3LjI4OC0uNTI4Ljg0LS4yODQgMS4yNzVsLjA0Mi4wNzVjLjI2Ni40NzUuODY2LjYyNCAxLjMuMzEyIDEuNzQtMS4yNSAyLjU4Ni0yLjYwNiAyLjUxNi00LjAzN3oiLz48L3N5bWJvbD48L3N2Zz4=");
$(document).ready(function() {
    function defaultStatus() {
        $("button[name=status]").text("Please select video and/or subtitle");
    }
    defaultStatus();
    $("input[name=source]").change(function() {
        if ($(".player")[0].plyr.support(this.files[0].type)) {
            $("button[name=status]").text("Loading... This might take a few seconds");
            var reader = new FileReader();
            reader.onload = function(event) {
                $(".player")[0].plyr.source(event.target.result);
            }
            reader.readAsDataURL(this.files[0]);
        } else {
            $("button[name=status]").text("I don't support this format.. Sorry!").delay(300).defaultStatus();
        }
    });
    /*$("input[name=track]").change(function() {
        var reader = new FileReader();
        reader.onload = function(event) {
            //convert to vtt from any format
            //$(".player")[0].plyr.source(event.target.result);
        }
        reader.readAsDataURL(this.files[0]);
        $("button[name=status]").text("Subtitle is ready!");
    });*/
    $(".player")[0].plyr.media.addEventListener("loadstart", function() {
        $("button[name=status]").text("Video is ready!");
    });
});