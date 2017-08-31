define("echarts/chart/venn", ["require", "./base", "zrender/shape/Text", "zrender/shape/Circle", "zrender/shape/Path", "../config", "../util/ecData", "zrender/tool/util", "../chart"], function (e) {
    function t(e, t, n, a, o) {
        i.call(this, e, t, n, a, o), this.refresh(a)
    }

    var i = e("./base"), n = e("zrender/shape/Text"), a = e("zrender/shape/Circle"), o = e("zrender/shape/Path"),
        r = e("../config");
    r.venn = {zlevel: 0, z: 1, calculable: !1};
    var s = e("../util/ecData"), l = e("zrender/tool/util");
    return t.prototype = {
        type: r.CHART_TYPE_VENN, _buildShape: function () {
            this.selectedMap = {}, this._symbol = this.option.symbolList, this._queryTarget, this._dropBoxList = [], this._vennDataCounter = 0;
            for (var e = this.series, t = this.component.legend, i = 0; i < e.length; i++) if (e[i].type === r.CHART_TYPE_VENN) {
                e[i] = this.reformOption(e[i]);
                var n = e[i].name || "";
                if (this.selectedMap[n] = t ? t.isSelected(n) : !0, !this.selectedMap[n]) continue;
                this._buildVenn(i)
            }
            this.addShapeList()
        }, _buildVenn: function (e) {
            var t, i, n = this.series[e], a = n.data;
            a[0].value > a[1].value ? (t = this.zr.getHeight() / 3, i = t * Math.sqrt(a[1].value) / Math.sqrt(a[0].value)) : (i = this.zr.getHeight() / 3, t = i * Math.sqrt(a[0].value) / Math.sqrt(a[1].value));
            var o = this.zr.getWidth() / 2 - t,
                r = (t + i) / 2 * Math.sqrt(a[2].value) / Math.sqrt((a[0].value + a[1].value) / 2), s = t + i;
            0 !== a[2].value && (s = this._getCoincideLength(a[0].value, a[1].value, a[2].value, t, i, r, Math.abs(t - i), t + i));
            var l = o + s, h = this.zr.getHeight() / 2;
            if (this._buildItem(e, 0, a[0], o, h, t), this._buildItem(e, 1, a[1], l, h, i), 0 !== a[2].value && a[2].value !== a[0].value && a[2].value !== a[1].value) {
                var m = (t * t - i * i) / (2 * s) + s / 2, V = s / 2 - (t * t - i * i) / (2 * s),
                    U = Math.sqrt(t * t - m * m), d = 0, p = 0;
                a[0].value > a[1].value && o + m > l && (p = 1), a[0].value < a[1].value && o + V > l && (d = 1), this._buildCoincideItem(e, 2, a[2], o + m, h - U, h + U, t, i, d, p)
            }
        }, _getCoincideLength: function (e, t, i, n, a, o, r, s) {
            var l = (n * n - a * a) / (2 * o) + o / 2, h = o / 2 - (n * n - a * a) / (2 * o), m = Math.acos(l / n),
                V = Math.acos(h / a), U = n * n * Math.PI,
                d = m * n * n - l * n * Math.sin(m) + V * a * a - h * a * Math.sin(V), p = d / U, c = i / e,
                u = Math.abs(p / c);
            return u > .999 && 1.001 > u ? o : .999 >= u ? (s = o, o = (o + r) / 2, this._getCoincideLength(e, t, i, n, a, o, r, s)) : (r = o, o = (o + s) / 2, this._getCoincideLength(e, t, i, n, a, o, r, s))
        }, _buildItem: function (e, t, i, n, a, o) {
            var r = this.series, l = r[e], h = this.getCircle(e, t, i, n, a, o);
            if (s.pack(h, l, e, i, t, i.name), this.shapeList.push(h), l.itemStyle.normal.label.show) {
                var m = this.getLabel(e, t, i, n, a, o);
                s.pack(m, l, e, l.data[t], t, l.data[t].name), this.shapeList.push(m)
            }
        }, _buildCoincideItem: function (e, t, i, n, a, r, l, h, m, V) {
            var U = this.series, d = U[e], p = [i, d], c = this.deepMerge(p, "itemStyle.normal") || {},
                u = this.deepMerge(p, "itemStyle.emphasis") || {}, y = c.color || this.zr.getColor(t),
                g = u.color || this.zr.getColor(t),
                b = "M" + n + "," + a + "A" + l + "," + l + ",0," + m + ",1," + n + "," + r + "A" + h + "," + h + ",0," + V + ",1," + n + "," + a,
                f = {color: y, path: b}, k = {
                    zlevel: d.zlevel,
                    z: d.z,
                    style: f,
                    highlightStyle: {color: g, lineWidth: u.borderWidth, strokeColor: u.borderColor}
                };
            k = new o(k), k.buildPathArray && (k.style.pathArray = k.buildPathArray(f.path)), s.pack(k, U[e], 0, i, t, i.name), this.shapeList.push(k)
        }, getCircle: function (e, t, i, n, o, r) {
            var s = this.series[e], l = [i, s], h = this.deepMerge(l, "itemStyle.normal") || {},
                m = this.deepMerge(l, "itemStyle.emphasis") || {}, V = h.color || this.zr.getColor(t),
                U = m.color || this.zr.getColor(t), d = {
                    zlevel: s.zlevel,
                    z: s.z,
                    clickable: !0,
                    style: {x: n, y: o, r: r, brushType: "fill", opacity: 1, color: V},
                    highlightStyle: {color: U, lineWidth: m.borderWidth, strokeColor: m.borderColor}
                };
            return this.deepQuery([i, s, this.option], "calculable") && (this.setCalculable(d), d.draggable = !0), new a(d)
        }, getLabel: function (e, t, i, a, o, r) {
            var s = this.series[e], l = s.itemStyle, h = [i, s], m = this.deepMerge(h, "itemStyle.normal") || {},
                V = "normal", U = l[V].label, d = U.textStyle || {}, p = this.getLabelText(t, i, V),
                c = this.getFont(d), u = m.color || this.zr.getColor(t), y = d.fontSize || 12, g = {
                    zlevel: s.zlevel,
                    z: s.z,
                    style: {x: a, y: o - r - y, color: d.color || u, text: p, textFont: c, textAlign: "center"}
                };
            return new n(g)
        }, getLabelText: function (e, t, i) {
            var n = this.series, a = n[0], o = this.deepQuery([t, a], "itemStyle." + i + ".label.formatter");
            return o ? "function" == typeof o ? o(a.name, t.name, t.value) : "string" == typeof o ? (o = o.replace("{a}", "{a0}").replace("{b}", "{b0}").replace("{c}", "{c0}"), o = o.replace("{a0}", a.name).replace("{b0}", t.name).replace("{c0}", t.value)) : void 0 : t.name
        }, refresh: function (e) {
            e && (this.option = e, this.series = e.series), this._buildShape()
        }
    }, l.inherits(t, i), e("../chart").define("venn", t), t
}), define("zrender/shape/Path", ["require", "./Base", "./util/PathProxy", "../tool/util"], function (e) {
    var t = e("./Base"), i = e("./util/PathProxy"), n = i.PathSegment, a = function (e) {
        return Math.sqrt(e[0] * e[0] + e[1] * e[1])
    }, o = function (e, t) {
        return (e[0] * t[0] + e[1] * t[1]) / (a(e) * a(t))
    }, r = function (e, t) {
        return (e[0] * t[1] < e[1] * t[0] ? -1 : 1) * Math.acos(o(e, t))
    }, s = function (e) {
        t.call(this, e)
    };
    return s.prototype = {
        type: "path", buildPathArray: function (e, t, i) {
            if (!e) return [];
            t = t || 0, i = i || 0;
            var a = e,
                o = ["m", "M", "l", "L", "v", "V", "h", "H", "z", "Z", "c", "C", "q", "Q", "t", "T", "s", "S", "a", "A"];
            a = a.replace(/-/g, " -"), a = a.replace(/  /g, " "), a = a.replace(/ /g, ","), a = a.replace(/,,/g, ",");
            var r;
            for (r = 0; r < o.length; r++) a = a.replace(new RegExp(o[r], "g"), "|" + o[r]);
            var s = a.split("|"), l = [], h = 0, m = 0;
            for (r = 1; r < s.length; r++) {
                var V = s[r], U = V.charAt(0);
                V = V.slice(1), V = V.replace(new RegExp("e,-", "g"), "e-");
                var d = V.split(",");
                d.length > 0 && "" === d[0] && d.shift();
                for (var p = 0; p < d.length; p++) d[p] = parseFloat(d[p]);
                for (; d.length > 0 && !isNaN(d[0]);) {
                    var c, u, y, g, b, f, k, _, x = null, L = [], W = h, X = m;
                    switch (U) {
                        case"l":
                            h += d.shift(), m += d.shift(), x = "L", L.push(h, m);
                            break;
                        case"L":
                            h = d.shift(), m = d.shift(), L.push(h, m);
                            break;
                        case"m":
                            h += d.shift(), m += d.shift(), x = "M", L.push(h, m), U = "l";
                            break;
                        case"M":
                            h = d.shift(), m = d.shift(), x = "M", L.push(h, m), U = "L";
                            break;
                        case"h":
                            h += d.shift(), x = "L", L.push(h, m);
                            break;
                        case"H":
                            h = d.shift(), x = "L", L.push(h, m);
                            break;
                        case"v":
                            m += d.shift(), x = "L", L.push(h, m);
                            break;
                        case"V":
                            m = d.shift(), x = "L", L.push(h, m);
                            break;
                        case"C":
                            L.push(d.shift(), d.shift(), d.shift(), d.shift()), h = d.shift(), m = d.shift(), L.push(h, m);
                            break;
                        case"c":
                            L.push(h + d.shift(), m + d.shift(), h + d.shift(), m + d.shift()), h += d.shift(), m += d.shift(), x = "C", L.push(h, m);
                            break;
                        case"S":
                            c = h, u = m, y = l[l.length - 1], "C" === y.command && (c = h + (h - y.points[2]), u = m + (m - y.points[3])), L.push(c, u, d.shift(), d.shift()), h = d.shift(), m = d.shift(), x = "C", L.push(h, m);
                            break;
                        case"s":
                            c = h, u = m, y = l[l.length - 1], "C" === y.command && (c = h + (h - y.points[2]), u = m + (m - y.points[3])), L.push(c, u, h + d.shift(), m + d.shift()), h += d.shift(), m += d.shift(), x = "C", L.push(h, m);
                            break;
                        case"Q":
                            L.push(d.shift(), d.shift()), h = d.shift(), m = d.shift(), L.push(h, m);
                            break;
                        case"q":
                            L.push(h + d.shift(), m + d.shift()), h += d.shift(), m += d.shift(), x = "Q", L.push(h, m);
                            break;
                        case"T":
                            c = h, u = m, y = l[l.length - 1], "Q" === y.command && (c = h + (h - y.points[0]), u = m + (m - y.points[1])), h = d.shift(), m = d.shift(), x = "Q", L.push(c, u, h, m);
                            break;
                        case"t":
                            c = h, u = m, y = l[l.length - 1], "Q" === y.command && (c = h + (h - y.points[0]), u = m + (m - y.points[1])), h += d.shift(), m += d.shift(), x = "Q", L.push(c, u, h, m);
                            break;
                        case"A":
                            g = d.shift(), b = d.shift(), f = d.shift(), k = d.shift(), _ = d.shift(), W = h, X = m, h = d.shift(), m = d.shift(), x = "A", L = this._convertPoint(W, X, h, m, k, _, g, b, f);
                            break;
                        case"a":
                            g = d.shift(), b = d.shift(), f = d.shift(), k = d.shift(), _ = d.shift(), W = h, X = m, h += d.shift(), m += d.shift(), x = "A", L = this._convertPoint(W, X, h, m, k, _, g, b, f)
                    }
                    for (var v = 0, K = L.length; K > v; v += 2) L[v] += t, L[v + 1] += i;
                    l.push(new n(x || U, L))
                }
                ("z" === U || "Z" === U) && l.push(new n("z", []))
            }
            return l
        }, _convertPoint: function (e, t, i, n, a, s, l, h, m) {
            var V = m * (Math.PI / 180), U = Math.cos(V) * (e - i) / 2 + Math.sin(V) * (t - n) / 2,
                d = -1 * Math.sin(V) * (e - i) / 2 + Math.cos(V) * (t - n) / 2, p = U * U / (l * l) + d * d / (h * h);
            p > 1 && (l *= Math.sqrt(p), h *= Math.sqrt(p));
            var c = Math.sqrt((l * l * h * h - l * l * d * d - h * h * U * U) / (l * l * d * d + h * h * U * U));
            a === s && (c *= -1), isNaN(c) && (c = 0);
            var u = c * l * d / h, y = c * -h * U / l, g = (e + i) / 2 + Math.cos(V) * u - Math.sin(V) * y,
                b = (t + n) / 2 + Math.sin(V) * u + Math.cos(V) * y, f = r([1, 0], [(U - u) / l, (d - y) / h]),
                k = [(U - u) / l, (d - y) / h], _ = [(-1 * U - u) / l, (-1 * d - y) / h], x = r(k, _);
            return o(k, _) <= -1 && (x = Math.PI), o(k, _) >= 1 && (x = 0), 0 === s && x > 0 && (x -= 2 * Math.PI), 1 === s && 0 > x && (x += 2 * Math.PI), [g, b, l, h, f, x, V, s]
        }, buildPath: function (e, t) {
            var i = t.path, n = t.x || 0, a = t.y || 0;
            t.pathArray = t.pathArray || this.buildPathArray(i, n, a);
            for (var o = t.pathArray, r = t.pointList = [], s = [], l = 0, h = o.length; h > l; l++) {
                "M" == o[l].command.toUpperCase() && (s.length > 0 && r.push(s), s = []);
                for (var m = o[l].points, V = 0, U = m.length; U > V; V += 2) s.push([m[V], m[V + 1]])
            }
            s.length > 0 && r.push(s);
            for (var l = 0, h = o.length; h > l; l++) {
                var d = o[l].command, m = o[l].points;
                switch (d) {
                    case"L":
                        e.lineTo(m[0], m[1]);
                        break;
                    case"M":
                        e.moveTo(m[0], m[1]);
                        break;
                    case"C":
                        e.bezierCurveTo(m[0], m[1], m[2], m[3], m[4], m[5]);
                        break;
                    case"Q":
                        e.quadraticCurveTo(m[0], m[1], m[2], m[3]);
                        break;
                    case"A":
                        var p = m[0], c = m[1], u = m[2], y = m[3], g = m[4], b = m[5], f = m[6], k = m[7],
                            _ = u > y ? u : y, x = u > y ? 1 : u / y, L = u > y ? y / u : 1;
                        e.translate(p, c), e.rotate(f), e.scale(x, L), e.arc(0, 0, _, g, g + b, 1 - k), e.scale(1 / x, 1 / L), e.rotate(-f), e.translate(-p, -c);
                        break;
                    case"z":
                        e.closePath()
                }
            }
        }, getRect: function (e) {
            if (e.__rect) return e.__rect;
            var t;
            t = "stroke" == e.brushType || "fill" == e.brushType ? e.lineWidth || 1 : 0;
            for (var i = Number.MAX_VALUE, n = Number.MIN_VALUE, a = Number.MAX_VALUE, o = Number.MIN_VALUE, r = e.x || 0, s = e.y || 0, l = e.pathArray || this.buildPathArray(e.path), h = 0; h < l.length; h++) for (var m = l[h].points, V = 0; V < m.length; V++) V % 2 === 0 ? (m[V] + r < i && (i = m[V]), m[V] + r > n && (n = m[V])) : (m[V] + s < a && (a = m[V]), m[V] + s > o && (o = m[V]));
            var U;
            return U = i === Number.MAX_VALUE || n === Number.MIN_VALUE || a === Number.MAX_VALUE || o === Number.MIN_VALUE ? {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            } : {
                x: Math.round(i - t / 2),
                y: Math.round(a - t / 2),
                width: n - i + t,
                height: o - a + t
            }, e.__rect = U, U
        }
    }, e("../tool/util").inherits(s, t), s
});