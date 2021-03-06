/**
 * ParamQuery Pro v6.0.0
 * 
 * Copyright (c) 2012-2019 Paramvir Dhindsa (http://paramquery.com)
 * Released under Commercial license
 * http://paramquery.com/pro/license
 * 
 */
! function(t) {
    var e = window.pq = window.pq || {},
        n = e.mixin = {};
    n.render = {
        getRenderVal: function(t, e, n) {
            var i = t.column,
                r = i.exportRender;
            return (e && r !== !1 || r) && (i.render || i._render || i.format) ? n.renderCell(t) : [t.rowData[t.dataIndx], ""]
        }
    }, n.GrpTree = {
        buildCache: function() {
            for (var t, e, n = this, i = n.that.options, r = "groupModel" == n.model, o = r ? n.that.pdata : i.dataModel.data, a = n.cache = {}, l = n.id, s = 0, d = o.length; d > s; s++)
                if (t = o[s], !r || t.pq_gtitle) {
                    if (e = t[l], null == e) throw "unknown id of row";
                    a[e] = t
                }
        },
        cascadeInit: function() {
            if (this.getCascadeInit()) {
                for (var t, e = this, n = [], i = e.cbId, r = e.that, o = r.options[e.model].select, a = r.pdata, l = 0, s = a.length; s > l; l++) t = a[l], t[i] ? e.isEditable(t) ? (n.push(t), delete t[i]) : o && (t.pq_rowselect = !0) : null === t[i] && delete t[i];
                n.length && e.checkNodes(n, null, null, !0)
            }
        },
        cascadeNest: function(t) {
            for (var e, n, i, r = this, o = r.cbId, a = r.prop, l = r.childstr, s = t.length, d = 0; s > d; d++) n = t[d], n[a] && (e = !0, r.eachChild(n, r.chkEachChild(o, n[o], a)), delete n[a]), (i = n[l]) && i.length && r.cascadeNest(i);
            e && r.hasParent(n) && r.eachParent(n, r.chkEachParent(o))
        },
        checkAll: function(t, e) {
            t = null == t ? !0 : t;
            var n = this,
                i = n.that;
            return n.checkNodes(i.pdata, t, e, null, !0)
        },
        checkNodes: function(t, e, n, i, r) {
            null == e && (e = !0);
            for (var o, a, l, s = 0, d = t.length, c = [], u = {
                    check: e
                }, h = this, f = h.that, p = f.riOffset, g = h.cbId, v = h.prop, m = f.options[h.model], w = r ? !1 : h.isCascade(m), x = i && m.eventForInit || !i, y = m.select; d > s; s++) o = t[s], this.isEditable(o) && (a = o.pq_ri, c.push({
                rowData: o,
                rowIndx: a,
                rowIndxPage: a - p
            }));
            if (u.rows = c, u.dataIndx = h.colUI.dataIndx, i && (u.init = i), x && (l = f._trigger("beforeCheck", n, u)), l !== !1 && (c = u.rows, d = c.length)) {
                var C = this.chkRows = [];
                for (s = 0; d > s; s++) o = c[s].rowData, w && (o[v] = !0), C.push({
                    rd: o,
                    val: e,
                    oldVal: o[g]
                }), o[g] = e;
                w && h.cascadeNest(h.getRoots()), y && this.selectRows(), w && (u.getCascadeList = h.getCascadeList(h)), x && f._trigger("check", n, u), C.length = 0
            }
            h.setValCBox(), i || f.refresh({
                header: !1
            })
        },
        chkEachChild: function(t, e, n) {
            return function(i) {
                if (this.isEditable(i) && (!n || !i[n])) {
                    var r = i[t];
                    null !== e && r !== e && (this.chkRows.push({
                        rd: i,
                        val: e,
                        oldVal: r
                    }), i[t] = e)
                }
            }
        },
        chkEachParent: function(t) {
            var e = this.childstr;
            return function(n) {
                if (this.isEditable(n)) {
                    for (var i, r, o, a = n[e], l = 0, s = 0, d = n[t], c = 0, u = a.length; u > c; c++)
                        if (i = a[c], this.isEditable(i)) {
                            if (o = i[t]) l++;
                            else {
                                if (null === o) {
                                    r = null;
                                    break
                                }
                                s++
                            }
                            if (l && s) {
                                r = null;
                                break
                            }
                        }
                    void 0 === r && (r = !!l), d !== r && (this.chkRows.push({
                        rd: n,
                        val: r,
                        oldVal: d
                    }), n[t] = r)
                }
            }
        },
        eachChild: function(t, e) {
            e.call(this, t);
            for (var n, i = this.childstr, r = t[i] || [], o = 0, a = r.length; a > o; o++) n = r[o], n[i] ? this.eachChild(n, e) : e.call(this, n)
        },
        eachParent: function(t, e) {
            for (; t = this.getParent(t);) e.call(this, t)
        },
        _flatten: function(t, e, n, i) {
            for (var r, o, a = this, l = t.length, s = a.id, d = a.parentId, c = 0, u = a.childstr; l > c; c++) r = t[c], r.pq_level = n, i.push(r), e && (r[d] = s ? e[s] : e), o = r[u], o && a._flatten(o, r, n + 1, i)
        },
        flatten: function(t) {
            var e = [];
            return this._flatten(t, null, 0, e), e
        },
        getCascadeInit: function() {
            var t = this._cascadeInit;
            return this._cascadeInit = !0, t
        },
        getNode: function(t) {
            return this.cache[t]
        },
        getParent: function(t) {
            var e = t[this.parentId];
            return this.cache[e]
        },
        hasParent: function(t) {
            return null != t[this.parentId]
        },
        getRoots: function(t) {
            for (var e, n = this.that, i = t || n.pdata || [], r = i.length, o = 0, a = []; r > o; o++) e = i[o], 0 !== e.pq_level || e.pq_gsummary || a.push(e);
            return r && !a.length && (a = i), a
        },
        setCascadeInit: function(t) {
            this._cascadeInit = t
        },
        getCascadeList: function(t) {
            var e = [];
            return function() {
                if (!e.length)
                    for (var n = t.chkRows, i = 0, r = t.cbId, o = n.length; o > i; i++) {
                        var a = n[i],
                            l = a.rd,
                            s = l.pq_ri,
                            d = {},
                            c = {};
                        d[r] = a.val, c[r] = a.oldVal, e.push({
                            rowIndx: s,
                            rowData: l,
                            newRow: d,
                            oldRow: c
                        })
                    }
                return e
            }
        },
        getChildren: function(t) {
            return t[this.childstr]
        },
        getSummary: function(t) {
            return t.pq_child_sum
        },
        isAncestor: function(t, e) {
            for (var n = t; n = this.getParent(n);)
                if (n == e) return !0
        },
        isCascade: function(t) {
            return t.cascade && t.checkbox && !t.maxCheck
        },
        isEditable: function(t) {
            if (t.pq_gsummary) return !1;
            var e, n = this.that,
                i = this.colCB;
            return i && (e = i.editable) ? "function" == typeof e ? e.call(n, {
                rowData: t
            }) : e : !0
        },
        isFolder: function(t) {
            return null != t.pq_close || !!t[this.childstr]
        },
        onCheckbox: function(t, e) {
            return function(n, i) {
                e.checkbox && t.colUI == i.column && t.checkNodes([i.rowData], i.input.checked, n)
            }
        },
        onCMInit: function() {
            var t, e, n = this,
                i = n.that,
                r = i.columns,
                o = n.model,
                a = "treeModel" === o,
                l = i.options[o];
            l.checkbox && r && (e = r[l.cbId] || {
                dataIndx: l.cbId
            }, e.cb = {
                check: !0,
                uncheck: !1,
                select: l.select,
                header: l.checkboxHead,
                maxCheck: l.maxCheck
            }, t = a ? r[l.dataIndx] : i.colModel[0]), n.colCB = e, n.colUI = t, r && a && n.setCellRender()
        },
        onCustomSortTree: function(t, e) {
            var n = this,
                i = n.getRoots(e.data);
            return n.sort(i, e.sort_composite), e.data = n.flatten(i), !1
        },
        onRefresh: function(t, e) {
            return function() {
                if (e.checkbox)
                    for (var t = this.$cont.find(".pq_indeter"), n = t.length; n--;) t[n].indeterminate = !0
            }
        },
        refreshView: function(t) {
            this.that.refreshView({
                header: !1,
                source: t
            })
        },
        renderCB: function(t, e, n) {
            if (e.pq_gsummary) return "";
            var i, r = this.that,
                o = "",
                a = "",
                l = "";
            return "function" == typeof t && (t = t.call(r, e)), t ? (e[n] && (o = "checked"), this.isEditable(e) || (a = "disabled", i = "pq_disable"), null === e[n] && (l = "class='pq_indeter'"), ["<input type='checkbox' " + l + " " + o + " " + a + "/>", i]) : void 0
        },
        selectRows: function() {
            for (var t = 0, e = this.chkRows, n = e.length; n > t; t++) {
                var i = e[t],
                    r = i.rd,
                    o = i.val;
                r.pq_rowselect = o
            }
        },
        sort: function(t, e) {
            var n = this.childstr,
                i = function(t) {
                    return "function" == typeof e ? e : e[t]
                };
            ! function r(t, e) {
                var o, a = t.length,
                    l = 0;
                if (a)
                    for (e && t.sort(e), e = i(t[0].pq_level + 1); a > l; l++)(o = t[l][n]) && r(o, e)
            }(t, i(0))
        },
        copyArray: function(t, e) {
            for (var n = 0, i = e.length; i > n; n++) t.push(e[n])
        },
        _summaryT: function(t, n, i, r, o, a, l) {
            for (var s, d, c, u, h, f = this, p = f.childstr, g = "groupModel" == f.model, v = a.summaryInTitleRow, m = f.that.colIndxs, w = a.showSummary, x = a.titleInFirstCol, y = 0, C = t.length, b = 0, I = {}, _ = {}, q = f.id, D = f.parentId, R = g && l ? a.dataIndx[l.pq_level] : "", M = [], T = i.length, k = e.aggregate; T > b; b++) h = i[b], I[h] = [];
            for (; C > y; y++) {
                if (d = t[y], s = null, n.push(d), c = d[p]) {
                    for (s = f._summaryT(c, n, i, r, o, a, d), b = 0; T > b; b++) h = i[b], f.copyArray(I[h], s[1][h]);
                    f.copyArray(M, s[2])
                }
                if (!g || !d.pq_gtitle) {
                    for (b = 0; T > b; b++) h = i[b], I[h].push(d[h]);
                    M.push(d)
                }
            }
            for (b = 0; T > b; b++) h = i[b], u = r[b], u = u[R] || u.type, _[h] = k[u](I[h], o[b], M), v && l && (0 == m[h] && x || (l[h] = _[h]));
            return !l || g && !w[l.pq_level] || (_.pq_level = l.pq_level, _[D] = l[q], n.push(_), l.pq_child_sum = _, _.pq_hidden = l.pq_close), _.pq_gsummary = !0, [_, I, M]
        },
        summaryT: function() {
            for (var e, n, i, r = this, o = r.that, a = o.options, l = a[r.model], s = r.getRoots(), d = [], c = [], u = [], h = [], f = 0, p = o.colModel, g = p.length; g > f; f++) e = p[f], n = e.summary, n && !t.isEmptyObject(n) && (u.push(e.dataIndx), h.push(e), c.push(n));
            i = r._summaryT(s, d, u, c, h, l)[0], l.grandSummary ? (i.pq_grandsummary = !0, r.summaryData = a.summaryData = [i]) : (r.summaryData || []).length = 0, o.pdata = d
        }
    }
}(jQuery),
function(t) {
    var e = window.pq = window.pq || {},
        n = e.mixin,
        i = !0;
    t(function() {
        var e = t("<input type='checkbox' style='position:fixed;left:-50px;top:-50px;'/>").appendTo(document.body);
        e[0].indeterminate = !0, e.on("change", function() {
            i = !1
        }), e.click(), e.remove()
    }), n.ChkGrpTree = {
        getCheckedNodes: function(t) {
            var e, n = this.that,
                i = t ? n.getData() : n.options.dataModel.data,
                r = i.length,
                o = 0,
                a = [],
                l = this.colCB || {},
                s = (l.cb || {}).check,
                d = l.dataIndx;
            if (null != d)
                for (; r > o; o++) e = i[o], e[d] === s && a.push(e);
            return a
        },
        hasCboxHead: function() {
            return ((this.colCB || {}).cb || {}).header
        },
        isHeadChecked: function() {
            return this.inpVal
        },
        onBeforeCheck: function(t, e) {
            if (e.check && this.colCB) {
                var n = this.colCB,
                    i = n.cb,
                    r = i.select,
                    o = i.maxCheck;
                if (o && this.colUI.dataIndx == e.dataIndx) {
                    var a = e.rows.slice(0, o),
                        l = a.length,
                        s = n.dataIndx,
                        d = this.getCheckedNodes(!0),
                        c = l + d.length - o;
                    c > 0 && d.slice(0, c).forEach(function(t) {
                        t[s] = i.uncheck, r && delete t.pq_rowselect
                    }), e.rows = a
                }
            }
        },
        onHeaderChange: function(t) {
            this.checkAll(t.target.checked, t) === !1 && this.refreshHeadVal()
        },
        onRefreshHeader: function() {
            var t = this,
                e = t.that;
            if (t.hasCboxHead()) {
                if ("groupModel" == t.model && !e.options[t.model].on) return;
                var n = e.getCellHeader({
                        dataIndx: t.colUI.dataIndx
                    }),
                    r = n.find("input");
                r.length || (n.find(".pq-title-span").prepend('<input type="checkbox" />'), r = n.find("input")), t.$inp && r[0] == t.$inp[0] || (t.$inp = r, t.refreshHeadVal(), i && r.on("click", function(e) {
                    null == r.data("pq_value") && (r[0].checked = !0, r.data("pq_value", !0), t.onHeaderChange(e))
                }), r.on("change", function(e) {
                    t.onHeaderChange(e)
                }))
            }
        },
        refreshHeadVal: function() {
            this.$inp && this.$inp.pqval({
                val: this.inpVal
            })
        },
        setValCBox: function() {
            if (this.hasCboxHead()) {
                var t, e, n = this.that,
                    i = n.options,
                    r = this.colCB,
                    o = r.dataIndx,
                    a = n.colIndxs[o],
                    l = r.cb,
                    s = l.all,
                    d = "remote" == i.pageModel.type,
                    c = d || !s ? n.riOffset : 0,
                    u = s ? i.dataModel.data : n.pdata,
                    h = null,
                    f = 0,
                    p = 0,
                    g = 0;
                if (u) {
                    for (var v = 0, m = u.length; m > v; v++) t = u[v], e = v + c, t.pq_gsummary || t.pq_gtitle || !this.isEditable(t, r, e, a, o) || (p++, t[o] === l.check ? f++ : g++);
                    f == p && p ? h = !0 : g == p && (h = !1), this.inpVal = h, this.refreshHeadVal()
                }
            }
        },
        unCheckAll: function() {
            this.checkAll(!1)
        },
        unCheckNodes: function(t, e) {
            this.checkNodes(t, !1, e)
        }
    }
}(jQuery),
function(t) {
    var e = t.ui.autocomplete.prototype,
        n = e._renderMenu,
        i = e._renderItem;
    e._renderMenu = function(e, i) {
        n.call(this, e, i);
        var r = this.options,
            o = r.selectItem;
        if (o && o.on) {
            var a = o.cls,
                a = void 0 === a ? "ui-state-highlight" : a,
                l = this.element.val();
            l && a && t("a", e).filter(function() {
                return t(this).text() === l
            }).addClass(a)
        }
    }, e._renderItem = function(t, e) {
        var n = i.call(this, t, e),
            r = this.options,
            o = r.highlightText;
        if (o && o.on) {
            var a = this.element.val();
            if (a) {
                var l = new RegExp("(" + a + ")", "i"),
                    s = e.label;
                if (l.test(s)) {
                    var d = o.style,
                        d = void 0 === d ? "font-weight:bold;" : d,
                        c = o.cls,
                        c = void 0 === c ? "" : c;
                    s = s.replace(l, "<span style='" + d + "' class='" + c + "'>$1</span>"), n.find("a").html(s)
                }
            }
        }
        return n
    };
    var r = t.paramquery = t.paramquery || {},
        o = function(t, e, n, i) {
            for (var r, o = e.slice(), a = 0, l = o.length, s = []; l > a; a++) {
                var d = o[a],
                    c = d.cb,
                    u = d.one;
                if (u) {
                    if (d._oncerun) continue;
                    d._oncerun = !0
                }
                if (r = c.call(t, n, i), r === !1 && (n.preventDefault(), n.stopPropagation()), u && s.push(a), n.isImmediatePropagationStopped()) break
            }
            if (l = s.length)
                for (a = l - 1; a >= 0; a--) o.splice(s[a], 1)
        };
    r._trigger = function(e, n, i) {
        var r, a, l = this,
            s = l.listeners,
            d = s[e],
            c = l.options,
            u = c.allEvents,
            h = c.bubble,
            f = l.element,
            p = c[e];
        if (i = i || {}, n = t.Event(n), n.type = l.widgetName + ":" + e, n.target = f[0], a = n.originalEvent)
            for (r in a) r in n || (n[r] = a[r]);
        if (u && "function" == typeof u && u.call(l, n, i), d && d.length && (o(l, d, n, i), n.isImmediatePropagationStopped())) return !n.isDefaultPrevented();
        if (c.trigger && (f[h ? "trigger" : "triggerHandler"](n, i), n.isImmediatePropagationStopped())) return !n.isDefaultPrevented();
        if (p) {
            var g = p.call(l, n, i);
            g === !1 && (n.preventDefault(), n.stopPropagation())
        }
        return d = s[e + "Done"], d && d.length && o(l, d, n, i), !n.isDefaultPrevented()
    };
    var a = function(t, e, n, i, r) {
        var o = t.listeners[e];
        o || (o = t.listeners[e] = []), o[r ? "unshift" : "push"]({
            cb: n,
            one: i
        })
    };
    r.on = function() {
        var t = arguments;
        if ("boolean" == typeof t[0]) var e = t[0],
            n = t[1],
            i = t[2],
            r = t[3];
        else var n = t[0],
            i = t[1],
            r = t[2];
        for (var o = n.split(" "), l = 0; l < o.length; l++) {
            var s = o[l];
            s && a(this, s, i, r, e)
        }
        return this
    }, r.one = function() {
        for (var t = arguments.length, e = [], n = 0; t > n; n++) e[n] = arguments[n];
        return e[t] = !0, this.on.apply(this, e)
    };
    var l = function(t, e, n) {
        if (n) {
            var i = t.listeners[e];
            if (i) {
                for (var r = [], o = 0, a = i.length; a > o; o++) {
                    var l = i[o],
                        s = l.cb;
                    n == s && r.push(o)
                }
                if (r.length)
                    for (var o = r.length - 1; o >= 0; o--) i.splice(r[o], 1)
            }
        } else delete t.listeners[e]
    };
    r.off = function(t, e) {
        for (var n = t.split(" "), i = 0; i < n.length; i++) {
            var r = n[i];
            r && l(this, r, e)
        }
        return this
    };
    var s = {
        options: {
            items: ".pq-grid-cell.pq-has-tooltip,.pq-grid-cell[title]",
            position: {
                my: "center top",
                at: "center bottom"
            },
            content: function() {
                var e = t(this),
                    n = e.closest(".pq-grid"),
                    i = n.pqGrid("instance"),
                    r = i.getCellIndices({
                        $td: e
                    }),
                    o = r.rowIndx,
                    a = r.dataIndx,
                    l = i.data({
                        rowIndx: o,
                        dataIndx: a,
                        data: "pq_valid"
                    }).data;
                if (l) {
                    var s = l.icon,
                        d = l.msg;
                    d = null != d ? d : "";
                    var c = "" == s ? "" : "<span class='ui-icon " + s + " pq-tooltip-icon'></span>";
                    return c + d
                }
                return e.attr("title")
            }
        }
    };
    s._create = function() {
        this._super();
        var e = this.element,
            n = this.eventNamespace;
        e.on("pqtooltipopen" + n, function(e, n) {
            var i = t(e.target),
                r = t(e.originalEvent.target);
            if (r.on("remove.pqtt", function(t) {
                    i.pqTooltip("close", t, !0)
                }), i.is(".pq-grid")) {
                var o, a = i.pqGrid("instance"),
                    l = a.getCellIndices({
                        $td: r
                    }),
                    s = l.rowIndx,
                    d = l.dataIndx,
                    c = a.getRowData({
                        rowIndx: s
                    });
                if ((o = c) && (o = o.pq_celldata) && (o = o[d]) && (o = o.pq_valid)) {
                    var u = o,
                        h = u.style,
                        f = u.cls;
                    n.tooltip.addClass(f);
                    var p = n.tooltip.attr("style");
                    n.tooltip.attr("style", p + ";" + h)
                }
            }
        }), e.on("pqtooltipclose" + n, function(e, n) {
            var i = (t(e.target), t(e.originalEvent.target));
            i.off(".pqtt")
        })
    }, t.widget("paramquery.pqTooltip", t.ui.tooltip, s)
}(jQuery),
function(t) {
    t.paramquery = t.paramquery || {}, t.paramquery.onResize = function(e, n) {
        var i = !1,
            r = t(e);
        if ("static" === r.css("position") && r.css("position", "relative"), !i) {
            var o = t('<iframe type="text/html" src="about:blank" class="pq-resize-iframe" style="display:block;width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;overflow: hidden; pointer-events: none;" />').appendTo(r);
            o[0].data = "about:blank", o.css("opacity", "0")
        }
        for (var a = 0; a < r.length; a++)
            if (i) t(r[a]).on("resize", function(t) {
                n.call(e, t)
            });
            else {
                var l = o[a],
                    s = t(l.contentWindow);
                s.on("resize", function(t) {
                    n.call(e, t)
                })
            }
    }
}(jQuery),
function(t) {
    function e(t) {
        return t.charCodeAt(0) - 64
    }
    var n = t.paramquery,
        i = Array.prototype;
    !i.find && (i.find = function(t, e) {
        for (var n, i = 0, r = this.length; r > i; i++)
            if (n = this[i], t.call(e, n, i, this)) return n
    }), !i.findIndex && (i.findIndex = function(t, e) {
        for (var n, i = 0, r = this.length; r > i; i++)
            if (n = this[i], t.call(e, n, i, this)) return i;
        return -1
    });
    var r = t.extend(window.pq, {
        arrayUnique: function(t, e) {
            var n, i, r, o = [],
                a = t.length,
                l = {};
            for (n = 0; a > n; n++) i = t[n], r = e ? i[e] : i, 1 != l[r] && (l[r] = 1, o.push(i));
            return o
        },
        cap1: function(t) {
            return t && t.length ? t[0].toUpperCase() + t.slice(1) : ""
        },
        elementFromXY: function(e) {
            var n, i = e.clientX,
                r = e.clientY,
                o = t(document.elementFromPoint(i, r));
            return o.closest(".ui-draggable-dragging").length && (n = o, n.hide(), o = t(document.elementFromPoint(i, r)), n.show()), o
        },
        escapeHtml: function(t) {
            return t.replace(/&/g, "&amp;").replace(/<(\S)/g, "&lt;$1")
        },
        escapeXml: function(t) {
            return t.replace(/&/g, "&amp;").replace(/</g, "&lt;")
        },
        excelToJui: function() {
            var t = {};
            return function(e) {
                var n = t[e];
                return n || (n = e.replace(/yy/g, "y").replace(/dddd/g, "DD").replace(/ddd/g, "D").replace(/mmmm/g, "MM").replace(/mmm/g, "M"), t[e] = n), n
            }
        }(),
        excelToNum: function() {
            var t = {};
            return function(e) {
                var n = t[e];
                return n || (n = e.replace(/\\/g, ""), t[e] = n), n
            }
        }(),
        flatten: function(t, e) {
            var n, i = 0,
                o = t.length;
            for (e = e || []; o > i; i++) n = t[i], null != n && (n.push ? r.flatten(n, e) : e.push(n));
            return e
        },
        toRC: function(t) {
            var e = t.match(/([A-Z]+)(\d+)/),
                n = r.toNumber(e[1]),
                i = e[2] - 1;
            return [i, n]
        },
        formatEx: function(t, e, n, i) {
            return n && (i = i || r.getDataType(t), r.filter.conditions[n][i]) ? this.format(t, e, i) : e
        },
        format: function(e, n, i) {
            var o = e.format;
            if (o && null != n) {
                if ("function" == typeof o) return o(n);
                if (i = i || r.getDataType(e), "date" == i) try {
                    var a = new Date(n);
                    a && !isNaN(a.getTime()) && (n = t.datepicker.formatDate(o, a))
                } catch (l) {} else n = r.formatNumber(n, o)
            }
            return n
        },
        deFormat: function(e, n, i) {
            if (n) {
                var o, a, l, s = e.format;
                if (s && (l = r.getDataType(e), a = i ? r.filter.conditions[i][l] : !0)) try {
                    "function" == typeof s ? n = e.deFormat(n) : "date" == l ? (o = e.formatRaw || "mm/dd/yy", o != s && (n = t.datepicker.parseDate(s, n), n = t.datepicker.formatDate(o, n))) : n = r.deFormatNumber(n, s)
                } catch (d) {
                    n = null
                }
            }
            return n
        },
        fakeEvent: function(t, e, n) {
            if ("timeout" == e) {
                var i, r = "keyup change";
                t.off(r).on(r, function() {
                    clearTimeout(i), i = setTimeout(function() {
                        t.triggerHandler("timeout")
                    }, n)
                })
            }
        },
        getAddress: function(t) {
            var e = t.split(":"),
                n = this.toRC(e[0]),
                i = n[0],
                r = n[1],
                o = this.toRC(e[1] || e[0]),
                a = o[0],
                l = o[1],
                s = a - i + 1,
                d = l - r + 1;
            return {
                r1: i,
                c1: r,
                rc: s,
                cc: d,
                r2: a,
                c2: l
            }
        },
        getDataType: function(t) {
            var e, n = t.dataType;
            return "bool" == n ? e = "bool" : "float" == n || "integer" == n ? e = "number" : "date" == n && (e = "date"), e || "string"
        },
        getFn: function() {
            var t = {};
            return function(e) {
                var n = e;
                return "string" == typeof e && ((n = t[e]) || (n = window, e.split(".").forEach(function(t) {
                    n = n[t]
                }), t[e] = n)), n
            }
        }(),
        isCtrl: function(t) {
            return t.ctrlKey || t.metaKey
        },
        isDateFormat: function() {
            var t = {};
            return function(e) {
                var n = t[e];
                return null == n && (n = t[e] = /^[mdy\s-\/,]*$/i.test(e)), n
            }
        }(),
        isEmpty: function(t) {
            for (var e in t) return !1;
            return !0
        },
        juiToExcel: function() {
            var t = {};
            return function(e) {
                var n = t[e];
                return n || (n = e.replace(/y/g, "yy").replace(/DD/g, "dddd").replace(/D/g, "ddd").replace(/MM/g, "mmmm").replace(/M/g, "mmm"), t[e] = n), n
            }
        }(),
        makePopup: function(e, n, i) {
            var o = (Math.random() + "").replace(".", ""),
                a = "mousedown.pq" + o + " keydown.pq" + o,
                l = function() {
                    s.remove(), t(document).off(a), i && i()
                },
                s = t(e);
            s.addClass("pq-popup").on("keydown", function(e) {
                e.keyCode == t.ui.keyCode.ESCAPE && l()
            }), t(n).one("remove", function() {
                l()
            }), t(document).on(a, function(i) {
                var o = t(i.target);
                e.contains(o[0]) || r.isCtrl(i) || o.closest(".ui-datepicker").length || o.closest(n).length || l()
            })
        },
        moveItem: function(t, e, n, i) {
            return n > i ? (e.splice(n, 1), e.splice(i++, 0, t)) : n == i ? i++ : (e.splice(i, 0, t), e.splice(n, 1)), i
        },
        newLine: function(t) {
            return isNaN(t) && "string" == typeof t ? t.replace(/(\r\n|\r|\n)/g, "<br>") : t
        },
        numToExcel: function() {
            var t = {};
            return function(e) {
                var n = t[e];
                return n || (n = e.replace(/[^#0,.@]/g, function(t) {
                    return "\\" + t
                }), t[e] = n), n
            }
        }(),
        objectify: function(t) {
            for (var e = {}, n = t.length; n--;) e[t[n]] = 1;
            return e
        },
        unescapeXml: function() {
            var t = {
                amp: "&",
                lt: "<",
                gt: ">",
                quot: '"',
                apos: "'"
            };
            return function(e) {
                return e.replace(/&(amp|lt|gt|quot|apos);/g, function(e, n) {
                    return t[n]
                })
            }
        }()
    });
    n.select = function(t) {
        var e, n, i, r = t.attr,
            o = t.options,
            a = t.groupIndx,
            l = t.labelIndx,
            s = t.valueIndx,
            d = null != l && null != s,
            c = null != a,
            u = t.prepend,
            h = t.dataMap,
            f = function() {
                for (var t = {}, e = 0; e < h.length; e++) {
                    var n = h[e];
                    t[n] = w[n]
                }
                return "data-map='" + JSON.stringify(t) + "'"
            },
            p = ["<select ", r, " >"];
        if (u)
            for (var g in u) p.push('<option value="', g, '">', u[g], "</option>");
        if (o && o.length) {
            for (var v = 0, m = o.length; m > v; v++) {
                var w = o[v];
                if (d) {
                    var x = w[s],
                        y = w.pq_disabled ? 'disabled="disabled" ' : "",
                        C = w.pq_selected ? 'selected="selected" ' : "";
                    if (null == x) continue;
                    if (i = h ? f() : "", c) {
                        var b = w.pq_disabled_group ? 'disabled="disabled" ' : "";
                        e = w[a], n != e && (null != n && p.push("</optgroup>"), p.push('<optgroup label="', e, '" ', b, " >"), n = e)
                    }
                    if (l == s) p.push("<option ", C, y, i, ">", x, "</option>");
                    else {
                        var I = w[l];
                        p.push("<option ", C, y, i, ' value="', x, '">', I, "</option>")
                    }
                } else if ("object" == typeof w)
                    for (var g in w) p.push('<option value="', g, '">', w[g], "</option>");
                else p.push("<option>", w, "</option>")
            }
            c && p.push("</optgroup>")
        }
        return p.push("</select>"), p.join("")
    }, t.fn.pqval = function(t) {
        if (t) {
            if (t.incr) {
                var e = this.data("pq_value");
                return this.prop("indeterminate", !1), e ? (e = !1, this.prop("checked", !1)) : e === !1 ? (e = null, this.prop("indeterminate", !0), this.prop("checked", !1)) : (e = !0, this.prop("checked", !0)), this.data("pq_value", e), e
            }
            return e = t.val, this.data("pq_value", e), this.prop("indeterminate", !1), null === e ? (this.prop("indeterminate", !0), this.prop("checked", !1)) : e ? this.prop("checked", !0) : this.prop("checked", !1), this
        }
        return this.data("pq_value")
    }, n.xmlToArray = function(e, n) {
        var i = n.itemParent,
            r = n.itemNames,
            o = [],
            a = t(e).find(i);
        return a.each(function(e, n) {
            var i = t(n),
                a = [];
            t(r).each(function(t, e) {
                a.push(i.find(e).text().replace(/\r|\n|\t/g, ""))
            }), o.push(a)
        }), o
    }, n.xmlToJson = function(e, n) {
        var i = n.itemParent,
            r = n.itemNames,
            o = [],
            a = t(e).find(i);
        return a.each(function(e, n) {
            for (var i = t(n), a = {}, l = 0, s = r.length; s > l; l++) {
                var d = r[l];
                a[d] = i.find(d).text().replace(/\r|\n|\t/g, "")
            }
            o.push(a)
        }), o
    }, n.tableToArray = function(e) {
        var n = t(e),
            i = [],
            r = [],
            o = n.children("tbody").children("tr"),
            a = o.length ? t(o[0]) : t(),
            l = o.length > 1 ? t(o[1]) : t();
        return a.children("th,td").each(function(e, n) {
            var r = t(n),
                o = r.html(),
                a = r.width(),
                s = "left",
                d = "string";
            if (l.length) var c = l.find("td:eq(" + e + ")"),
                u = c.attr("align"),
                s = u ? u : s;
            var h = {
                title: o,
                width: a,
                dataType: d,
                align: s,
                dataIndx: e
            };
            i.push(h)
        }), o.each(function(e, n) {
            if (0 != e) {
                var i = t(n),
                    o = [];
                i.children("td").each(function(e, n) {
                    o.push(t.trim(t(n).html()))
                }), r.push(o)
            }
        }), {
            data: r,
            colModel: i
        }
    };
    var o = function(t) {
        return function(e, n) {
            var i, r, o, a;
            if (e) {
                if (r = e.split(":"), e = n && r.length > 1 ? r[1] : r[0], i = t[e]) return i;
                o = /^([^#]*|&#[^#]*)?[\,\.#0]*?([\,\s\.]?)([#0]*)([\,\s\.]?)([0]*?)(\s*[^#^0]*|&#[^#]*)?$/, a = e.match(o), a && a.length && (i = {
                    symbol: a[1] || "",
                    thouSep: a[2],
                    thousand: a[3].length,
                    decSep: a[4],
                    decimal: a[5].length,
                    symbolEnd: a[6] || ""
                }, t[e] = i)
            }
            return i = i || {
                symbol: "",
                symbolEnd: "",
                thouSep: ",",
                thousand: 3,
                decSep: ".",
                decimal: 2
            }
        }
    }({});
    n.formatCurrency = function(t, e) {
        var n = parseFloat(t);
        if (!isNaN(n)) {
            var i = 0 > n,
                r = o(e, i),
                a = r.symbol,
                l = r.symbolEnd,
                s = r.thousand,
                d = r.thouSep,
                c = r.decSep,
                u = r.decimal;
            n = n.toFixed(u);
            for (var h = n.length, f = u + c.length, p = n.substring(0, h - f), g = n.substring(h - f + c.length, h), v = p.match(/\d/g).reverse(), m = [], w = 0; w < v.length; w++) w > 0 && w % s == 0 && m.push(d), m.push(v[w]);
            return m = m.reverse(), p = m.join(""), (i ? "-" : "") + a + p + c + g + l
        }
    }, r.formatNumber = n.formatCurrency, r.deFormatNumber = function(t, e) {
        var n = 0 > t,
            i = o(e, n),
            r = i.symbol,
            a = i.symbolEnd,
            l = i.thouSep,
            s = i.decSep;
        return l = "." === l ? "\\." : l, t = t.replace(r, "").replace(a, "").replace(new RegExp(l, "g"), ""), s && (t = 1 * t.replace(s, ".")), t
    }, r.validation = {
        is: function(t, e) {
            return "string" != t && t ? (t = t.substring(0, 1).toUpperCase() + t.substring(1, t.length), this["is" + t](e)) : !0
        },
        isFloat: function(t) {
            var e = parseFloat(t);
            return !isNaN(e) && e == t
        },
        isInteger: function(t) {
            var e = parseInt(t);
            return !isNaN(e) && e == t
        },
        isDate: function(t) {
            var e = Date.parse(t);
            return !isNaN(e)
        }
    };
    var a = [],
        l = {},
        s = r.toLetter = function(t) {
            var e = a[t];
            if (!e) {
                t++;
                var n = t % 26,
                    i = t / 26 | 0,
                    r = n ? String.fromCharCode(64 + n) : (--i, "Z");
                e = i ? s(i - 1) + r : r, t--, a[t] = e, l[e] = t
            }
            return e
        };
    r.toNumber = function(t) {
        var n, i, r, o, s, d = l[t];
        if (null == d) {
            for (n = t.length, d = -1, i = 0; n > i; i++) r = t[i], o = e(r), s = n - i - 1, d += o * Math.pow(26, s);
            a[d] = t, l[t] = d
        }
        return d
    }, r.generateData = function(t, e) {
        for (var n = [], i = 0; e > i; i++) n[i] = s(i);
        for (var r = [], i = 0; t > i; i++)
            for (var o = r[i] = [], a = 0; e > a; a++) o[a] = n[a] + (i + 1);
        return r
    }
}(jQuery),
function(t) {
    pq.validations = {
        minLen: function(t, e, n) {
            return t = n(t), e = n(e), t.length >= e ? !0 : void 0
        },
        nonEmpty: function(t) {
            return null != t && "" !== t ? !0 : void 0
        },
        maxLen: function(t, e, n) {
            return t = n(t), e = n(e), t.length <= e ? !0 : void 0
        },
        gt: function(t, e, n) {
            return t = n(t), e = n(e), t > e ? !0 : void 0
        },
        gte: function(t, e, n) {
            return t = n(t), e = n(e), t >= e ? !0 : void 0
        },
        lt: function(t, e, n) {
            return t = n(t), e = n(e), e > t ? !0 : void 0
        },
        lte: function(t, e, n) {
            return t = n(t), e = n(e), e >= t ? !0 : void 0
        },
        neq: function(t, e, n) {
            return t = n(t), e = n(e), t !== e ? !0 : void 0
        },
        regexp: function(t, e) {
            return new RegExp(e).test(t) ? !0 : void 0
        }
    };
    var e = t.paramquery;
    e.cValid = function(t) {
        this.that = t
    }, e.cValid.prototype = {
        _isValidCell: function(t) {
            var e = this.that,
                n = t.column,
                i = n.validations;
            if (!i || !i.length) return {
                valid: !0
            };
            var r, o = t.value,
                a = n.dataType,
                l = function(t) {
                    return e.getValueFromDataType(t, a, !0)
                },
                s = t.rowData;
            if (!s) throw "rowData required.";
            for (var d = 0; d < i.length; d++) {
                var c = i[d],
                    u = c.on,
                    h = c.type,
                    f = !1,
                    p = c.msg,
                    g = c.value;
                if (u !== !1) {
                    if (r = pq.validations[h]) f = null == o ? !1 : r(o, g, l);
                    else if (h) {
                        var v = {
                            column: n,
                            value: o,
                            rowData: s,
                            msg: p
                        };
                        e.callFn(h, v) === !1 ? (f = !1, p = v.msg) : f = !0
                    } else f = !0;
                    if (!f) return {
                        valid: !1,
                        msg: p,
                        column: n,
                        warn: c.warn,
                        dataIndx: n.dataIndx,
                        validation: c
                    }
                }
            }
            return {
                valid: !0
            }
        },
        onScrollCell: function(t, e, n, i, r, o) {
            var a, l = this.that,
                s = l.options,
                d = s.bootstrap;
            if (t || (a = l.getEditCell()) && a.$cell) {
                var c = t || a.$cell;
                c.attr("title", e);
                var u = "tooltip",
                    h = "open";
                d.on && d.tooltip && (u = d.tooltip, h = "show");
                try {
                    c[u]("destroy")
                } catch (f) {}
                c[u]({
                    trigger: "manual",
                    position: {
                        my: "left center+5",
                        at: "right center"
                    },
                    content: function() {
                        var t = "" == n ? "" : "<span class='ui-icon " + n + " pq-tooltip-icon'></span>";
                        return t + e
                    },
                    open: function(t, e) {
                        var n = e.tooltip;
                        if (i && n.addClass(i), o) {
                            var a = n.attr("style");
                            n.attr("style", a + ";" + o)
                        }
                        r && n.tooltip.css(r)
                    }
                })[u](h)
            }
        },
        isValidCell: function(e) {
            var n = this,
                i = this.that,
                r = e.rowData,
                o = e.rowIndx,
                a = e.value,
                l = e.valueDef,
                s = e.column,
                d = e.focusInvalid,
                c = i.options,
                u = (c.bootstrap, e.allowInvalid),
                h = s.dataIndx,
                f = c.validation,
                p = c.warning,
                g = c.editModel,
                v = g.invalidClass,
                m = g.warnClass,
                w = document.activeElement;
            if (e.checkEditable && 0 == i.isEditable({
                    rowIndx: o,
                    rowData: r,
                    column: s,
                    dataIndx: h
                })) return {
                valid: !0
            };
            var x = this._isValidCell({
                    column: s,
                    value: a,
                    rowData: r
                }),
                y = x.valid,
                C = x.warn,
                b = x.msg;
            if (y) i.data({
                rowData: r,
                dataIndx: h,
                data: "pq_valid"
            }) && (i.removeClass({
                rowData: r,
                rowIndx: o,
                dataIndx: h,
                cls: m + " " + v
            }), i.removeData({
                rowData: r,
                dataIndx: h,
                data: "pq_valid"
            }));
            else var I = t.extend({}, C ? p : f, x.validation),
                _ = I.css,
                q = I.cls,
                D = I.icon,
                R = I.style;
            if (u || C) return y ? {
                valid: !0
            } : (i.addClass({
                rowData: r,
                rowIndx: o,
                dataIndx: h,
                cls: C ? m : v
            }), i.data({
                rowData: r,
                dataIndx: h,
                data: {
                    pq_valid: {
                        css: _,
                        icon: D,
                        style: R,
                        msg: b,
                        cls: q
                    }
                }
            }), x);
            if (!y) {
                if (null == o) {
                    var M = i.getRowIndx({
                            rowData: r,
                            dataUF: !0
                        }),
                        o = M.rowIndx;
                    if (null == o || M.uf) return x.uf = M.uf, x
                }
                if (d) {
                    var T;
                    if (l) {
                        if (t(w).hasClass("pq-editor-focus")) {
                            var k = c.editModel.indices;
                            if (k) {
                                var E = k.rowIndx,
                                    S = k.dataIndx;
                                if (null != o && o != E) throw "incorrect usage of isValid rowIndx: " + o;
                                if (h != S) throw "incorrect usage of isValid dataIndx: " + h;
                                i.editCell({
                                    rowIndx: E,
                                    dataIndx: h
                                })
                            }
                        }
                    } else {
                        i.goToPage({
                            rowIndx: o
                        });
                        var P = {
                                rowIndx: o,
                                dataIndx: h
                            },
                            P = i.normalize(P);
                        T = i.getCell(P), i.scrollCell(P, function() {
                            n.onScrollCell(T, b, D, q, _, R), i.focus(P)
                        })
                    }
                    this.onScrollCell(T, b, D, q, _, R)
                }
                return x
            }
            if (l) {
                var $ = i.getEditCell();
                if ($ && $.$cell) {
                    var A = $.$cell;
                    A.removeAttr("title");
                    try {
                        A.tooltip("destroy")
                    } catch (H) {}
                }
            }
            return {
                valid: !0
            }
        },
        isValid: function(t) {
            t = t || {};
            var e = this.that,
                n = t.allowInvalid,
                i = t.focusInvalid,
                r = t.checkEditable,
                n = null == n ? !1 : n,
                o = t.dataIndx;
            if (null != o) {
                var a = e.columns[o],
                    l = t.rowData || e.getRowData(t),
                    s = t.hasOwnProperty("value"),
                    d = s ? t.value : l[o],
                    c = this.isValidCell({
                        rowData: l,
                        checkEditable: r,
                        rowIndx: t.rowIndx,
                        value: d,
                        valueDef: s,
                        column: a,
                        allowInvalid: n,
                        focusInvalid: i
                    });
                return c.valid || c.warn ? {
                    valid: !0
                } : c
            }
            if (null != t.rowIndx || null != t.rowIndxPage || null != t.rowData) {
                for (var l = t.rowData || e.getRowData(t), u = e.colModel, h = [], f = 0, p = u.length; p > f; f++) {
                    var a = u[f],
                        g = a.hidden;
                    if (!g) {
                        var o = a.dataIndx,
                            d = l[o],
                            c = this.isValidCell({
                                rowData: l,
                                value: d,
                                column: a,
                                rowIndx: t.rowIndx,
                                checkEditable: r,
                                allowInvalid: n,
                                focusInvalid: i
                            });
                        if (!c.valid && !c.warn) {
                            if (!n) return c;
                            h.push({
                                rowData: l,
                                dataIndx: o,
                                column: a
                            })
                        }
                    }
                }
                return n && h.length ? {
                    cells: h,
                    valid: !1
                } : {
                    valid: !0
                }
            }
            var v = t.data ? t.data : e.options.dataModel.data,
                h = [];
            if (!v) return null;
            for (var f = 0, p = v.length; p > f; f++) {
                var m, l = v[f],
                    w = this.isValid({
                        rowData: l,
                        rowIndx: m,
                        checkEditable: r,
                        allowInvalid: n,
                        focusInvalid: i
                    }),
                    x = w.cells;
                if (n === !1) {
                    if (!w.valid) return w
                } else x && x.length && (h = h.concat(x))
            }
            return n && h.length ? {
                cells: h,
                valid: !1
            } : {
                valid: !0
            }
        }
    }
}(jQuery),
function(t) {
    var e = {};
    e.options = {
        curPage: 0,
        totalPages: 0,
        totalRecords: 0,
        msg: "",
        rPPOptions: [10, 20, 30, 40, 50, 100],
        rPP: 20,
        layout: ["first", "prev", "|", "strPage", "|", "next", "last", "|", "strRpp", "|", "refresh", "|", "strDisplay"]
    }, e._create = function() {
        var t = this,
            e = t.options,
            n = t.element,
            i = {
                first: t.initButton(e.strFirstPage, "seek-first", "pq-page-first"),
                "|": "<span class='pq-separator'></span>",
                next: t.initButton(e.strNextPage, "seek-next", "pq-page-next"),
                prev: t.initButton(e.strPrevPage, "seek-prev", "pq-page-prev"),
                last: t.initButton(e.strLastPage, "seek-end", "pq-page-last"),
                strPage: t.getPageOf(),
                strRpp: t.getRppOptions(),
                refresh: t.initButton(e.strRefresh, "refresh", "pq-page-refresh"),
                strDisplay: "<span class='pq-page-display'>" + t.getDisplay() + "</span>"
            },
            r = e.layout.map(function(t) {
                return i[t]
            }).join("");
        t.listeners = {}, n.html(r), n.addClass("pq-pager"), t.$first = n.find(".pq-page-first"), t.bindButton(t.$first, function(n) {
            e.curPage > 1 && t.onChange(n, 1)
        }), t.$prev = n.find(".pq-page-prev"), t.bindButton(t.$prev, function(n) {
            if (e.curPage > 1) {
                var i = e.curPage - 1;
                t.onChange(n, i)
            }
        }), t.$next = n.find(".pq-page-next"), t.bindButton(t.$next, function(n) {
            if (e.curPage < e.totalPages) {
                var i = e.curPage + 1;
                t.onChange(n, i)
            }
        }), t.$last = n.find(".pq-page-last"), t.bindButton(t.$last, function(n) {
            if (e.curPage !== e.totalPages) {
                var i = e.totalPages;
                t.onChange(n, i)
            }
        }), t.$refresh = n.find(".pq-page-refresh"), t.bindButton(t.$refresh, function(e) {
            return t._trigger("beforeRefresh", e) === !1 ? !1 : void t._trigger("refresh", e)
        }), t.$display = n.find(".pq-page-display"), t.$select = n.find(".pq-page-select").val(e.rPP).on("change", t.onChangeSelect.bind(t)), t.$totalPages = n.find(".pq-page-total"), t.$curPage = n.find(".pq-page-current"), t.bindCurPage(t.$curPage)
    }, e._destroy = function() {
        this.element.empty().removeClass("pq-pager").enableSelection(), this._trigger("destroy")
    }, e._setOption = function(t, e) {
        "curPage" != t && "totalPages" != t || (e = 1 * e), this._super(t, e)
    }, e._setOptions = function(e) {
        var n, i = !1,
            r = this.options;
        for (n in e) {
            var o = e[n],
                a = typeof o;
            "string" == a || "number" == a ? o != r[n] && (this._setOption(n, o), i = !0) : "function" == typeof o.splice || t.isPlainObject(o) ? JSON.stringify(o) != JSON.stringify(r[n]) && (this._setOption(n, o), i = !0) : o != r[n] && (this._setOption(n, o), i = !0)
        }
        return i && this._refresh(), this
    }, t.widget("paramquery.pqPager", e), pq.pager = function(e, n) {
        var i = t(e).pqPager(n),
            r = i.data("paramqueryPqPager") || i.data("paramquery-pqPager");
        return r
    };
    var n = t.paramquery,
        i = n.pqPager;
    i.regional = {}, i.defaults = i.prototype.options, t.extend(i.prototype, {
        bindButton: function(e, n) {
            e.bind("click keydown", function(e) {
                return "keydown" != e.type || e.keyCode == t.ui.keyCode.ENTER ? n.call(this, e) : void 0
            })
        },
        bindCurPage: function(e) {
            var n = this,
                i = this.options;
            e.bind("keydown", function(e) {
                e.keyCode === t.ui.keyCode.ENTER && t(this).trigger("change")
            }).bind("change", function(e) {
                var r = t(this),
                    o = r.val();
                return isNaN(o) || 1 > o ? (r.val(i.curPage), !1) : (o = parseInt(o), o !== i.curPage ? o > i.totalPages ? (r.val(i.curPage), !1) : n.onChange(e, o) === !1 ? (r.val(i.curPage), !1) : void 0 : void 0)
            })
        },
        initButton: function(t, e, n) {
            return "<span class='pq-ui-button ui-widget-header " + n + "' tabindex='0' title='" + t + "'><span class='ui-icon ui-icon-" + e + "'></span></span>"
        },
        onChange: function(t, e) {
            var n = {
                curPage: e
            };
            return this._trigger("beforeChange", t, n) === !1 ? !1 : (this.options.curPage = e, void this._trigger("change", t, n))
        },
        onChangeSelect: function(e) {
            var n = t(e.target),
                i = this,
                r = 1 * n.val(),
                o = {
                    rPP: r
                };
            return i._trigger("beforeChange", e, o) === !1 ? (n.val(i.options.rPP), !1) : (i.options.rPP = r, void i._trigger("change", e, o))
        },
        refresh: function() {
            this._destroy(), this._create()
        },
        _refresh: function() {
            var t = this,
                e = t.options,
                n = e.curPage >= e.totalPages;
            t.setDisable(t.$next, n), t.setDisable(t.$last, n), n = e.curPage <= 1, t.setDisable(t.$first, n), t.setDisable(t.$prev, n), t.$totalPages.text(e.totalPages), t.$curPage.val(e.curPage), t.$select.val(e.rPP), t.$display.html(this.getDisplay()), t._trigger("refreshView")
        },
        getDisplay: function() {
            var t = this.options;
            if (t.totalRecords > 0) {
                var e = t.rPP,
                    n = t.strDisplay || "",
                    i = t.curPage,
                    r = t.totalRecords,
                    o = (i - 1) * e,
                    a = i * e;
                a > r && (a = r), n = n.replace("{0}", o + 1), n = n.replace("{1}", a), n = n.replace("{2}", r)
            } else n = "";
            return n
        },
        getPageOf: function() {
            var t = this.options;
            return "<span>" + (t.strPage || "").replace("{0}", "<input type='text' value='" + t.curPage + "' tabindex='0' class='pq-page-current ui-corner-all' />").replace("{1}", "<span class='pq-page-total'>" + t.totalPages + "</span>") + "</span>"
        },
        getRppOptions: function() {
            var t = this.options,
                e = t.strRpp || "";
            if (e) {
                var n, i, r = t.rPPOptions,
                    o = ["<select class='ui-corner-all pq-page-select' >"];
                if (-1 != e.indexOf("{0}")) {
                    for (var a = 0, l = r.length; l > a; a++) i = r[a], o.push('<option value="', i, '">', i, "</option>");
                    o.push("</select>"), n = o.join(""), e = e.replace("{0}", n) + "</span>"
                }
            }
            return "<span class='pq-page-rppoptions'>" + e + "</span>"
        },
        getInstance: function() {
            return {
                pager: this
            }
        },
        _trigger: n._trigger,
        on: n.on,
        one: n.one,
        off: n.off,
        setDisable: function(t, e) {
            t[e ? "addClass" : "removeClass"]("disabled").css("pointer-events", e ? "none" : "").attr("tabindex", e ? "" : "0")
        }
    })
}(jQuery),
function(t) {
    function e(t) {
        return "<span class='btn btn-xs glyphicon glyphicon-" + t + "' ></span>"
    }

    function n(t) {
        return "<span class='ui-widget-header pq-ui-button'><span class='ui-icon ui-icon-" + t + "'></span></span>"
    }
    var i = function() {};
    i.prototype = {
        belongs: function(t) {
            return t.target == this.that.element[0] ? !0 : void 0
        },
        setTimer: function(t, e) {
            var n = this;
            clearTimeout(n._timeID), n._timeID = setTimeout(function() {
                t()
            }, e)
        }
    };
    var r = t.paramquery;
    r.cClass = i;
    var o = {
        widgetEventPrefix: "pqgrid"
    };
    o._create = function() {
        var e = this,
            n = this.options,
            i = this.element,
            o = n.dataModel,
            a = n.bootstrap,
            l = a.on,
            s = n.roundCorners && !l,
            d = n.ui,
            c = n.sortModel;
        if (t(document).triggerHandler("pqGrid:bootup", {
                instance: this
            }), this.BS_on = l, n.collapsible || (n.collapsible = {
                on: !1,
                collapsed: !1
            }), n.flexHeight && (n.height = "flex"), n.flexWidth && (n.width = "flex"), o.sortIndx) {
            c.on = n.sortable, c.type = o.sorting;
            var u = [],
                h = o.sortIndx,
                f = o.sortDir;
            if (t.isArray(h)) {
                for (var p = 0; p < h.length; p++) {
                    var g = f && f[p] ? f[p] : "up";
                    u.push({
                        dataIndx: h[p],
                        dir: g
                    })
                }
                c.single = !1
            } else {
                var g = f ? f : "up";
                u.push({
                    dataIndx: h,
                    dir: g
                }), c.single = !0
            }
            c.sorter = u
        }
        this.iRefresh = new r.cRefresh(this), this.iKeyNav = new r.cKeyNav(this), this.iValid = new r.cValid(this), this.tables = [], this.$tbl = null, this.iCols = new r.cColModel(this), this.iSort = new r.cSort(this), this._initTypeColumns(), i.on("scroll" + this.eventNamespace, function() {
            this.scrollLeft = 0, this.scrollTop = 0;
        }).on("mousedown" + this.eventNamespace, this._mouseDown.bind(this));
        var v = l ? a.grid : d.grid,
            m = l ? "" : d.header_o,
            w = l ? "" : d.bottom,
            x = l ? a.top : d.top;
        i.empty().attr("role", "grid").addClass("pq-grid pq-theme " + v + " " + (s ? " ui-corner-all" : "")).html(["<div class='pq-grid-top ", x, " ", s ? " ui-corner-top" : "", "'>", "<div class='pq-grid-title", s ? " ui-corner-top" : "", "'>&nbsp;</div>", "</div>", "<div class='pq-grid-center-o'>", "<div class='pq-tool-panel' style='display:", n.toolPanel.show ? "" : "none", ";'></div>", "<div class='pq-grid-center' >", "<div class='pq-header-outer ", m, "'></div>", "<div class='pq-body-outer' tabindex='0' ></div>", "<div class='pq-summary-outer' ></div>", "</div>", "<div style='clear:both;'></div>", "</div>", "<div class='pq-grid-bottom ", w, " ", s ? " ui-corner-bottom" : "", "'>", "<div class='pq-grid-footer'></div>", "</div>"].join("")), this.$bottom = t(".pq-grid-bottom", i), this.$summary = t(".pq-summary-outer", i), this.$toolPanel = i.find(".pq-tool-panel"), this.$top = t("div.pq-grid-top", i), n.showTop || this.$top.css("display", "none"), this.$title = t("div.pq-grid-title", i), n.showTitle || this.$title.css("display", "none");
        var y = this.$grid_center = t(".pq-grid-center", i).on("scroll", function() {
            this.scrollTop = 0
        });
        this.addTouch();
        var C = this.$header = t(".pq-header-outer", y).on("scroll", function() {
            this.scrollTop = 0, this.scrollLeft = 0
        });
        this.iHeader = new r.cHeader(this, C), this.$footer = t(".pq-grid-footer", i);
        var b = this.$cont = t(".pq-body-outer", y);
        this.iRenderB = new pq.cRenderBody(e, {
            $center: y,
            $b: b,
            $sum: this.$summary,
            header: !0,
            $h: this.$header
        }), this._trigger("render", null, {
            dataModel: this.options.dataModel,
            colModel: this.colModel
        }), C.on("contextmenu", ".pq-grid-col", function(t) {
            return e.evtBelongs(t) ? e._onHeadRightClick(t) : void 0
        }), b.on("click", ".pq-grid-cell,.pq-grid-number-cell", function(n) {
            return t.data(n.target, e.widgetName + ".preventClickEvent") !== !0 && e.evtBelongs(n) ? e._onClickCell(n) : void 0
        }).on("contextmenu", ".pq-grid-cell,.pq-grid-number-cell", function(t) {
            return e.evtBelongs(t) ? e._onRightClick(t) : void 0
        }).on("dblclick", ".pq-grid-cell", function(t) {
            return e.evtBelongs(t) ? e._onDblClickCell(t) : void 0
        }), b.on("focusout", function() {
            e.onblur()
        }).on("focus", function(t) {
            e.onfocus(t)
        }).on("mousedown", e._onMouseDown(e)).on("change", e._onChange(e)).on("mouseenter", ".pq-grid-cell", e._onCellMouseEnter(e)).on("mouseenter", ".pq-grid-row", e._onRowMouseEnter(e)).on("mouseleave", ".pq-grid-cell", e._onCellMouseLeave(e)).on("mouseleave", ".pq-grid-row", e._onRowMouseLeave(e)).on("keyup", e._onKeyUp(e)), n.selectionModel["native"] || this.disableSelection(), y.bind("keydown.pq-grid", e._onKeyPressDown(e)), this._refreshTitle(), this.iRows = new r.cRows(this), this.generateLoading(), this._initPager(), this._refreshResizable(), this._refreshDraggable(), this.iResizeColumns = new r.cResizeColumns(this)
    }, o.addTouch = function() {
        var e, n, i;
        "ontouchend" in document && (i = this.$grid_center[0], i.addEventListener("touchstart", function(i) {
            var r = i.target,
                o = i.changedTouches[0],
                a = t.Event("mousedown", o);
            if (t(r).trigger(a), e) {
                if (r && r == e.target) {
                    var l = e.x - o.pageX,
                        s = e.y - o.pageY,
                        d = Math.sqrt(l * l + s * s);
                    12 >= d && (n = e, setTimeout(function() {
                        n = null
                    }, 500))
                }
            } else e = {
                x: o.pageX,
                y: o.pageY,
                target: r
            }, setTimeout(function() {
                e = null
            }, 400)
        }, !0), i.addEventListener("touchend", function(e) {
            var i = e.target;
            n && i == n.target && t(i).trigger("dblclick", e)
        }))
    }, o._mouseDown = function(e) {
        var n = this;
        return t(e.target).closest(".pq-editor-focus").length ? (this._blurEditMode = !0, void window.setTimeout(function() {
            n._blurEditMode = !1
        }, 0)) : void 0
    }, o.destroy = function() {
        this._trigger("destroy"), this._super(), t(window).off("resize" + this.eventNamespace);
        for (var e in this) delete this[e];
        this.options = void 0, t.fragments = {}
    }, o._setOption = function(t, e) {
        var n, i = this.options,
            r = function() {
                i[t] = e
            },
            o = this.iRenderB,
            a = this.iRenderSum,
            l = this.iRenderHead,
            s = function(t) {
                return t ? "addClass" : "removeClass"
            },
            d = i.dataModel;
        if ("height" === t) r(), this._refreshResizable();
        else if ("width" === t) r(), this._refreshResizable();
        else if ("title" == t) r(), this._refreshTitle();
        else if ("roundCorners" == t) {
            r();
            var c = s(e);
            this.element[c]("ui-corner-all"), this.$top[c]("ui-corner-top"), this.$bottom[c]("ui-corner-bottom")
        } else if ("freezeCols" == t) e = parseInt(e), !isNaN(e) && e >= 0 && e <= this.colModel.length - 2 && r();
        else if ("freezeRows" == t) e = parseInt(e), !isNaN(e) && e >= 0 && r();
        else if ("resizable" == t) r(), this._refreshResizable();
        else if ("draggable" == t) r(), this._refreshDraggable();
        else if ("dataModel" == t) e.data !== d.data && d.dataUF && (d.dataUF.length = 0), r();
        else {
            if ("groupModel" == t) throw "use groupOption() to set groupModel options.";
            if ("treeModel" == t) throw "use treeOption() to set treeModel options.";
            if ("pageModel" == t) r();
            else if ("colModel" === t || "columnTemplate" == t) r(), this.iCols.init();
            else if ("disabled" === t) this._super(t, e), e === !0 ? this._disable() : this._enable();
            else if ("strLoading" === t) r(), this._refreshLoadingString();
            else if ("showTop" === t) r(), this.$top.css("display", e ? "" : "none");
            else if ("showTitle" === t) r(), this.$title.css("display", e ? "" : "none");
            else if ("showToolbar" === t) {
                r();
                var u = this._toolbar.widget();
                u.css("display", e ? "" : "none")
            } else "collapsible" === t ? (r(), this._createCollapse()) : "showBottom" === t ? (r(), this.$bottom.css("display", e ? "" : "none")) : "wrap" == t || "hwrap" == t ? ("wrap" == t ? o.$tbl.add(a.$tbl) : l.$tbl)[s(!e)]("pq-no-wrap") : "rowBorders" === t ? (r(), c = s(e), n = "pq-td-border-top", o.$tbl[c](n), a.$tbl[c](n)) : "columnBorders" === t ? (r(), c = s(e), n = "pq-td-border-right", o.$tbl[c](n), a.$tbl[c](n)) : r()
        }
        return this
    }, o.options = {
        cancel: "input,textarea,button,select,option,.pq-no-capture,.ui-resizable-handle",
        trigger: !1,
        bootstrap: {
            on: !1,
            thead: "table table-striped table-condensed table-bordered",
            tbody: "table table-condensed",
            grid: "panel panel-default",
            top: "",
            btn: "btn btn-default",
            groupModel: {
                icon: ["glyphicon-triangle-bottom", "glyphicon-triangle-right"]
            },
            header_active: "active"
        },
        ui: {
            on: !0,
            grid: "ui-widget ui-widget-content",
            top: "ui-widget-header",
            bottom: "ui-widget-header",
            header_o: "ui-widget-header",
            header: "ui-state-default",
            header_active: "ui-state-active"
        },
        collapsible: {
            on: !0,
            toggle: !0,
            collapsed: !1,
            _collapsed: !1,
            refreshAfterExpand: !0,
            css: {
                zIndex: 1e3
            }
        },
        colModel: null,
        columnBorders: !0,
        dataModel: {
            data: [],
            dataUF: [],
            cache: !1,
            dataType: "JSON",
            location: "local",
            sorting: "local",
            sortDir: "up",
            method: "GET"
        },
        direction: "",
        draggable: !1,
        editable: !0,
        editModel: {
            cellBorderWidth: 0,
            pressToEdit: !0,
            clicksToEdit: 2,
            filterKeys: !0,
            keyUpDown: !0,
            reInt: /^([\-]?[1-9][0-9]*|[\-]?[0-9]?)$/,
            reFloat: /^[\-]?[0-9]*\.?[0-9]*$/,
            onBlur: "validate",
            saveKey: t.ui.keyCode.ENTER,
            onSave: "nextFocus",
            onTab: "nextFocus",
            allowInvalid: !1,
            invalidClass: "pq-cell-red-tr pq-has-tooltip",
            warnClass: "pq-cell-blue-tr pq-has-tooltip",
            validate: !0
        },
        editor: {
            select: !1,
            type: "textbox"
        },
        summaryOptions: {
            number: "avg,max,min,stdev,stdevp,sum",
            date: "count,max,min",
            string: "count"
        },
        summaryTitle: {
            avg: "Avg: {0}",
            count: "Count: {0}",
            max: "Max: {0}",
            min: "Min: {0}",
            stdev: "Stdev: {0}",
            stdevp: "Stdevp: {0}",
            sum: "Sum: {0}"
        },
        validation: {
            icon: "ui-icon-alert",
            cls: "ui-state-error",
            style: "padding:3px 10px;"
        },
        warning: {
            icon: "ui-icon-info",
            cls: "",
            style: "padding:3px 10px;"
        },
        freezeCols: 0,
        freezeRows: 0,
        freezeBorders: !0,
        calcDataIndxFromColIndx: !0,
        height: 400,
        hoverMode: "null",
        maxColWidth: 2e3,
        minColWidth: 50,
        minWidth: 100,
        menuUI: {
            tabs: ["hideCols", "filter"],
            buttons: ["clear", "ok"],
            gridOptions: {
                autoRow: !1,
                copyModel: {
                    render: !0
                },
                editable: function(t) {
                    return !t.rowData.pq_disabled
                },
                fillHandle: "",
                filterModel: {
                    header: !0,
                    on: !0
                },
                hoverMode: "row",
                hwrap: !1,
                rowBorders: !1,
                rowHt: 22,
                rowHtHead: 23,
                scrollModel: {
                    autoFit: !0
                },
                showTop: !1,
                height: 300,
                wrap: !1
            }
        },
        numberCell: {
            width: 30,
            title: "",
            resizable: !0,
            minWidth: 30,
            maxWidth: 100,
            show: !0
        },
        pageModel: {
            curPage: 1,
            totalPages: 0,
            rPP: 10,
            rPPOptions: [10, 20, 50, 100]
        },
        resizable: !1,
        roundCorners: !0,
        rowBorders: !0,
        autoRow: !0,
        scrollModel: {
            autoFit: !1
        },
        selectionModel: {
            type: "cell",
            onTab: "nextFocus",
            row: !0,
            mode: "block"
        },
        showBottom: !0,
        showHeader: !0,
        showTitle: !0,
        showToolbar: !0,
        showTop: !0,
        sortable: !0,
        sql: !1,
        stripeRows: !0,
        title: "&nbsp;",
        treeModel: null,
        width: "auto",
        wrap: !0,
        hwrap: !0
    }, t.widget("paramquery._pqGrid", o);
    var a = r._pqGrid.prototype;
    a.refreshCM = function(t, e) {
        t && (this.options.colModel = t), this.iCols.init(e)
    }, a.evtBelongs = function(e) {
        return t(e.target).closest(".pq-grid")[0] == this.element[0]
    }, a.readCell = function(t, e, n, i, r) {
        return n && n.isRootCell(i, r, "o") === !1 ? void 0 : t[e.dataIndx]
    }, a.saveCell = function(t, e, n) {
        var i = e.dataIndx;
        t[i] = n
    }, a._destroyResizable = function() {
        var t = this.element,
            e = t.data();
        (e.resizable || e.uiResizable || e["ui-resizable"]) && t.resizable("destroy")
    }, a._disable = function() {
        null == this.$disable && (this.$disable = t("<div class='pq-grid-disable'></div>").css("opacity", .2).appendTo(this.element))
    }, a._enable = function() {
        this.$disable && (this.element[0].removeChild(this.$disable[0]), this.$disable = null)
    }, a._destroy = function() {
        this.loading && this.xhr.abort(), this._destroyResizable(), this._destroyDraggable(), this.element.off(this.eventNamespace), t(window).unbind(this.eventNamespace), t(document).unbind(this.eventNamespace), this.element.empty().css("height", "").css("width", "").removeClass("pq-grid ui-widget ui-widget-content ui-corner-all").removeData()
    }, a.addColumn = function(t) {
        var e = t.columns || [t.column],
            n = this.options,
            i = n.colModel,
            r = i.concat(e);
        this.refreshCM(r), this._trigger("addColumn"), t.refresh !== !1 && this.refresh()
    }, a.deleteColumn = function(t) {
        for (var e = t.colList || [{
                colIndx: t.colIndx
            }], n = t.history !== !1, i = this.options, r = i.colModel, o = e.length - 1; o >= 0; o--) {
            var a = e[o],
                l = a.colIndx,
                s = r.splice(l, 1)[0];
            a.column = s
        }
        this.iCols.init(), n && (this.iHistory.increment(), e.type = "delete", this.iHistory.push({
            colList: e
        })), this._trigger("deleteColumn", null, {
            colList: e
        }), t.refresh !== !1 && this.refreshView()
    }, a._onKeyUp = function(t) {
        return function(e) {
            t.evtBelongs(e) && t._trigger("keyUp", e, null)
        }
    }, a.onKeyPressDown = function(e) {
        var n = this,
            i = t(e.target).closest(".pq-header-outer");
        return i.length ? n._trigger("headerKeyDown", e, null) : void(n.iKeyNav.bodyKeyPressDown(e) !== !1 && 0 == n._trigger("keyDown", e, null))
    }, a._onKeyPressDown = function(t) {
        return function(e) {
            t.evtBelongs(e) && t.onKeyPressDown(e, t)
        }
    }, a.collapse = function(t) {
        var e = this,
            n = this.element,
            i = this.options,
            r = i.collapsible,
            o = r.$collapse.children("span"),
            a = function() {
                n.css("overflow", "hidden"), o.addClass("ui-icon-circle-triangle-s").removeClass("ui-icon-circle-triangle-n"), n.hasClass("ui-resizable") && n.resizable("destroy"), e._toolbar && e._toolbar.disable(), r.collapsed = !0, r._collapsed = !0, r.animating = !1, e._trigger("collapse")
            };
        return t = t ? t : {}, r._collapsed ? !1 : (r.htCapture = n.height(), void(t.animate === !1 ? (n.height(23), a()) : (r.animating = !0, n.animate({
            height: "23px"
        }, function() {
            a()
        }))))
    }, a.expand = function(t) {
        var e = this,
            n = this.element,
            i = this.options,
            r = i.collapsible,
            o = r.htCapture,
            a = r.$collapse.children("span"),
            l = function() {
                n.css("overflow", ""), r._collapsed = !1, r.collapsed = !1, e._refreshResizable(), r.refreshAfterExpand && e.refresh(), a.addClass("ui-icon-circle-triangle-n").removeClass("ui-icon-circle-triangle-s"), e._toolbar && e._toolbar.enable(), r.animating = !1, e._trigger("expand")
            };
        return t = t ? t : {}, r._collapsed === !1 ? !1 : void(t.animate === !1 ? (n.height(o), l()) : (r.animating = !0, n.animate({
            height: o
        }, function() {
            l()
        })))
    }, a._createCollapse = function() {
        var i = this,
            r = this.$top,
            o = this.options,
            a = this.BS_on,
            l = o.collapsible;
        if (!l.$stripe) {
            var s = t(["<div class='pq-slider-icon pq-no-capture'  >", "</div>"].join("")).appendTo(r);
            l.$stripe = s
        }
        l.on ? l.$collapse || (l.$collapse = t(a ? e("collapse-down") : n("circle-triangle-n")).appendTo(l.$stripe).click(function(t) {
            l.collapsed ? i.expand() : i.collapse()
        })) : l.$collapse && (l.$collapse.remove(), delete l.$collapse), l.collapsed && !l._collapsed ? i.collapse({
            animate: !1
        }) : !l.collapsed && l._collapsed && i.expand({
            animate: !1
        }), l.toggle ? l.$toggle || (l.$toggle = t(a ? e("fullscreen") : n("arrow-4-diag")).prependTo(l.$stripe).click(function(t) {
            i.toggle()
        })) : l.$toggle && (l.$toggle.remove(), delete l.$toggle)
    }, a.toggle = function() {
        var e, n = this.options,
            i = n.collapsible,
            r = this.element,
            o = this._maxim,
            e = o ? "min" : "max",
            a = t(document.body);
        if (this._trigger("beforeToggle", null, {
                state: e
            }) === !1) return !1;
        if ("min" == e) {
            var l = o.eleObj,
                s = o.docObj;
            this.option({
                height: l.height,
                width: l.width,
                maxHeight: l.maxHeight,
                maxWidth: l.maxWidth
            }), r[0].style.cssText = l.cssText, a[0].style.cssText = s.cssText, t("html").css({
                overflow: "visible"
            }), window.scrollTo(s.scrollLeft, s.scrollTop), this._maxim = null
        } else {
            var l = {
                height: n.height,
                width: n.width,
                cssText: r[0].style.cssText,
                maxHeight: n.maxHeight,
                maxWidth: n.maxWidth
            };
            this.option({
                height: "100%",
                width: "100%",
                maxHeight: null,
                maxWidth: null
            }), r.css(t.extend({
                position: "fixed",
                left: 0,
                top: 0,
                margin: 0
            }, i.css));
            var s = {
                scrollLeft: t(window).scrollLeft(),
                scrollTop: t(window).scrollTop(),
                cssText: a[0].style.cssText
            };
            a.css({
                height: 0,
                width: 0,
                overflow: "hidden",
                position: "static"
            }), t("html").css({
                overflow: "hidden"
            }), window.scrollTo(0, 0), this._maxim = {
                eleObj: l,
                docObj: s
            }
        }
        this._trigger("toggle", null, {
            state: e
        }), this._refreshResizable(), this.refresh(), t(window).trigger("resize", {
            $grid: r,
            state: e
        })
    }, a._mousePQUp = function(e) {
        t(document).unbind("mouseup" + this.eventNamespace, this._mousePQUpDelegate), this._trigger("mousePQUp", e, null)
    }, a._onDblClickCell = function(e) {
        var n = this,
            i = t(e.currentTarget),
            r = n.getCellIndices({
                $td: i
            });
        r.$td = i, 0 != n._trigger("cellDblClick", e, r) && (n.options.editModel.clicksToEdit > 1 && n.isEditable(r) && n.editCell(r), r.$tr = i.closest(".pq-grid-row"), n._trigger("rowDblClick", e, r))
    }, a.getValueFromDataType = function(e, n, i) {
        if ("=" == (e + "")[0]) return e;
        var r;
        if ("date" == n) return r = Date.parse(e), isNaN(r) ? void 0 : i ? r : e;
        if ("integer" == n) r = parseInt(e);
        else {
            if ("float" != n) return "bool" == n ? null == e ? e : (r = t.trim(e).toLowerCase(), 0 == r.length ? null : "true" == r || "yes" == r || "1" == r ? !0 : "false" == r || "no" == r || "0" == r ? !1 : Boolean(r)) : "object" == n ? e : null == e ? e : t.trim(e);
            r = parseFloat(e)
        }
        return isNaN(r) || null == r ? null == e ? e : null : r
    }, a.isValid = function(t) {
        return this.iValid.isValid(t)
    }, a.isValidChange = function(t) {
        t = t || {};
        var e = this.getChanges(),
            n = e.addList,
            i = e.updateList,
            r = i.concat(n);
        return t.data = r, this.isValid(t)
    }, a.isEditableRow = function(t) {
        var e = this.options.editable;
        return "function" == typeof e ? e.call(this, this.normalize(t)) : e
    }, a.isEditableCell = function(t) {
        var e, n, i = t.column;
        return i || (e = this.normalize(t), i = e.column), n = i.editable, null != n ? "function" == typeof n ? (e = e || this.normalize(t), this.callFn(n, e)) : n : void 0
    }, a.isEditable = function(t) {
        var e = this.isEditableCell(t);
        return null == e ? this.isEditableRow(t) : e
    }, a._onMouseDownCont = function(e) {
        var n, i, r = this;
        r.blurEditor({
            blurIfFocus: !0
        }), r._mousePQUpDelegate = function(t) {
            return r._mousePQUp(t)
        }, t(document).bind("mouseup" + r.eventNamespace, r._mousePQUpDelegate), n = r.pdata, n && n.length || (i = r.$cont[0], i.setAttribute("tabindex", 0), i.focus())
    }, a._onMouseDown = function(e) {
        return function(n) {
            if ((!n.which || 1 == n.which) && e.evtBelongs(n)) {
                var i, r, o = t(n.target),
                    a = o.closest(".pq-grid-cell,.pq-grid-number-cell");
                if (a.length && (n.currentTarget = a[0], i = e._onMouseDownCell(n)), n.isPropagationStopped()) return;
                if (r = o.closest(".pq-grid-row"), r.length && (n.currentTarget = r[0], i = e._onMouseDownRow(n)), n.isPropagationStopped()) return;
                e._onMouseDownCont(n)
            }
        }
    }, a._onMouseDownCell = function(e) {
        var n, i = this,
            r = t(e.currentTarget),
            o = i.getCellIndices({
                $td: r
            });
        null != o.rowIndx && (n = this.iMerge.getRootCellO(o.rowIndx, o.colIndx, !0), n.$td = r, i._trigger("cellMouseDown", e, n))
    }, a._onMouseDownRow = function(e) {
        var n = this,
            i = t(e.currentTarget),
            r = n.getRowIndx({
                $tr: i
            });
        r.$tr = i, n._trigger("rowMouseDown", e, r)
    }, a._onCellMouseEnter = function(e) {
        return function(n) {
            if (e.evtBelongs(n)) {
                var i = t(this),
                    r = e.options,
                    o = e.getCellIndices({
                        $td: i
                    });
                if (null == o.rowIndx || null == o.colIndx) return;
                if (e._trigger("cellMouseEnter", n, o) === !1) return;
                return "cell" == r.hoverMode && e.highlightCell(i), !0
            }
        }
    }, a._onChange = function(e) {
        function n() {
            if (i && r && r.target == i.target) {
                var t, n = {
                    ctrlKey: 0,
                    metaKey: 0,
                    shiftKey: 0,
                    altKey: 0
                };
                for (t in n) r[t] = i[t];
                e._trigger("valChange", r, o), r = i = void 0
            }
        }
        var i, r, o;
        return e.on("cellClickDone", function(t) {
                i = t.originalEvent, n()
            }),
            function(i) {
                if (e.evtBelongs(i)) {
                    var a = t(i.target),
                        l = a.closest(".pq-grid-cell");
                    l.length && (o = e.getCellIndices({
                        $td: l
                    }), o = e.normalize(o), o.input = a[0], r = i, n())
                }
            }
    }, a._onRowMouseEnter = function(e) {
        return function(n) {
            if (e.evtBelongs(n)) {
                var i = t(this),
                    r = e.options,
                    o = e.getRowIndx({
                        $tr: i
                    }),
                    a = o.rowIndxPage;
                if (e._trigger("rowMouseEnter", n, o) === !1) return;
                return "row" == r.hoverMode && e.highlightRow(a), !0
            }
        }
    }, a._onCellMouseLeave = function(e) {
        return function(n) {
            if (e.evtBelongs(n)) {
                var i = t(this);
                "cell" == e.options.hoverMode && e.unHighlightCell(i)
            }
        }
    }, a._onRowMouseLeave = function(e) {
        return function(n) {
            if (e.evtBelongs(n)) {
                var i = t(this),
                    r = e.getRowIndx({
                        $tr: i
                    }),
                    o = r.rowIndxPage;
                if (e._trigger("rowMouseLeave", n, {
                        $tr: i,
                        rowIndx: r.rowIndx,
                        rowIndxPage: o
                    }) === !1) return;
                "row" == e.options.hoverMode && e.unHighlightRow(o)
            }
        }
    }, a.enableSelection = function() {
        this.element.removeClass("pq-disable-select").off("selectstart" + this.eventNamespace)
    }, a.disableSelection = function() {
        this.element.addClass("pq-disable-select").on("selectstart" + this.eventNamespace, function(e) {
            var n = e.target;
            if (n) {
                var i = t(e.target);
                return i.is("input,textarea,select") ? !0 : i.closest(".pq-native-select").length ? !0 : void e.preventDefault()
            }
        })
    }, a._onClickCell = function(e) {
        var n = this,
            i = n.options,
            r = i.editModel,
            o = t(e.currentTarget),
            a = n.getCellIndices({
                $td: o
            }),
            l = n.normalize(a),
            s = l.colIndx;
        l.$td = o, l.evt = e, 0 != n._trigger("beforeCellClick", e, l) && (n._trigger("cellClick", e, l), null == s || 0 > s || (1 == r.clicksToEdit && n.isEditable(l) && n.editCell(l), l.$tr = o.closest(".pq-grid-row"), n._trigger("rowClick", e, l)))
    }, a._onHeadRightClick = function(e) {
        var n = t(e.currentTarget),
            i = this.iRenderB.getCellIndx(n[0]),
            r = i[0],
            o = i[1],
            a = this.headerCells,
            l = a[r] || a[r - 1],
            s = l[o],
            d = {
                rowIndx: r,
                colIndx: o,
                column: s,
                $th: n,
                filterRow: !a[r]
            };
        this._trigger("headRightClick", e, d)
    }, a._onRightClick = function(e) {
        var n = t(e.currentTarget),
            i = this.getCellIndices({
                $td: n
            });
        i.$td = n, 0 != this._trigger("cellRightClick", e, i) && (i.$tr = n.closest(".pq-grid-row"), this._trigger("rowRightClick", e, i))
    }, a.highlightCell = function(t) {
        t.addClass("pq-grid-cell-hover ui-state-hover")
    }, a.unHighlightCell = function(t) {
        t.removeClass("pq-grid-cell-hover ui-state-hover")
    }, a.highlightRow = function(t) {
        if (isNaN(t));
        else {
            var e = this.getRow({
                rowIndxPage: t
            });
            e && e.addClass("pq-grid-row-hover ui-state-hover")
        }
    }, a.unHighlightRow = function(t) {
        if (isNaN(t));
        else {
            var e = this.getRow({
                rowIndxPage: t
            });
            e && e.removeClass("pq-grid-row-hover ui-state-hover")
        }
    }, a._getCreateEventData = function() {
        return {
            dataModel: this.options.dataModel,
            data: this.pdata,
            colModel: this.options.colModel
        }
    }, a._initPager = function() {
        var e = this,
            n = e.options,
            i = n.pageModel;
        if (i.type) {
            var r = {
                bootstrap: n.bootstrap,
                change: function(t, n) {
                    e.blurEditor({
                        force: !0
                    });
                    var i = e.options.pageModel;
                    void 0 != n.curPage && (i.prevPage = i.curPage, i.curPage = n.curPage), void 0 != n.rPP && (i.rPP = n.rPP), "remote" == i.type ? e.remoteRequest({
                        callback: function() {
                            e._onDataAvailable({
                                apply: !0,
                                header: !1
                            })
                        }
                    }) : e.refreshView({
                        header: !1,
                        source: "pager"
                    })
                },
                refresh: function(t) {
                    e.refreshDataAndView()
                }
            };
            r = t.extend(r, i), this.pagerW = pq.pager(i.appendTo ? i.appendTo : this.$footer, r).on("destroy", function() {
                delete e.pagerW
            })
        }
    }, a.generateLoading = function() {
        this.$loading && this.$loading.remove(), this.$loading = t("<div class='pq-loading'></div>").appendTo(this.element), t(["<div class='pq-loading-bg'></div><div class='pq-loading-mask ui-state-highlight'><div>", this.options.strLoading, "...</div></div>"].join("")).appendTo(this.$loading), this.$loading.find("div.pq-loading-bg").css("opacity", .2)
    }, a._refreshLoadingString = function() {
        this.$loading.find("div.pq-loading-mask").children("div").html(this.options.strLoading)
    }, a.showLoading = function() {
        null == this.showLoadingCounter && (this.showLoadingCounter = 0), this.showLoadingCounter++, this.$loading.show()
    }, a.hideLoading = function() {
        this.showLoadingCounter > 0 && this.showLoadingCounter--, this.showLoadingCounter || this.$loading.hide()
    }, a.getTotalRows = function() {
        var t = this.options,
            e = t.dataModel,
            n = e.data || [],
            i = e.dataUF || [],
            r = t.pageModel;
        return "remote" == r.location ? r.totalRecords : n.length + i.length
    }, a.refreshDataFromDataModel = function(t) {
        t = t || {};
        var e, n, i, r, o, a = this,
            l = a.options,
            s = l.dataModel,
            d = l.pageModel,
            c = s.data,
            u = d.type,
            h = a._queueATriggers;
        for (var f in h) {
            var p = h[f];
            delete h[f], a._trigger(f, p.evt, p.ui)
        }
        if (a._trigger("beforeRefreshData", null, {}), "local" == u) r = d.totalRecords = c.length, d.totalPages = i = Math.ceil(r / d.rPP), d.curPage > i && (d.curPage = i), i && !d.curPage && (d.curPage = 1), e = (d.curPage - 1) * d.rPP, e = e >= 0 ? e : 0, n = d.curPage * d.rPP, n > c.length && (n = c.length), a.pdata = c.slice(e, n), o = e;
        else if ("remote" == u) {
            d.totalPages = i = Math.ceil(d.totalRecords / d.rPP), d.curPage > i && (d.curPage = i), i && !d.curPage && (d.curPage = 1);
            var n = d.rPP;
            n > c.length && (n = c.length), a.pdata = c.slice(0, n), o = d.rPP * (d.curPage - 1)
        } else l.backwardCompat ? a.pdata = c.slice(0) : a.pdata = c;
        a.riOffset = o >= 0 ? o : 0, a._trigger("dataReady", null, {
            source: t.source
        }), a._trigger("dataReadyAfter", null, {
            source: t.source
        })
    }, a.getQueryStringCRUD = function() {
        return ""
    }, a.remoteRequest = function(e) {
        this.loading && this.xhr.abort(), e = e || {};
        var n = this,
            i = "",
            r = "",
            o = this.options,
            a = !1,
            l = this.colModel,
            s = o.dataModel,
            d = o.sortModel,
            c = o.filterModel,
            u = o.pageModel;
        if ("function" == typeof s.getUrl) {
            var h = {
                    colModel: l,
                    dataModel: s,
                    sortModel: d,
                    groupModel: o.groupModel,
                    pageModel: u,
                    filterModel: c
                },
                f = s.getUrl.call(this, h);
            f && f.url && (i = f.url), f && f.data && (r = f.data)
        } else if ("string" == typeof s.url) {
            i = s.url;
            var p = {},
                g = {},
                v = {};
            if ("remote" == d.type) {
                e.initBySort || this.sort({
                    initByRemote: !0
                });
                var m = this.iSort.getQueryStringSort();
                m && (p = {
                    pq_sort: m
                })
            }
            "remote" == u.type && (v = {
                pq_curpage: u.curPage,
                pq_rpp: u.rPP
            });
            var w;
            "local" != c.type && (w = this.iFilterData.getQueryStringFilter(), w && (a = !0, g = {
                pq_filter: w
            }));
            var x = s.postData,
                y = s.postDataOnce;
            x && "function" == typeof x && (x = x.call(this, {
                colModel: l,
                dataModel: s
            })), r = t.extend({
                pq_datatype: s.dataType
            }, g, v, p, x, y)
        }
        i && (this.loading = !0, this.showLoading(), this.xhr = t.ajax({
            url: i,
            dataType: s.dataType,
            async: null == s.async ? !0 : s.async,
            cache: s.cache,
            contentType: s.contentType,
            type: s.method,
            data: r,
            beforeSend: function(t, e) {
                return "function" == typeof s.beforeSend ? s.beforeSend.call(n, t, e) : void 0
            },
            success: function(t, i, r) {
                n.onRemoteSuccess(t, i, r, a, e)
            },
            error: function(t, e, i) {
                if (n.hideLoading(), n.loading = !1, "function" == typeof s.error) s.error.call(n, t, e, i);
                else if ("abort" != i) throw "Error : " + i
            }
        }))
    }, a.onRemoteSuccess = function(t, e, n, i, r) {
        var o, a = this,
            l = a.options,
            s = a.colModel,
            d = l.pageModel,
            c = l.dataModel;
        o = "function" == typeof c.getData ? c.getData.call(a, t, e, n) : t, c.data = o.data, "remote" == d.type && (null != o.curPage && (d.curPage = o.curPage), null != o.totalRecords && (d.totalRecords = o.totalRecords)), a.hideLoading(), a.loading = !1, a._trigger("load", null, {
            dataModel: c,
            colModel: s
        }), i && (a._queueATriggers.filter = {
            ui: {}
        }), r.callback && r.callback()
    }, a._refreshTitle = function() {
        this.$title.html(this.options.title)
    }, a._destroyDraggable = function() {
        var t = this.element,
            e = t.parent(".pq-wrapper");
        e.length && e.data("draggable") && (e.draggable("destroy"), this.$title.removeClass("pq-draggable pq-no-capture"), t.unwrap(".pq-wrapper"))
    }, a._refreshDraggable = function() {
        var t = this.options,
            e = this.element,
            n = this.$title;
        if (t.draggable) {
            n.addClass("pq-draggable pq-no-capture");
            var i = e.parent(".pq-wrapper");
            i.length || e.wrap("<div class='pq-wrapper' />"), e.parent(".pq-wrapper").draggable({
                handle: n
            })
        } else this._destroyDraggable()
    }, a._refreshResizable = function() {
        var e = this,
            n = this.element,
            i = this.options,
            r = (i.width + "").indexOf("%") > -1,
            o = (i.height + "").indexOf("%") > -1,
            a = "auto" == i.width,
            l = "flex" == i.width,
            s = "flex" == i.height;
        if (!i.resizable || (s || o) && (l || r || a)) this._destroyResizable();
        else {
            var d = "e,s,se";
            s || o ? d = "e" : (l || r || a) && (d = "s");
            var c = !0;
            if (n.hasClass("ui-resizable")) {
                var u = n.resizable("option", "handles");
                d == u ? c = !1 : this._destroyResizable()
            }
            c && n.resizable({
                helper: "ui-state-default",
                handles: d,
                minWidth: i.minWidth,
                minHeight: i.minHeight ? i.minHeight : 100,
                delay: 0,
                start: function(e, n) {
                    t(n.helper).css({
                        opacity: .5,
                        background: "#ccc",
                        border: "1px solid steelblue"
                    })
                },
                resize: function(t, e) {},
                stop: function(n, r) {
                    var o = e.element,
                        a = o[0],
                        l = i.width,
                        s = i.height,
                        d = (l + "").indexOf("%") > -1,
                        c = (s + "").indexOf("%") > -1,
                        u = "auto" == l,
                        h = "flex" == l,
                        f = "flex" == s,
                        p = !1;
                    a.style.width = a.offsetWidth + 3 + "px", a.style.height = a.offsetHeight + 3 + "px", c || f || (p = !0, i.height = a.offsetHeight), d || u || h || (p = !0, i.width = a.offsetWidth), e.refresh({
                        soft: !0
                    }), o.css("position", "relative"), p && t(window).trigger("resize")
                }
            })
        }
    }, a.refresh = function(t) {
        this.iRefresh.refresh(t)
    }, a.refreshView = function(t) {
        null != this.options.editModel.indices && this.blurEditor({
            force: !0
        }), this.refreshDataFromDataModel(t), this.refresh(t)
    }, a._refreshPager = function() {
        var t = this.options,
            e = t.pageModel,
            n = !!e.type,
            i = e.rPP,
            r = e.totalRecords;
        if (n) {
            var o = t.pageModel;
            this.pagerW || this._initPager(), this.pagerW.option(o), r > i ? this.$bottom.css("display", "") : t.showBottom || this.$bottom.css("display", "none")
        } else this.pagerW && this.pagerW.destroy(), t.showBottom ? this.$bottom.css("display", "") : this.$bottom.css("display", "none")
    }, a.getInstance = function() {
        return {
            grid: this
        }
    }, a.refreshDataAndView = function(t) {
        var e = this.options.dataModel;
        if (this.pdata = [], "remote" == e.location) {
            var n = this;
            this.remoteRequest({
                callback: function() {
                    n._onDataAvailable(t)
                }
            })
        } else this._onDataAvailable(t)
    }, a.getColIndx = function(t) {
        var e, n, i, r = t.dataIndx,
            o = t.column;
        if (o) n = !0;
        else {
            if (void 0 === r) throw "dataIndx / column NA";
            i = !0
        }
        var a = this.colModel,
            l = a.length;
        if (n) {
            for (var s = 0; l > s; s++)
                if (a[s] == o) return s
        } else if (e = this.colIndxs[r], null != e) return e;
        return -1
    }, a.getColumn = function(t) {
        var e = t.dataIndx;
        if (null == e) throw "dataIndx N/A";
        return this.columns[e] || this.iGroup.getColsPrimary()[e]
    }, a._generateCellRowOutline = function() {
        var e = this.options,
            n = e.editModel;
        if (!this.$div_focus) {
            var i = this.element;
            n.inline && (i = this.getCell(n.indices), i.css("padding", 0).empty()), this.$div_focus = t(["<div class='pq-editor-outer'>", "<div class='pq-editor-inner'>", "</div>", "</div>"].join("")).appendTo(i);
            var r = t.extend({
                    all: !0
                }, n.indices),
                o = this.getCell(r);
            o.css("height", o[0].offsetHeight), o.empty(), this.refreshEditorPos()
        }
    }, a.refreshEditorPos = function() {}, a._removeEditOutline = function(e) {
        function n(t) {
            t.hasClass("hasDatepicker") && t.datepicker("hide").datepicker("destroy")
        }
        if (this.$div_focus) {
            var i = this.$div_focus.find(".pq-editor-focus");
            if (n(i), i[0] == document.activeElement) {
                var r = this._blurEditMode;
                this._blurEditMode = !0, i.blur(), this._blurEditMode = r
            }
            this.$div_focus.remove(), delete this.$div_focus;
            var o = this.options.editModel,
                a = t.extend({}, o.indices);
            o.indices = null, a.rowData = void 0, this.refreshCell(a)
        }
    }, a.scrollX = function(t, e) {
        var n = this;
        return n.iRenderB.scrollX(t, function() {
            e && e.call(n)
        })
    }, a.scrollY = function(t, e) {
        var n = this;
        return n.iRenderB.scrollY(t, function() {
            e && e.call(n)
        })
    }, a.scrollXY = function(t, e, n) {
        var i = this;
        return i.iRenderB.scrollXY(t, e, function() {
            n && n.call(i)
        })
    }, a.scrollRow = function(t, e) {
        var n = this;
        n.iRenderB.scrollRow(n.normalize(t).rowIndxPage, function() {
            e && e.call(n)
        })
    }, a.scrollColumn = function(t, e) {
        var n = this;
        n.iRenderB.scrollColumn(n.normalize(t).colIndx, function() {
            e && e.call(n)
        })
    }, a.scrollCell = function(t, e) {
        var n = this,
            i = n.normalize(t);
        n.iRenderB.scrollCell(i.rowIndxPage, i.colIndx, function() {
            e && e.call(n), n._trigger("scrollCell")
        })
    }, a.blurEditor = function(t) {
        if (this.$div_focus) {
            var e = this.$div_focus.find(".pq-editor-focus");
            if (!t || !t.blurIfFocus) return e.triggerHandler("blur", t);
            document.activeElement == e[0] && e.blur()
        }
    }, a.Selection = function() {
        return this.iSelection
    }, a.goToPage = function(t) {
        var e = this.options.pageModel;
        if ("local" == e.type || "remote" == e.type) {
            var n = t.rowIndx,
                i = e.rPP,
                r = null == t.page ? Math.ceil((n + 1) / i) : t.page,
                o = e.curPage;
            r != o && (e.curPage = r, "local" == e.type ? this.refreshView() : this.refreshDataAndView())
        }
    }, a.setSelection = function(t, e) {
        if (null == t) return this.iSelection.removeAll(), this.iRows.removeAll({
            all: !0
        }), !0;
        var n = this,
            i = n.pdata,
            r = function() {
                null != a && t.focus !== !1 && n.focus({
                    rowIndxPage: a,
                    colIndx: null == l ? n.getFirstVisibleCI() : l
                }), e && e.call(n)
            };
        i && i.length || r(), t = this.normalize(t);
        var o = t.rowIndx,
            a = t.rowIndxPage,
            l = t.colIndx;
        (null == o || 0 > o || 0 > l || l >= this.colModel.length) && r(), this.goToPage(t), a = o - this.riOffset, n.scrollRow({
            rowIndxPage: a
        }, function() {
            null == l ? (n.iRows.add({
                rowIndx: o
            }), r()) : n.scrollColumn({
                colIndx: l
            }, function() {
                n.Range({
                    r1: o,
                    c1: l
                }).select(), r()
            })
        })
    }, a.getColModel = function() {
        return this.colModel
    }, a.getCMPrimary = function() {
        return this.iGroup.getCMPrimary()
    }, a.getOCMPrimary = function() {
        return this.iGroup.getOCMPrimary()
    }, a.saveEditCell = function(e) {
        var n = this.options,
            i = n.editModel;
        if (!i.indices) return null;
        var r, o = t.extend({}, i.indices),
            a = e ? e.evt : null,
            l = this.riOffset,
            s = o.colIndx,
            d = o.rowIndxPage,
            c = d + l,
            u = this.colModel,
            h = u[s],
            f = h.dataIndx,
            p = this.pdata,
            g = p[d],
            v = n.dataModel;
        if (null == g) return null;
        if (null != d) {
            var m = this.getEditCellData();
            if (t.isPlainObject(m)) {
                r = {};
                for (var w in m) r[w] = g[w]
            } else r = this.readCell(g, h);
            "<br>" == m && (m = ""), null == r && "" === m && (m = null);
            var x = {
                rowIndx: c,
                rowIndxPage: d,
                dataIndx: f,
                column: h,
                newVal: m,
                value: m,
                oldVal: r,
                rowData: g,
                dataModel: v
            };
            if (this._trigger("cellBeforeSave", a, x) === !1) return !1;
            var y = {};
            t.isPlainObject(m) ? y = m : y[f] = m;
            var C = this.updateRow({
                row: y,
                rowIndx: c,
                silent: !0,
                source: "edit",
                checkEditable: !1
            });
            return C === !1 ? !1 : (this._trigger("cellSave", a, x), !0)
        }
    }, a._addInvalid = function(t) {}, a._digestNewRow = function(t, e, n, i, r, o, a, l, s) {
        var d, c, u, h = this,
            f = h.getValueFromDataType,
            p = h.columns,
            g = h.colIndxs;
        for (d in t)
            if (c = p[d], u = g[d], c) {
                if (o && h.isEditable({
                        rowIndx: n,
                        rowData: i,
                        colIndx: u,
                        column: c
                    }) === !1) {
                    delete t[d], e && delete e[d];
                    continue
                }
                var v = c.dataType,
                    m = f(t[d], v),
                    w = e ? e[d] : void 0,
                    w = void 0 !== w ? f(w, v) : void 0;
                if (t[d] = m, a && c.validations)
                    if ("edit" == s && l === !1) {
                        var x = this.isValid({
                            focusInvalid: !0,
                            dataIndx: d,
                            rowIndx: n,
                            value: m
                        });
                        if (0 == x.valid && !x.warn) return !1
                    } else {
                        var y = "add" == r ? t : i,
                            x = this.iValid.isValidCell({
                                column: c,
                                rowData: y,
                                allowInvalid: l,
                                value: m
                            });
                        x.valid === !1 && (l !== !1 || x.warn || delete t[d])
                    }
                if ("update" == r && m === w) {
                    delete t[d], delete e[d];
                    continue
                }
            }
        return "update" != r ? !0 : pq.isEmpty(t) ? void 0 : !0
    }, a._digestData = function(t) {
        if (t.rowList) throw "not supported";
        if (R = t.addList = t.addList || [], t.updateList = t.updateList || [], t.deleteList = t.deleteList || [], R.length && R[0].rowData) throw "rd in addList";
        if (this._trigger("beforeValidate", null, t) === !1) return !1;
        var e, n, i, r, o = this,
            a = o.options,
            l = a.editModel,
            s = a.dataModel,
            d = s.data,
            c = a.colModel,
            u = a.pageModel,
            h = a.historyModel,
            f = c.map(function(t) {
                return t.dataIndx
            }),
            p = null == t.validate ? l.validate : t.validate,
            g = "remote" == u.type,
            v = null == t.allowInvalid ? l.allowInvalid : t.allowInvalid,
            m = a.trackModel,
            w = t.track,
            w = null == w ? null == a.track ? m.on : a.track : w,
            x = null == t.history ? h.on : t.history,
            y = this.iHistory,
            C = this.iUCData,
            b = null == t.checkEditable ? !0 : t.checkEditable,
            I = null == t.checkEditableAdd ? b : t.checkEditableAdd,
            _ = t.source,
            q = o.iRefresh,
            D = this.riOffset,
            R = t.addList,
            M = t.updateList,
            T = t.deleteList,
            k = [],
            E = [];
        for (!d && (d = s.data = []), i = 0, r = M.length; r > i; i++) {
            var S, P = M[i],
                $ = P.newRow,
                A = P.rowData,
                H = P.checkEditable,
                F = P.rowIndx,
                O = P.oldRow;
            if (null == H && (H = b), !O) throw "oldRow required while update";
            if (S = this._digestNewRow($, O, F, A, "update", H, p, v, _), S === !1) return !1;
            S && E.push(P)
        }
        for (i = 0, r = R.length; r > i; i++) {
            var A, O, P = R[i],
                $ = P.newRow,
                H = P.checkEditable,
                F = P.rowIndx;
            if (null == H && (H = I), f.forEach(function(t) {
                    $[t] = $[t]
                }), S = this._digestNewRow($, O, F, A, "add", H, p, v, _), S === !1) return !1;
            S && k.push(P)
        }
        return R = t.addList = k, M = t.updateList = E, e = R.length, n = T.length, e || M.length || n ? (x && (y.increment(), y.push(t)), o._digestUpdate(M, C, w), n && (o._digestDelete(T, C, w, d, u, g, D), q.addRowIndx()), e && (o._digestAdd(R, C, w, d, u, g, D), q.addRowIndx()), o._trigger("change", null, t), !0) : "edit" == _ ? null : !1
    }, a._digestUpdate = function(t, e, n) {
        for (var i, r, o, a = 0, l = t.length, s = this.columns, d = this.saveCell; l > a; a++) {
            var c = t[a],
                u = c.newRow,
                h = c.rowData;
            n && e.update({
                rowData: h,
                row: u,
                refresh: !1
            });
            for (o in u) i = s[o], r = u[o], d(h, i, r)
        }
    }, a._digestAdd = function(t, e, n, i, r, o, a) {
        var l, s, d = 0,
            c = t.length;
        for (t.sort(function(t, e) {
                return t.rowIndx - e.rowIndx
            }); c > d; d++) {
            var u = t[d],
                h = u.newRow,
                f = u.rowIndx;
            n && e.add({
                rowData: h
            }), null == f ? i.push(h) : (s = f - a, l = o ? s : f, i.splice(l, 0, h)), u.rowData = h, o && r.totalRecords++
        }
    }, a._digestDelete = function(t, e, n, i, r, o, a) {
        for (var l = 0, s = t.length; s > l; l++) {
            var d = t[l],
                c = d.rowData,
                u = this.getRowIndx({
                    rowData: c,
                    dataUF: !0
                }),
                h = u.uf,
                f = u.rowIndx;
            d.uf = h, d.rowIndx = f
        }
        for (t.sort(function(t, e) {
                return e.rowIndx - t.rowIndx
            }), l = 0; s > l; l++) {
            var d = t[l],
                c = d.rowData,
                h = d.uf,
                f = d.rowIndx;
            n && e["delete"]({
                rowIndx: f,
                rowData: c
            });
            var p = f - a,
                g = o ? p : f;
            if (h) DM.dataUF.splice(f, 1);
            else {
                var v = i.splice(g, 1);
                v && v.length && o && r.totalRecords--
            }
        }
    }, a.refreshColumn = function(t) {
        var e = this,
            n = e.normalize(t),
            i = e.iRenderB;
        n.skip = !0, i.eachV(function(t, i) {
            n.rowIndxPage = i, e.refreshCell(n);
        }), e._trigger("refreshColumn", null, n)
    }, a.refreshCell = function(t) {
        var e = this.normalize(t),
            n = this._focusEle,
            i = e.rowIndxPage,
            r = e.colIndx;
        this.iRenderB.refreshCell(i, r, e.rowData, e.column) && (n && n.rowIndxPage == i && this.focus(), e.skip || this._trigger("refreshCell", null, e))
    }, a.refreshHeaderCell = function(t) {
        var e = this.normalize(t),
            n = this.headerCells,
            i = n.length - 1,
            r = n[i];
        this.iRenderHead.refreshCell(i, e.colIndx, r, e.column)
    }, a.refreshRow = function(t) {
        if (this.pdata) {
            var e, n = this,
                i = n.normalize(t),
                r = i.rowIndx,
                o = i.rowIndxPage,
                a = i.rowData;
            return a ? (n.iRenderB.refreshRow(o), n.refresh({
                soft: !0
            }), (e = n._focusEle) && e.rowIndxPage == o && n.focus(), n._trigger("refreshRow", null, {
                rowData: a,
                rowIndx: r,
                rowIndxPage: o
            }), !0) : null
        }
    }, a.quitEditMode = function(t) {
        if (!this._quitEditMode) {
            var e = this,
                n = !1,
                i = !1,
                r = !1,
                o = this.options,
                a = o.editModel,
                l = a.indices,
                s = void 0;
            e._quitEditMode = !0, t && (n = t.old, i = t.silent, r = t.fireOnly, s = t.evt), l && (i || n || this._trigger("editorEnd", s, l), r || (this._removeEditOutline(t), a.indices = null)), e._quitEditMode = null
        }
    }, a.getViewPortRowsIndx = function() {
        return {
            beginIndx: this.initV,
            endIndx: this.finalV
        }
    }, a.getViewPortIndx = function() {
        var t = this.iRenderB;
        return {
            initV: t.initV,
            finalV: t.finalV,
            initH: t.initH,
            finalH: t.finalH
        }
    }, a.getRIOffset = function() {
        return this.riOffset
    }, a.getEditCell = function() {
        var t = this.options.editModel;
        if (t.indices) {
            var e = this.getCell(t.indices),
                n = this.$div_focus.children(".pq-editor-inner"),
                i = n.find(".pq-editor-focus");
            return {
                $td: e,
                $cell: n,
                $editor: i
            }
        }
        return {}
    }, a.editCell = function(t) {
        var e, n, i = this,
            r = i.normalize(t),
            o = i.iMerge,
            a = r.rowIndx,
            l = r.colIndx;
        return o.ismergedCell(a, l) && (e = o.getRootCellO(a, l), e.rowIndx != r.rowIndx || e.colIndx != r.colIndx) ? !1 : void i.scrollCell(r, function() {
            return n = i.getCell(r), n && n.length ? i._editCell(r) : void 0
        })
    }, a.getFirstEditableColIndx = function(t) {
        if (null == t.rowIndx) throw "rowIndx NA";
        for (var e = this.colModel, n = 0; n < e.length; n++)
            if (!e[n].hidden && (t.colIndx = n, this.isEditable(t))) return n;
        return -1
    }, a.editFirstCellInRow = function(t) {
        var e = this.normalize(t),
            n = e.rowIndx,
            i = this.getFirstEditableColIndx({
                rowIndx: n
            }); - 1 != i && this.editCell({
            rowIndx: n,
            colIndx: i
        })
    }, a._editCell = function(e) {
        var n = this.normalize(e),
            i = this,
            o = n.evt,
            a = n.rowIndxPage,
            l = n.colIndx,
            s = i.pdata;
        if (!s || a >= s.length) return !1;
        var i = this,
            d = this.options,
            c = d.editModel,
            u = s[a],
            h = n.rowIndx,
            f = this.colModel,
            p = f[l],
            g = p.dataIndx,
            v = i.readCell(u, p),
            m = {
                rowIndx: h,
                rowIndxPage: a,
                cellData: v,
                rowData: u,
                dataIndx: g,
                colIndx: l,
                column: p
            },
            w = p.editor,
            x = this,
            y = typeof w,
            w = "function" == y || "string" == y ? x.callFn(w, m) : w;
        if (void 0 === w && "function" == typeof d.geditor && (w = d.geditor.call(x, m)), w !== !1) {
            w && w.getData && (c._getData = w.getData);
            var C = d.editor,
                b = w ? t.extend({}, C, w) : C,
                I = !1;
            if (c.indices) {
                var _ = c.indices;
                if (_.rowIndxPage == a && _.colIndx == l) {
                    this.refreshEditorPos();
                    var q = this.$div_focus.find(".pq-editor-focus");
                    return q[0].focus(), document.activeElement != q[0] && window.setTimeout(function() {
                        q.focus()
                    }, 0), !1
                }
                if (this.blurEditor({
                        evt: o
                    }) === !1) return !1;
                this.quitEditMode({
                    evt: o
                })
            }
            c.indices = {
                rowIndxPage: a,
                rowIndx: h,
                colIndx: l,
                column: p,
                dataIndx: g
            }, this._generateCellRowOutline();
            var D = this.$div_focus,
                R = D.children(".pq-editor-inner");
            R.addClass("pq-align-" + (p.align || "left")), m.$cell = R;
            var M, T = b.type,
                k = null == n.select ? b.select : n.select,
                E = b.init,
                S = b.valueIndx,
                P = b.dataMap,
                $ = b.mapIndices,
                $ = $ ? $ : {},
                A = b.cls || "",
                A = "function" == typeof A ? A.call(x, m) : A,
                H = "pq-editor-focus " + A,
                F = H + " pq-cell-editor ",
                O = b.attr || "",
                O = "function" == typeof O ? O.call(x, m) : O,
                V = b.style || "",
                V = "function" == typeof V ? V.call(x, m) : V,
                L = V ? "style='" + V + "'" : "",
                N = L,
                B = L;
            if (m.cls = H, m.attr = O, "function" == typeof T && (M = T.call(x, m), M && (T = M)), C._type = T, "checkbox" == T) {
                var U = b.subtype,
                    z = v ? "checked='checked'" : "";
                M = "<input " + z + " class='" + F + "' " + O + " " + B + " type=checkbox name='" + g + "' />", R.html(M);
                var j = R.children("input");
                "triple" == U && (j.pqval({
                    val: v
                }), R.click(function(e) {
                    t(this).children("input").pqval({
                        incr: !0
                    })
                }))
            } else if ("textarea" == T || "select" == T || "textbox" == T) {
                if ("textarea" == T) M = "<textarea class='" + F + "' " + O + " " + N + " name='" + g + "' ></textarea>";
                else if ("select" == T) {
                    var W = b.options || [];
                    W.constructor !== Array && (W = i.callFn(W, m));
                    var G = [O, " class='", F, "' ", N, " name='", g, "'"].join("");
                    M = r.select({
                        options: W,
                        attr: G,
                        prepend: b.prepend,
                        labelIndx: b.labelIndx,
                        valueIndx: S,
                        groupIndx: b.groupIndx,
                        dataMap: P
                    })
                } else M = "<input class='" + F + "' " + O + " " + N + " type=text name='" + g + "' />";
                t(M).appendTo(R).val("select" == T && null != S && ($[S] || this.columns[S]) ? $[S] ? u[$[S]] : u[S] : v)
            } else T && "contenteditable" != T || (M = "<div contenteditable='true' tabindx='0' " + L + " " + O + " class='" + F + "'></div>", R.html(M), R.children().html(v), I = !0);
            E && (m.$editor = R.children(".pq-editor-focus"), this.callFn(E, m));
            var q = R.children(".pq-editor-focus"),
                K = c.filterKeys,
                Q = p.editModel;
            Q && void 0 !== Q.filterKeys && (K = Q.filterKeys);
            var X = {
                $cell: R,
                $editor: q,
                $td: i.getCell(c.indices),
                dataIndx: g,
                column: p,
                colIndx: l,
                rowIndx: h,
                rowIndxPage: a,
                rowData: u
            };
            if (c.indices = X, q.data({
                    FK: K
                }).on("click", function(e) {
                    t(this).focus(), i._trigger("editorClick", null, X)
                }).on("keydown", function(t) {
                    i.iKeyNav.keyDownInEdit(t)
                }).on("keypress", function(t) {
                    return i.iKeyNav.keyPressInEdit(t, {
                        FK: K
                    })
                }).on("keyup", function(t) {
                    return i.iKeyNav.keyUpInEdit(t, {
                        FK: K
                    })
                }).on("blur", function(e, n) {
                    var r = i.options,
                        o = r.editModel,
                        a = o.onBlur,
                        l = "save" == a,
                        s = "validate" == a,
                        d = o.cancelBlurCls,
                        c = n ? n.force : !1;
                    if (!i._quitEditMode && !i._blurEditMode && o.indices) {
                        var u = t(e.target);
                        if (!c) {
                            if (i._trigger("editorBlur", e, X) === !1) return;
                            if (!a) return;
                            if (d && u.hasClass(d)) return;
                            if (u.hasClass("hasDatepicker")) {
                                var h = u.datepicker("widget");
                                if (h.is(":visible")) return !1
                            } else if (u.hasClass("ui-autocomplete-input")) {
                                if (u.autocomplete("widget").is(":visible")) return
                            } else if (u.hasClass("ui-multiselect")) {
                                if (t(".ui-multiselect-menu").is(":visible") || t(document.activeElement).closest(".ui-multiselect-menu").length) return
                            } else if (u.hasClass("pq-select-button") && (t(".pq-select-menu").is(":visible") || t(document.activeElement).closest(".pq-select-menu").length)) return
                        }
                        i._blurEditMode = !0;
                        var f = c || l || !s;
                        if (!i.saveEditCell({
                                evt: e,
                                silent: f
                            }) && !c && s) return i._deleteBlurEditMode(), !1;
                        i.quitEditMode({
                            evt: e
                        }), i._deleteBlurEditMode()
                    }
                }).on("focus", function(t) {
                    i._trigger("editorFocus", t, X)
                }), i._trigger("editorBegin", o, X), q.focus(), window.setTimeout(function() {
                    var e = t(document.activeElement);
                    if (e.hasClass("pq-editor-focus") === !1) {
                        var n = i.element ? i.element.find(".pq-editor-focus") : t();
                        n.focus()
                    }
                }), k)
                if (I) try {
                    var Y = q[0],
                        J = document.createRange();
                    J.selectNodeContents(Y);
                    var Z = window.getSelection();
                    Z.removeAllRanges(), Z.addRange(J)
                } catch (tt) {} else q.select()
        }
    }, a._deleteBlurEditMode = function(t) {
        var e = this,
            t = t ? t : {};
        e._blurEditMode && (t.timer ? window.setTimeout(function() {
            delete e._blurEditMode
        }, 0) : delete e._blurEditMode)
    }, a.getRow = function(t) {
        var e = this.normalize(t),
            n = e.rowIndxPage;
        return this.iRenderB.get$Row(n)
    }, a.getCell = function(e) {
        e.vci >= 0 && (e.colIndx = this.iCols.getci(e.vci));
        var n = this.normalize(e),
            i = n.rowIndxPage,
            r = n.colIndx,
            o = this.iRenderB.getCell(i, r);
        return t(o)
    }, a.getCellHeader = function(e) {
        e.vci >= 0 && (e.colIndx = this.iCols.getci(e.vci));
        var n = this.normalize(e),
            i = n.colIndx,
            r = n.ri,
            o = r >= 0 ? r : this.headerCells.length - 1,
            a = this.iRenderHead.getCell(o, i);
        return t(a)
    }, a.getCellFilter = function(t) {
        return t.ri = this.headerCells.length, this.getCellHeader(t)
    }, a.getEditorIndices = function() {
        var e = this.options.editModel.indices;
        return e ? t.extend({}, e) : null
    }, a.getEditCellData = function() {
        var e = this.options,
            n = e.editModel,
            i = n.indices;
        if (!i) return null;
        var r, o = i.colIndx,
            a = i.rowIndxPage,
            l = i.rowIndx,
            s = this.colModel[o],
            d = s.editor,
            c = e.editor,
            u = d ? t.extend({}, c, d) : c,
            h = u.valueIndx,
            f = u.labelIndx,
            p = u.mapIndices,
            p = p ? p : {},
            g = s.dataIndx,
            v = this.$div_focus,
            m = v.children(".pq-editor-inner"),
            w = n._getData || u.getData;
        if (n._getData = void 0, w) r = this.callFn(w, {
            $cell: m,
            rowData: i.rowData,
            dataIndx: g,
            rowIndx: l,
            rowIndxPage: a,
            column: s,
            colIndx: o
        });
        else {
            var x = c._type;
            if ("checkbox" == x) {
                var y = m.children();
                r = "triple" == u.subtype ? y.pqval() : !!y.is(":checked")
            } else if ("contenteditable" == x) r = m.children().html();
            else {
                var C = m.find('*[name="' + g + '"]');
                if (C && C.length)
                    if ("select" == x && null != h)
                        if (p[h] || this.columns[h]) {
                            r = {}, r[p[h] ? p[h] : h] = C.val(), r[p[f] ? p[f] : f] = C.find("option:selected").text();
                            var b = u.dataMap;
                            if (b) {
                                var I = C.find("option:selected").data("map");
                                if (I)
                                    for (var _ = 0; _ < b.length; _++) {
                                        var q = b[_];
                                        r[p[q] ? p[q] : q] = I[q]
                                    }
                            }
                        } else r = C.val();
                else r = C.val();
                else {
                    var C = m.find(".pq-editor-focus");
                    C && C.length && (r = C.val())
                }
            }
        }
        return r
    }, a.getCellIndices = function(t) {
        var e, n = t.$td;
        return null == n || 0 == n.length || n.closest(".pq-grid")[0] != this.element[0] ? {} : (e = this.iRenderB.getCellIndx(n[0]), e ? this.iMerge.getRootCellO(e[0] + this.riOffset, e[1], !0) : {})
    }, a.getRowsByClass = function(t) {
        var e = this.options,
            n = e.dataModel,
            i = e.pageModel,
            r = "remote" == i.type,
            o = this.riOffset,
            a = n.data,
            l = [];
        if (null == a) return l;
        for (var s = 0, d = a.length; d > s; s++) {
            var c = a[s];
            if (c.pq_rowcls && (t.rowData = c, this.hasClass(t))) {
                var u = {
                        rowData: c
                    },
                    h = r ? s + o : s,
                    f = h - o;
                u.rowIndx = h, u.rowIndxPage = f, l.push(u)
            }
        }
        return l
    }, a.getCellsByClass = function(t) {
        var e = this,
            n = this.options,
            i = n.dataModel,
            r = n.pageModel,
            o = "remote" == r.type,
            a = this.riOffset,
            l = i.data,
            s = [];
        if (null == l) return s;
        for (var d = 0, c = l.length; c > d; d++) {
            var u = l[d],
                h = o ? d + a : d,
                f = u.pq_cellcls;
            if (f)
                for (var p in f) {
                    var g = {
                        rowData: u,
                        rowIndx: h,
                        dataIndx: p,
                        cls: t.cls
                    };
                    if (e.hasClass(g)) {
                        var v = e.normalize(g);
                        s.push(v)
                    }
                }
        }
        return s
    }, a.data = function(e) {
        var n = e.dataIndx,
            i = e.colIndx,
            n = null != i ? this.colModel[i].dataIndx : n,
            r = e.data,
            o = null == r || "string" == typeof r,
            a = e.rowData || this.getRowData(e);
        if (!a) return {
            data: null
        };
        if (null == n) {
            var l = a.pq_rowdata;
            if (o) {
                var s;
                return null != l && (s = null == r ? l : l[r]), {
                    data: s
                }
            }
            var d = t.extend(!0, a.pq_rowdata, r);
            a.pq_rowdata = d
        } else {
            var c = a.pq_celldata;
            if (o) {
                var s;
                if (null != c) {
                    var u = c[n];
                    s = null == r || null == u ? u : u[r]
                }
                return {
                    data: s
                }
            }
            c || (a.pq_celldata = {});
            var d = t.extend(!0, a.pq_celldata[n], r);
            a.pq_celldata[n] = d
        }
    }, a.attr = function(e) {
        var n = e.rowIndx,
            i = e.dataIndx,
            r = e.colIndx,
            i = null != r ? this.colModel[r].dataIndx : i,
            o = e.attr,
            a = null == o || "string" == typeof o,
            l = this.riOffset,
            s = e.refresh,
            d = e.rowData || this.getRowData(e);
        if (!d) return {
            attr: null
        };
        if (a || s === !1 || null != n || (n = this.getRowIndx({
                rowData: d
            }).rowIndx), null == i) {
            var c = d.pq_rowattr;
            if (a) {
                var u;
                return null != c && (u = null == o ? c : c[o]), {
                    attr: u
                }
            }
            var h = t.extend(!0, d.pq_rowattr, o);
            if (d.pq_rowattr = h, s !== !1 && null != n) {
                var f = this.getRow({
                    rowIndxPage: n - l
                });
                if (f) {
                    var p = this.stringifyAttr(h);
                    f.attr(p)
                }
            }
        } else {
            var g = d.pq_cellattr;
            if (a) {
                var u;
                if (null != g) {
                    var v = g[i];
                    u = null == o || null == v ? v : v[o]
                }
                return {
                    attr: u
                }
            }
            g || (d.pq_cellattr = {});
            var h = t.extend(!0, d.pq_cellattr[i], o);
            if (d.pq_cellattr[i] = h, s !== !1 && null != n) {
                var m = this.getCell({
                    rowIndxPage: n - l,
                    dataIndx: i
                });
                if (m) {
                    var p = this.stringifyAttr(h);
                    m.attr(p)
                }
            }
        }
    }, a.stringifyAttr = function(t) {
        var e = {};
        for (var n in t) {
            var i = t[n];
            if (i)
                if ("title" == n) i = i.replace(/\"/g, "&quot;"), e[n] = i;
                else if ("style" == n && "object" == typeof i) {
                var r, o = [];
                for (var a in i) r = i[a], r && o.push(a + ":" + r);
                i = o.join(";") + (o.length ? ";" : ""), i && (e[n] = i)
            } else "object" == typeof i && (i = JSON.stringify(i)), e[n] = i
        }
        return e
    }, a.removeData = function(e) {
        var n = e.dataIndx,
            i = e.colIndx,
            n = null != i ? this.colModel[i].dataIndx : n,
            r = e.data,
            r = null == r ? [] : r,
            o = "string" == typeof r ? r.split(" ") : r,
            a = o.length,
            l = e.rowData || this.getRowData(e);
        if (l)
            if (null == n) {
                var s = l.pq_rowdata;
                if (s) {
                    if (a)
                        for (var d = 0; a > d; d++) {
                            var c = o[d];
                            delete s[c]
                        }
                    a && !t.isEmptyObject(s) || delete l.pq_rowdata
                }
            } else {
                var u = l.pq_celldata;
                if (u && u[n]) {
                    var h = u[n];
                    if (a)
                        for (var d = 0; a > d; d++) {
                            var c = o[d];
                            delete h[c]
                        }
                    a && !t.isEmptyObject(h) || delete u[n]
                }
            }
    }, a.removeAttr = function(e) {
        var n = e.rowIndx,
            i = e.dataIndx,
            r = e.colIndx,
            i = null != r ? this.colModel[r].dataIndx : i,
            o = e.attr,
            o = null == o ? [] : o,
            a = "string" == typeof o ? o.split(" ") : o,
            l = a.length,
            s = n - this.riOffset,
            d = e.refresh,
            c = e.rowData || this.getRowData(e);
        if (c)
            if (d !== !1 && null == n && (n = this.getRowIndx({
                    rowData: c
                }).rowIndx), null == i) {
                var u = c.pq_rowattr;
                if (u) {
                    if (l)
                        for (var h = 0; l > h; h++) {
                            var f = a[h];
                            delete u[f]
                        } else
                            for (var f in u) a.push(f);
                    l && !t.isEmptyObject(u) || delete c.pq_rowattr
                }
                if (d !== !1 && null != n && a.length) {
                    o = a.join(" ");
                    var p = this.getRow({
                        rowIndxPage: s
                    });
                    p && p.removeAttr(o)
                }
            } else {
                var g = c.pq_cellattr;
                if (g && g[i]) {
                    var v = g[i];
                    if (l)
                        for (var h = 0; l > h; h++) {
                            var f = a[h];
                            delete v[f]
                        } else
                            for (var f in v) a.push(f);
                    l && !t.isEmptyObject(v) || delete g[i]
                }
                if (d !== !1 && null != n && a.length) {
                    o = a.join(" ");
                    var m = this.getCell({
                        rowIndxPage: s,
                        dataIndx: i
                    });
                    m && m.removeAttr(o)
                }
            }
    }, a.normalize = function(t, e) {
        var n, i, r, o = {};
        for (r in t) o[r] = t[r];
        var a = o.rowIndx,
            l = o.rowIndxPage,
            s = o.dataIndx,
            d = o.colIndx;
        return null == l && null == a || (n = this.riOffset, a = null == a ? 1 * l + n : a, l = null == l ? 1 * a - n : l, o.rowIndx = a, o.rowIndxPage = l, o.rowData = o.rowData || e && e[a] || this.getRowData(o)), null == d && null == s || (i = this.colModel, s = null == s ? i[d] ? i[d].dataIndx : void 0 : s, d = null == d ? this.colIndxs[s] : d, o.column = i[d], o.colIndx = d, o.dataIndx = s), o
    }, a.normalizeList = function(t) {
        var e = this,
            n = e.get_p_data();
        return t.map(function(t) {
            return e.normalize(t, n)
        })
    }, a.addClass = function(t) {
        var e, n = this.normalize(t),
            i = n.rowIndxPage,
            r = n.dataIndx,
            o = pq.arrayUnique,
            a = n.cls,
            l = n.refresh,
            s = n.rowData;
        if (s)
            if (l !== !1 && null == i && (i = this.getRowIndx({
                    rowData: s
                }).rowIndxPage), null == r) {
                var d = s.pq_rowcls;
                if (e = d ? d + " " + a : a, e = o(e.split(/\s+/)).join(" "), s.pq_rowcls = e, l !== !1 && null != i && this.SelectRow().inViewRow(i)) {
                    var c = this.getRow({
                        rowIndxPage: i
                    });
                    c && c.addClass(a)
                }
            } else {
                var u = [];
                "function" != typeof r.push ? u.push(r) : u = r;
                var h = s.pq_cellcls;
                h || (h = s.pq_cellcls = {});
                for (var f = 0, p = u.length; p > f; f++) {
                    r = u[f];
                    var g = h[r];
                    if (e = g ? g + " " + a : a, e = o(e.split(/\s+/)).join(" "), h[r] = e, l !== !1 && null != i && this.SelectRow().inViewRow(i)) {
                        var v = this.getCell({
                            rowIndxPage: i,
                            dataIndx: r
                        });
                        v && v.addClass(a)
                    }
                }
            }
    }, a.removeClass = function(t) {
        var e = this.normalize(t),
            n = e.rowIndx,
            i = e.rowData,
            r = e.dataIndx,
            o = e.cls,
            a = e.refresh;
        if (i) {
            var l = i.pq_cellcls,
                s = i.pq_rowcls;
            if (a !== !1 && null == n && (n = this.getRowIndx({
                    rowData: i
                }).rowIndx), null == r) {
                if (s && (i.pq_rowcls = this._removeClass(s, o), null != n && a !== !1)) {
                    var d = this.getRow({
                        rowIndx: n
                    });
                    d && d.removeClass(o)
                }
            } else if (l) {
                var c = [];
                "function" != typeof r.push ? c.push(r) : c = r;
                for (var u = 0, h = c.length; h > u; u++) {
                    r = c[u];
                    var f = l[r];
                    if (f && (i.pq_cellcls[r] = this._removeClass(f, o), null != n && a !== !1)) {
                        var p = this.getCell({
                            rowIndx: n,
                            dataIndx: r
                        });
                        p && p.removeClass(o)
                    }
                }
            }
        }
    }, a.hasClass = function(t) {
        var e, n = t.dataIndx,
            i = t.cls,
            r = this.getRowData(t),
            o = new RegExp("\\b" + i + "\\b");
        if (r) {
            if (null == n) return e = r.pq_rowcls, !(!e || !o.test(e));
            var a = r.pq_cellcls;
            return !!(a && a[n] && o.test(a[n]))
        }
        return null
    }, a._removeClass = function(t, e) {
        if (t && e) {
            for (var n = t.split(/\s+/), i = e.split(/\s+/), r = [], o = 0, a = n.length; a > o; o++) {
                for (var l = n[o], s = !1, d = 0, c = i.length; c > d; d++) {
                    var u = i[d];
                    if (l === u) {
                        s = !0;
                        break
                    }
                }
                s || r.push(l)
            }
            return r.length > 1 ? r.join(" ") : 1 === r.length ? r[0] : null
        }
    }, a.getRowIndx = function(t) {
        var e, n, i, r = t.$tr,
            o = t.rowData,
            a = this.riOffset;
        if (o) {
            if (null != (i = o.pq_ri)) return {
                rowData: o,
                rowIndx: i,
                rowIndxPage: i - a
            };
            var l = this.get_p_data(),
                s = !1,
                d = t.dataUF ? this.options.dataModel.dataUF : null,
                c = !1;
            if (l)
                for (var u = 0, h = l.length; h > u; u++)
                    if (l[u] == o) {
                        c = !0;
                        break
                    }
            if (!c && d) {
                s = !0;
                for (var u = 0, h = d.length; h > u; u++)
                    if (d[u] == o) {
                        c = !0;
                        break
                    }
            }
            return c ? (e = u - a, n = u, {
                rowIndxPage: s ? void 0 : e,
                uf: s,
                rowIndx: n,
                rowData: o
            }) : {}
        }
        return null == r || 0 == r.length ? {} : (e = this.iRenderB.getRowIndx(r[0])[0], null == e ? {} : {
            rowIndxPage: e,
            rowIndx: e + a
        })
    }, a.search = function(t) {
        for (var e = this.options, n = t.row, i = t.first, r = e.dataModel, o = e.pageModel, a = o.type, l = [], s = this.riOffset, d = "remote" == a, c = r.data, u = 0, h = c.length; h > u; u++) {
            var f = c[u],
                p = !0;
            for (var g in n) n[g] !== f[g] && (p = !1);
            if (p) {
                var v = d ? u + s : u,
                    m = this.normalize({
                        rowIndx: v
                    });
                if (l.push(m), i) break
            }
        }
        return l
    }, a.getFirstVisibleRIP = function(t) {
        for (var e = this.pdata, n = t ? this.iRenderB.initV : 0, i = e.length; i > n; n++)
            if (!e[n].pq_hidden) return n
    }, a.getLastVisibleRIP = function() {
        for (var t = this.pdata, e = t.length - 1; e >= 0; e--)
            if (!t[e].pq_hidden) return e;
        return null
    }, a.getFirstVisibleCI = function(t) {
        return this.iCols.getFirstVisibleCI()
    }, a.getLastVisibleCI = function() {
        return this.iCols.getLastVisibleCI()
    }, a.getNextVisibleCI = function(t) {
        return this.iCols.getNextVisibleCI(t)
    }, a.getPrevVisibleCI = function(t) {
        return this.iCols.getPrevVisibleCI(t)
    }, a.calcWidthCols = function(t, e, n) {
        var i = 0,
            r = this.options,
            o = 0,
            a = r.numberCell,
            l = this.colModel;
        if (-1 == t && (a.show && (i += n ? 1 * a.width : a.outerWidth), t = 0), n)
            for (var s = t; e > s; s++) {
                var d = l[s];
                if (d && !d.hidden) {
                    if (!d._width) throw "assert failed";
                    i += d._width + o
                }
            } else
                for (var s = t; e > s; s++) {
                    var d = l[s];
                    d && !d.hidden && (i += d.outerWidth)
                }
        return i
    }
}(jQuery),
function(t) {
    var e = t.paramquery.cKeyNav = function(t) {
        this.that = t
    };
    e.prototype = {
        bodyKeyPressDown: function(e) {
            var n, i, r, o, a = this,
                l = a.that,
                s = l.riOffset,
                d = l.options,
                c = d.formulasModel,
                u = l.iMerge,
                h = l._focusEle,
                f = l.colModel,
                p = d.selectionModel,
                g = d.editModel,
                v = document.activeElement,
                m = pq.isCtrl(e),
                w = t.ui.keyCode,
                x = e.keyCode;
            if (g.indices) return void l.$div_focus.find(".pq-cell-focus").focus();
            if (o = t(e.target), o.hasClass("pq-grid-cell")) h = l.getCellIndices({
                $td: o
            });
            else if ("pq-grid-excel" != v.id && "pq-body-outer" != v.className) return;
            if (x == w.SPACE && o[0] == l.$cont[0]) return !1;
            var y, C, b = l.normalize(h),
                i = b.rowIndxPage,
                n = b.rowIndx,
                r = b.colIndx,
                I = l.pdata,
                _ = b,
                q = !0;
            if (null != n && null != r && null != b.rowData) {
                if (u.ismergedCell(n, r) && (_ = u.getRootCellO(n, r), b = _, i = b.rowIndxPage, n = b.rowIndx, r = b.colIndx, x != w.PAGE_UP && x != w.PAGE_DOWN && x != w.HOME && x != w.END || (y = u.getData(n, r, "proxy_cell")) && (C = y.rowIndx - s, I[C].pq_hidden || (i = C, n = i + s)), f[r].hidden && (r = l.getNextVisibleCI(r))), 0 == l._trigger("beforeCellKeyDown", e, _)) return !1;
                if (l._trigger("cellKeyDown", e, _), x == w.LEFT || x == w.RIGHT || x == w.UP || x == w.DOWN || p.onTab && x == w.TAB) {
                    var D = null;
                    x == w.LEFT || x == w.TAB && e.shiftKey ? D = this.incrIndx(i, r, !1) : x == w.RIGHT || x == w.TAB && !e.shiftKey ? D = this.incrIndx(i, r, !0) : x == w.UP ? D = this.incrRowIndx(i, r, !1) : x == w.DOWN && (D = this.incrRowIndx(i, r, !0)), D && (n = D.rowIndxPage + s, this.select({
                        rowIndx: n,
                        colIndx: D.colIndx,
                        evt: e
                    }))
                } else if (x == w.PAGE_DOWN || x == w.PAGE_UP) {
                    var R = x == w.PAGE_UP ? "pageUp" : "pageDown";
                    l.iRenderB[R](i, function(t) {
                        n = t + s, a.select({
                            rowIndx: n,
                            colIndx: r,
                            evt: e
                        })
                    })
                } else if (x == w.HOME) m ? n = l.getFirstVisibleRIP() + s : r = l.getFirstVisibleCI(), this.select({
                    rowIndx: n,
                    colIndx: r,
                    evt: e
                });
                else if (x == w.END) m ? n = l.getLastVisibleRIP() + s : r = l.getLastVisibleCI(), this.select({
                    rowIndx: n,
                    colIndx: r,
                    evt: e
                });
                else if (x == w.ENTER) {
                    var M = l.getCell(_);
                    if (M && M.length > 0)
                        if (l.isEditable(_)) l.editCell(_);
                        else {
                            var T = M.find("button");
                            T.length && t(T[0]).click()
                        }
                } else if (m && "65" == x) {
                    var k = l.iSelection;
                    "row" == p.type && "single" != p.mode ? l.iRows.toggleAll({
                        all: p.all
                    }) : "cell" == p.type && "single" != p.mode && k.selectAll({
                        type: "cell",
                        all: p.all
                    })
                } else g.pressToEdit && (this.isEditKey(x) || c.on && 187 == x) && !m ? 46 == x ? l.clear() : (i = _.rowIndxPage, r = _.colIndx, M = l.getCell(_), M && M.length && l.isEditable(_) && l.editCell({
                    rowIndxPage: i,
                    colIndx: r,
                    select: !0
                }), q = !1) : q = !1;
                q && e.preventDefault()
            }
        },
        getPrevVisibleRIP: function(t) {
            for (var e = this.that.pdata, n = t - 1; n >= 0; n--)
                if (!e[n].pq_hidden) return n;
            return t
        },
        setDataMergeCell: function(t, e) {
            var n, i = this.that,
                r = i.iMerge;
            r.ismergedCell(t, e) && (n = r.getRootCellO(t, e), r.setData(n.rowIndx, n.colIndx, {
                proxy_cell: {
                    rowIndx: t,
                    colIndx: e
                }
            }))
        },
        getValText: function(e) {
            var n = e[0].nodeName.toLowerCase(),
                i = ["input", "textarea", "select"],
                r = "text";
            return -1 != t.inArray(n, i) && (r = "val"), r
        },
        getNextVisibleRIP: function(t) {
            for (var e = this.that.pdata, n = t + 1, i = e.length; i > n; n++)
                if (!e[n].pq_hidden) return n;
            return t
        },
        incrEditIndx: function(t, e, n) {
            var i, r = this.that,
                o = r.colModel,
                a = o.length,
                l = r.iMerge,
                s = r.riOffset,
                d = r[n ? "getLastVisibleRIP" : "getFirstVisibleRIP"]();
            do {
                var c, u = t + s;
                if (l.ismergedCell(u, e)) {
                    c = l.getRootCell(u, e);
                    var h = l.getData(u, e, "proxy_edit_cell");
                    h && (u = h.rowIndx, t = u - s), e = n ? e + c.o_cc : e - 1
                } else e = n ? e + 1 : e - 1;
                if (n && e >= a || !n && 0 > e) {
                    if (t == d) return null;
                    t = this[n ? "getNextVisibleRIP" : "getPrevVisibleRIP"](t), e = n ? 0 : a - 1
                }
                u = t + s, l.ismergedCell(u, e) && (c = l.getRootCellO(u, e), l.setData(c.rowIndx, c.colIndx, {
                    proxy_edit_cell: {
                        rowIndx: u,
                        colIndx: e
                    }
                }), u = c.rowIndx, e = c.colIndx), i = o[e];
                var f = r.isEditable({
                        rowIndx: u,
                        colIndx: e
                    }),
                    p = i.editor,
                    p = "function" == typeof p ? p.call(r, r.normalize({
                        rowIndx: u,
                        colIndx: e
                    })) : p;
                t = u - s
            } while (i && (i.hidden || 0 == f || p === !1));
            return {
                rowIndxPage: t,
                colIndx: e
            }
        },
        incrIndx: function(t, e, n) {
            var i, r, o, a, l, s = this.that,
                d = s.iMerge,
                c = s.pdata,
                u = s.riOffset,
                h = s[n ? "getLastVisibleRIP" : "getFirstVisibleRIP"](),
                f = s[n ? "getLastVisibleCI" : "getFirstVisibleCI"](),
                p = s.colModel,
                g = p.length;
            if (null == e) return t == h ? null : (t = this[n ? "getNextVisibleRIP" : "getPrevVisibleRIP"](t), {
                rowIndxPage: t
            });
            if (e == f) return {
                rowIndxPage: t,
                colIndx: e
            };
            do o = t + u, d.ismergedCell(o, e) && (i = d.getRootCell(o, e), !l && (r = d.getData(i.o_ri, i.o_ci, "proxy_cell")) && (a = r.rowIndx - u, c[a].pq_hidden || (t = a)), c[t].pq_hidden && (t = d.getRootCellV(o, e).rowIndxPage), !l && n && (e = i.o_ci + (i.o_cc ? i.o_cc - 1 : 0))), n ? g - 1 > e && e++ : e > 0 && e--, l = p[e]; while (l && l.hidden);
            return {
                rowIndxPage: t,
                colIndx: e
            }
        },
        incrRowIndx: function(t, e, n) {
            var i, r, o = this.that,
                a = o.riOffset,
                l = t + a,
                s = o.iMerge;
            return s.ismergedCell(l, e) && (i = s.getRootCell(l, e), r = s.getData(i.o_ri, i.o_ci, "proxy_cell"), n && (t = i.o_ri - a + i.o_rc - 1), e = r ? r.colIndx : i.v_ci), t = this[n ? "getNextVisibleRIP" : "getPrevVisibleRIP"](t), {
                rowIndxPage: t,
                colIndx: e
            }
        },
        isEditKey: function(t) {
            return t >= 32 && 127 >= t || 189 == t || 190 == t
        },
        keyDownInEdit: function(e) {
            var n = this.that,
                i = n.options,
                r = i.editModel.indices;
            if (r) {
                var o = t(e.target),
                    a = t.ui.keyCode,
                    l = i.editModel,
                    s = t.extend({}, r),
                    d = s.rowIndxPage,
                    c = s.colIndx,
                    u = s.column,
                    h = u.editModel,
                    f = h ? t.extend({}, l, h) : l,
                    p = this.getValText(o);
                if (o.data("oldVal", o[p]()), 0 == n._trigger("editorKeyDown", e, s)) return !1;
                if (e.keyCode == a.TAB || e.keyCode == f.saveKey) {
                    var g = e.keyCode == a.TAB ? f.onTab : f.onSave,
                        s = {
                            rowIndxPage: d,
                            colIndx: c,
                            incr: !!g,
                            edit: "nextEdit" == g
                        };
                    return this.saveAndMove(s, e)
                }
                if (e.keyCode == a.ESCAPE) return n.quitEditMode({
                    evt: e
                }), n.focus({
                    rowIndxPage: d,
                    colIndx: c
                }), e.preventDefault(), !1;
                if (e.keyCode == a.PAGE_UP || e.keyCode == a.PAGE_DOWN) return e.preventDefault(), !1;
                if (f.keyUpDown && !e.altKey) {
                    if (e.keyCode == a.DOWN) return s = this.incrRowIndx(d, c, !0), this.saveAndMove(s, e);
                    if (e.keyCode == a.UP) return s = this.incrRowIndx(d, c, !1), this.saveAndMove(s, e)
                }
            }
        },
        keyPressInEdit: function(e, n) {
            var i = this.that,
                r = i.options,
                o = r.editModel.indices,
                a = n || {},
                l = a.FK,
                s = o.column,
                d = t.ui.keyCode,
                c = ["BACKSPACE", "LEFT", "RIGHT", "UP", "DOWN", "DELETE", "HOME", "END"].map(function(t) {
                    return d[t]
                }),
                u = s.dataType;
            if (t.inArray(e.keyCode, c) >= 0) return !0;
            if (i._trigger("editorKeyPress", e, t.extend({}, o)) === !1) return !1;
            if (l && ("float" == u || "integer" == u)) {
                var h = o.$editor.val(),
                    f = "float" == u ? "0123456789.-=" : "0123456789-=",
                    p = e.charCode || e.keyCode,
                    g = String.fromCharCode(p);
                if ("=" !== h[0] && g && -1 == f.indexOf(g)) return !1
            }
            return !0
        },
        keyUpInEdit: function(e, n) {
            var i = this.that,
                r = i.options,
                o = n || {},
                a = o.FK,
                l = r.editModel,
                s = l.indices;
            i._trigger("editorKeyUp", e, t.extend({}, s));
            var d = s.column,
                c = d.dataType;
            if (a && ("float" == c || "integer" == c)) {
                var u = t(e.target),
                    h = "integer" == c ? l.reInt : l.reFloat,
                    f = this.getValText(u),
                    p = u.data("oldVal"),
                    g = u[f]();
                if (0 == h.test(g) && "=" !== g[0])
                    if (h.test(p)) u[f](p);
                    else {
                        var v = "float" == c ? parseFloat(p) : parseInt(p);
                        isNaN(v) ? u[f](0) : u[f](v)
                    }
            }
        },
        saveAndMove: function(t, e) {
            if (null == t) return e.preventDefault(), !1;
            var n, i, r = this,
                o = r.that,
                a = t.rowIndxPage,
                l = t.colIndx;
            return o._blurEditMode = !0, o.saveEditCell({
                evt: e
            }) !== !1 && o.pdata ? (o.quitEditMode(e), t.incr && (i = r[t.edit ? "incrEditIndx" : "incrIndx"](a, l, !e.shiftKey), a = i ? i.rowIndxPage : a, l = i ? i.colIndx : l), o.scrollCell({
                rowIndxPage: a,
                colIndx: l
            }, function() {
                n = a + o.riOffset, r.select({
                    rowIndx: n,
                    colIndx: l,
                    evt: e
                }), t.edit && o._editCell({
                    rowIndxPage: a,
                    colIndx: l
                })
            }), o._deleteBlurEditMode({
                timer: !0,
                msg: "saveAndMove"
            }), e.preventDefault(), !1) : (o.pdata || o.quitEditMode(e), o._deleteBlurEditMode({
                timer: !0,
                msg: "saveAndMove saveEditCell"
            }), e.preventDefault(), !1)
        },
        select: function(e) {
            var n = this,
                i = n.that,
                r = e.rowIndx,
                o = e.colIndx,
                a = r - i.riOffset,
                l = e.evt,
                s = (n.setDataMergeCell(r, o), i.options),
                d = i.iSelection,
                c = s.selectionModel,
                u = c.type,
                h = "row" == u,
                f = "cell" == u;
            i.scrollCell({
                rowIndx: r,
                colIndx: o
            }, function() {
                var e = d.address();
                if (l.shiftKey && l.keyCode !== t.ui.keyCode.TAB && c.type && "single" != c.mode && (e.length || h))
                    if (h) i.iRows.extend({
                        rowIndx: r,
                        evt: l
                    });
                    else {
                        var n = e[e.length - 1],
                            s = n.firstR,
                            u = n.firstC,
                            p = n.type,
                            g = !1;
                        "column" == p ? (n.c1 = u, n.c2 = o, n.r1 = n.r2 = n.type = void 0) : (e = {
                            _type: "block",
                            r1: s,
                            r2: r,
                            c1: u,
                            c2: o,
                            firstR: s,
                            firstC: u
                        }, g = !0), i.Range(e, g).select()
                    }
                else h || f && i.Range({
                    r1: r,
                    c1: o,
                    firstR: r,
                    firstC: o
                }).select();
                i.focus({
                    rowIndxPage: a,
                    colIndx: o
                })
            })
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e.cGenerateView = function(t) {};
    n.prototype = {
        autoFitCols: function() {
            var t = this.that,
                e = t.colModel,
                n = e.length,
                i = this.dims,
                r = t.calcWidthCols(-1, n, !0),
                o = this.getSBWd(),
                a = i.wdCenter - o;
            if (r !== a) {
                for (var l, s = r - a, d = [], c = 0; n > c; c++) {
                    var u = e[c],
                        h = u._percent,
                        f = (u.resizable !== !1, u._resized),
                        p = u.hidden;
                    if (!p && !h && !f) {
                        var g;
                        0 > s ? (g = u._maxWidth - u._width, g && d.push({
                            availWd: -1 * g,
                            colIndx: c
                        })) : (g = u._width - u._minWidth, g && d.push({
                            availWd: g,
                            colIndx: c
                        }))
                    }
                    f && (l = u, delete u._resized)
                }
                d.sort(function(t, e) {
                    return t.availWd > e.availWd ? 1 : t.availWd < e.availWd ? -1 : 0
                });
                for (var c = 0, v = d.length; v > c; c++) {
                    var m, w = d[c],
                        g = w.availWd,
                        x = w.colIndx,
                        y = Math.round(s / (v - c)),
                        u = e[x],
                        C = u._width;
                    Math.abs(g) > Math.abs(y) ? (m = C - y, s -= y) : (m = C - g, s -= g), u.width = u._width = m
                }
                if (0 != s && l) {
                    var m = l._width - s;
                    m > l._maxWidth ? m = l._maxWidth : m < l._minWidth && (m = l._minWidth), l.width = l._width = m
                }
            }
        },
        computeOuterWidths: function() {
            for (var t = this.that, e = t.options, n = 0, i = e.numberCell, r = t.colModel, o = r.length, a = 0; o > a; a++) {
                var l = r[a];
                l.outerWidth = l._width + n
            }
            i.show && (i.outerWidth = i.width)
        },
        numericVal: function(t, e) {
            var n;
            return n = (t + "").indexOf("%") > -1 ? parseInt(t) * e / 100 : parseInt(t), Math.round(n)
        },
        refreshColumnWidths: function(t) {
            t = t || {};
            var e = this.that,
                n = e.options,
                i = n.numberCell,
                r = "flex" === n.width,
                o = 0,
                a = e.colModel,
                l = this.autoFit,
                s = this.dims.wdCenter,
                d = a.length,
                c = 0,
                u = n.minColWidth,
                h = n.maxColWidth,
                f = 0;
            i.show && (i.width < i.minWidth && (i.width = i.minWidth), f = i.outerWidth = i.width);
            var p = r ? null : s - c - f,
                u = Math.floor(this.numericVal(u, p)),
                h = Math.ceil(this.numericVal(h, p)),
                g = 0;
            if (!r && 5 > p || isNaN(p)) {
                if (n.debug) throw "availWidth N/A"
            } else {
                delete e.percentColumn;
                for (var v = 0; d > v; v++) {
                    var m = a[v],
                        w = m.hidden;
                    if (!w) {
                        var x = m.width,
                            y = (x + "").indexOf("%") > -1 ? !0 : null,
                            C = m.minWidth,
                            b = m.maxWidth,
                            C = C ? this.numericVal(C, p) : u,
                            b = b ? this.numericVal(b, p) : h;
                        if (C > b && (b = C), void 0 != x) {
                            var I, _ = 0;
                            !r && y ? (e.percentColumn = !0, m.resizable = !1, m._percent = !0, I = this.numericVal(x, p) - o, _ = Math.floor(I), g += I - _, g >= 1 && (_ += 1, g -= 1)) : x && (_ = 1 * x), C > _ ? _ = C : _ > b && (_ = b), m._width = _
                        } else m._width = C;
                        y || (m.width = m._width), m._minWidth = C, m._maxWidth = r ? 1e3 : b
                    }
                }
                r === !1 && t.refreshWidth !== !1 && l && this.autoFitCols(), this.computeOuterWidths()
            }
        },
        format: function() {
            var e = t.datepicker,
                n = pq.formatNumber;
            return function(t, i) {
                if ("function" == typeof i) return i(t);
                if (pq.isDateFormat(i)) {
                    if (t == parseInt(t)) return pq.formulas.TEXT(t, pq.juiToExcel(i));
                    if (isNaN(Date.parse(t))) return;
                    return e.formatDate(i, new Date(t))
                }
                return t == parseFloat(t) ? n(t, i) : void 0
            }
        }(),
        renderCell: function(t) {
            var e, n, i, r, o = this.that,
                a = t.attr || [],
                l = t.style || [],
                s = t.Export,
                d = o.options,
                c = t.cls || [],
                u = t.rowData,
                h = t.column,
                f = h.dataType,
                p = t.colIndx,
                g = h.dataIndx,
                v = d.freezeCols,
                m = d.columnBorders;
            if (u) {
                s || (h.align && c.push("pq-align-" + h.align), p == v - 1 && m && c.push("pq-last-frozen-col"), h.cls && c.push(h.cls));
                var w, x, y = u[g],
                    y = "string" == typeof y && "html" != f ? pq.escapeHtml(y) : y,
                    C = h.format || (x = u.pq_format) && (x = x[g]),
                    b = C ? this.format(y, C, f) : y;
                if (t.dataIndx = g, t.cellData = y, t.formatVal = b, (r = h.render) && (w = o.callFn(r, t), w && "string" != typeof w && ((e = w.attr) && a.push(e), (i = w.cls) && c.push(i), (n = w.style) && l.push(n), w = w.text)), null == w && (r = h._render) && (w = r.call(o, t)), w && "string" != typeof w && ((e = w.attr) && a.push(e), (i = w.cls) && c.push(i), (n = w.style) && l.push(n), w = w.text), null == w && (w = b || y), s) return [w, n];
                var I = u.pq_cellcls;
                if (I) {
                    var _ = I[g];
                    _ && c.push(_)
                }
                var q = u.pq_cellattr;
                if (q) {
                    var D = q[g];
                    if (D) {
                        var R = o.stringifyAttr(D);
                        for (var M in R) {
                            var T = R[M];
                            "style" == M ? l.push(T) : a.push(M + '="' + T + '"')
                        }
                    }
                }
                l = l.length ? " style='" + l.join("") + "' " : "", "" !== w && void 0 != w || (w = "&nbsp;"), w = pq.newLine(w);
                var k = ["<div class='", c.join(" "), "' ", a.join(" "), l, " >", w, "</div>"].join("");
                return k
            }
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e._pqGrid.prototype;
    n.getHeadCell = function(t) {
        var e, n, i, r = this.iRenderHead.getCellIndx(t[0]),
            o = r[0],
            a = r[1];
        return null != a && null != o && (n = this.headerCells[o], n && (n = n[a]), n && (i = n.colModel)), i && i.length && (e = !0), {
            col: n || this.colModel[a],
            ci: a,
            ri: o,
            isParent: e
        }
    }, n.flex = function(t) {
        this.iResizeColumns.flex(t)
    }, e.cHeader = function(t, e) {}, e.cHeader.prototype = {
        onBeforeRefreshH: function(e, n) {
            return function() {
                var i = document.activeElement,
                    r = i ? i.className : "",
                    o = e.focusUI,
                    a = t(i);
                o && (o.nofocus = -1 == r.indexOf("pq-grid-col-leaf") || !a.closest(n.element).length)
            }
        },
        onRefreshH: function(t) {
            return function(e) {
                t.setTimer(function() {
                    t.that.options && t.focus()
                }, 100)
            }
        },
        colCollapse: function(t, e) {
            var n = this.that,
                i = {
                    column: t
                },
                r = t.collapsible;
            n._trigger("beforeColumnCollapse", e, i) !== !1 && (r.on = !r.on, n._trigger("columnCollapse", e, i) !== !1 && n.refresh({
                colModel: !0
            }))
        },
        onHeaderClick: function(e) {
            var n, i, r, o, a = this,
                l = this.that,
                s = l.iDragColumns;
            if (l._trigger("headerClick", e), !s || "stop" == s.status) {
                if (o = t(e.target), o.is("input,label")) return !0;
                if (n = o.closest(".pq-grid-col"), n.length)
                    if (r = l.getHeadCell(n), i = r.col, o.hasClass("pq-col-collapse")) a.colCollapse(i, e);
                    else if (!r.isParent) return a.onHeaderCellClick(i, r.ci, e)
            }
        },
        getTitle: function(t, e) {
            var n = t.title,
                i = "function" == typeof n ? n.call(this.that, {
                    column: t,
                    colIndx: e,
                    dataIndx: t.dataIndx
                }) : n;
            return i
        },
        createHeaderCell: function(t, e, n, i, r, o) {
            var a, l, s, d = this.that,
                c = d.options,
                u = this.getSortSpaceSpans(c.sortModel),
                h = n.collapsible,
                f = "",
                p = n.halign || n.align,
                g = n.cls,
                v = n.colModel,
                m = this.hasMenuH(c, n),
                w = this.getTitle(n, e),
                w = null != w ? w : n.dataIndx;
            return n.pq_title = w, p && r.push("pq-align-" + p), g && r.push(g), r.push(n.clsHead), m && r.push("pq-has-menu"), v && v.length ? h && (r.push("pq-collapsible-th"), a = ["<span class='pq-col-collapse pq-icon-hover ui-icon ui-icon-", h.on ? "plus" : "minus", "'></span>"].join("")) : r.push("pq-grid-col-leaf"), l = "pq-row-indx=" + t, s = "pq-col-indx=" + e, ["<div ", s, " ", l, " ", f, " ", i, " ", " class='", r.join(" "), "' style='", o.join(""), "' >", "<div class='pq-td-div'>", a, "<span class='pq-title-span'>", w, "</span>", u, "</div>", m ? "<span class='pq-menu-icon'></span>" : "", "</div>"].join("")
        },
        getSortSpaceSpans: function(t) {
            var e = t.space ? " pq-space" : "";
            return ["<span class='pq-col-sort-icon", e, "'></span>", t.number ? "<span class='pq-col-sort-count" + e + "'></span>" : ""].join("")
        },
        hasMenuH: function(t, e) {
            var n = e.colModel;
            if (n && n.length) return !1;
            var i = t.menuIcon,
                r = e.menuIcon;
            return i && r !== !1 || i !== !1 && r
        },
        onHeaderCellClick: function(e, n, i) {
            var r = this.that,
                o = r.options,
                a = o.sortModel,
                l = e.dataIndx;
            if (r._trigger("headerCellClick", i, {
                    column: e,
                    colIndx: n,
                    dataIndx: l
                }) !== !1)
                if (o.selectionModel.column && -1 == i.target.className.indexOf("pq-td-div")) {
                    var s = {
                            c1: n,
                            firstC: n
                        },
                        d = r.iSelection.address();
                    if (i.shiftKey) {
                        var c = d.length;
                        if (c && "column" == d[c - 1].type) {
                            var u = d[c - 1];
                            u.c1 = u.firstC, u.c2 = n, u.r1 = u.r2 = u.type = void 0
                        }
                        s = d
                    }
                    r.Range(s, !1).select(), r.focus({
                        rowIndxPage: r.getFirstVisibleRIP(!0),
                        colIndx: n
                    })
                } else if (a.on && (a.wholeCell || t(i.target).hasClass("pq-title-span"))) {
                if (0 == e.sortable) return;
                r.sort({
                    sorter: [{
                        dataIndx: l,
                        sortIndx: e.sortIndx
                    }],
                    addon: !0,
                    skipCustomSort: pq.isCtrl(i),
                    tempMultiple: a.multiKey && i[a.multiKey],
                    evt: i
                })
            }
        },
        refreshHeaderSortIcons: function() {
            var e = this.that,
                n = e.options,
                i = n.bootstrap,
                r = n.ui,
                o = e.headerCells.length - 1,
                a = e.$header;
            if (a) {
                var l = e.iSort.getSorter(),
                    s = l.length,
                    d = !1,
                    c = e.options.sortModel;
                c.number && s > 1 && (d = !0);
                for (var u = 0; s > u; u++) {
                    var h = l[u],
                        f = h.dataIndx,
                        p = e.getColIndx({
                            dataIndx: f
                        }),
                        g = h.dir;
                    if (p >= 0) {
                        var v = i.on ? i.header_active : r.header_active + " pq-col-sort-" + ("up" == g ? "asc" : "desc"),
                            m = i.on ? " glyphicon glyphicon-arrow-" + g : "ui-icon ui-icon-triangle-1-" + ("up" == g ? "n" : "s"),
                            w = t(e.iRenderHead.getCell(o, p));
                        w.addClass(v), w.find(".pq-col-sort-icon").addClass(m), d && w.find(".pq-col-sort-count").html(u + 1)
                    }
                }
            }
        }
    }, e.cResizeColumns = function(e) {
        this.that = e;
        var n = this;
        e.$header.mouse(), e.$header.on({
            mousedown: function(e) {
                if (!e.pq_composed) {
                    var i = t(e.target);
                    n.setDraggables(e), e.pq_composed = !0;
                    var r = t.Event("mousedown", e);
                    i.trigger(r)
                }
            },
            dblclick: function(t) {
                n.doubleClick(t)
            }
        }, ".pq-grid-col-resize-handle");
        var i = e.options,
            r = i.flex;
        r.on && r.one && e.one("ready", function() {
            n.flex()
        })
    }, e.cResizeColumns.prototype = {
        doubleClick: function(e) {
            var n = this.that,
                i = n.options,
                r = i.flex,
                o = t(e.target),
                a = parseInt(o.attr("pq-col-indx"));
            isNaN(a) || r.on && this.flex(r.all && !i.scrollModel.autoFit ? null : a)
        },
        flex: function(t) {
            this.that.iRenderB.flex(t)
        },
        setDraggables: function(e) {
            var n, i, r, o = t(e.target),
                a = this;
            o.draggable({
                axis: "x",
                helper: function(e, n) {
                    var i = t(e.target),
                        r = parseInt(i.attr("pq-col-indx"));
                    return a._setDragLimits(r), a._getDragHelper(e, n), i
                },
                start: function(t, e) {
                    n = t.clientX, r = parseInt(a.$cl[0].style.left);
                },
                drag: function(t, e) {
                    i = t.clientX;
                    var o = i - n;
                    a.$cl[0].style.left = r + o + "px"
                },
                stop: function(t, e) {
                    return a.resizeStop(t, e, n)
                }
            })
        },
        _getDragHelper: function(e) {
            var n = this.that,
                i = n.options,
                r = 1 * i.freezeCols,
                o = t(e.target),
                a = n.$grid_center,
                l = n.iRenderHead,
                s = 1 * o.attr("pq-col-indx"),
                d = r > s ? 0 : l.scrollX(),
                c = a.outerHeight(),
                u = l.getLeft(s) - d,
                h = l.getLeft(s + 1) - d,
                f = "style='height:" + c + "px;left:";
            this.$clleft = t("<div class='pq-grid-drag-bar' " + f + u + "px;'></div>").appendTo(a), this.$cl = t("<div class='pq-grid-drag-bar' " + f + h + "px;'></div>").appendTo(a)
        },
        _setDragLimits: function(e) {
            if (!(0 > e)) {
                var n = this.that,
                    i = n.iRenderHead,
                    r = n.colModel,
                    o = r[e],
                    a = i.getLeft(e) + o._minWidth,
                    l = a + o._maxWidth - o._minWidth,
                    s = t(i._resizeDiv(e));
                s.draggable("instance") && s.draggable("option", "containment", [a, 0, l, 0])
            }
        },
        resizeStop: function(e, n, i) {
            var r = this.that,
                o = r.colModel,
                a = r.options,
                l = this,
                s = a.numberCell;
            l.$clleft.remove(), l.$cl.remove();
            var d, c = e.clientX,
                u = c - i,
                h = t(n.helper),
                f = 1 * h.attr("pq-col-indx");
            if (-1 == f) {
                d = null;
                var p = parseInt(s.width),
                    g = p + u;
                s.width = g
            } else {
                d = o[f];
                var p = parseInt(d.width),
                    g = p + u;
                d.width = g, d._resized = !0
            }
            r._trigger("columnResize", e, {
                colIndx: f,
                column: d,
                dataIndx: d ? d.dataIndx : null,
                oldWidth: p,
                newWidth: d ? d.width : s.width
            }), r.refresh({
                soft: !0
            })
        }
    }, e.cDragColumns = function(e) {
        var n = this;
        n.that = e, n.$drag_helper = null;
        var i = e.options.dragColumns,
            r = i.topIcon,
            o = i.bottomIcon;
        n.status = "stop", n.$arrowTop = t("<div class='pq-arrow-down ui-icon " + r + "'></div>").appendTo(e.element), n.$arrowBottom = t("<div class='pq-arrow-up ui-icon " + o + "' ></div>").appendTo(e.element), n.hideArrows(), i && i.enabled && e.$header.on("mousedown", ".pq-grid-col", n.onColMouseDown(n, e))
    }, e.cDragColumns.prototype = {
        onColMouseDown: function(e, n) {
            return function(i) {
                var r, o, a, l, s = t(this);
                if (!i.pq_composed) {
                    if (t(i.target).is("input,select,textarea")) return;
                    if (r = n.getHeadCell(s), o = r.col, a = o ? o.parent : null, !o || o.nodrag || o._nodrag || a && 1 == a.colSpan) return;
                    e.setDraggable(i, o, r) && (i.pq_composed = !0, l = t.Event("mousedown", i), t(i.target).trigger(l))
                }
            }
        },
        showFeedback: function(t, e) {
            var n = this.that,
                i = t[0],
                r = i.offsetParent.offsetParent,
                o = n.$grid_center[0].offsetTop,
                a = i.offsetLeft - r.offsetParent.scrollLeft + (e ? 0 : i.offsetWidth) - 8,
                l = o + i.offsetTop - 16,
                s = o + n.$header[0].offsetHeight;
            this.$arrowTop.css({
                left: a,
                top: l,
                display: ""
            }), this.$arrowBottom.css({
                left: a,
                top: s,
                display: ""
            })
        },
        showArrows: function() {
            this.$arrowTop.show(), this.$arrowBottom.show()
        },
        hideArrows: function() {
            this.$arrowTop.hide(), this.$arrowBottom.hide()
        },
        updateDragHelper: function(t) {
            var e = this.that,
                n = e.options.dragColumns,
                i = n.acceptIcon,
                r = n.rejectIcon,
                o = this.$drag_helper;
            o && (t ? (o.children("span.pq-drag-icon").addClass(i).removeClass(r), o.removeClass("ui-state-error")) : (o.children("span.pq-drag-icon").removeClass(i).addClass(r), o.addClass("ui-state-error")))
        },
        onStart: function(t, e, n, i) {
            return function(r) {
                return e._trigger("columnDrag", r.originalEvent, {
                    column: n
                }) === !1 ? !1 : void t.setDroppables(i)
            }
        },
        onDrag: function(e, n) {
            return function(i, r) {
                e.status = "drag";
                var o = t(".pq-drop-hover", n.$header);
                if (o.length > 0) {
                    e.showArrows(), e.updateDragHelper(!0);
                    var a = o.width(),
                        l = i.clientX - o.offset().left + t(document).scrollLeft();
                    a / 2 > l ? (e.leftDrop = !0, e.showFeedback(o, !0)) : (e.leftDrop = !1, e.showFeedback(o, !1))
                } else {
                    e.hideArrows();
                    var s = t(".pq-drop-hover", n.$top);
                    s.length ? e.updateDragHelper(!0) : e.updateDragHelper()
                }
            }
        },
        dragHelper: function(e, n, i) {
            var r = n.options.dragColumns.rejectIcon;
            return function() {
                e.status = "helper", n.$header.find(".pq-grid-col-resize-handle").hide();
                var o = t("<div class='pq-col-drag-helper ui-widget-content ui-corner-all panel panel-default' ><span class='pq-drag-icon ui-icon " + r + " glyphicon glyphicon-remove'></span>" + i.pq_title + "</div>");
                return e.$drag_helper = o, o[0]
            }
        },
        _columnIndexOf: function(t, e) {
            for (var n = 0, i = t.length; i > n; n++)
                if (t[n] == e) return n;
            return -1
        },
        setDraggable: function(e, n, i) {
            var r = t(e.currentTarget),
                o = this,
                a = o.that;
            return r.hasClass("ui-draggable") ? void 0 : (r.draggable({
                distance: 10,
                cursorAt: {
                    top: -18,
                    left: -10
                },
                zIndex: "1000",
                appendTo: a.element,
                revert: "invalid",
                helper: o.dragHelper(o, a, n),
                start: o.onStart(o, a, n, i),
                drag: o.onDrag(o, a),
                stop: function() {
                    a.element && (o.status = "stop", a.$header.find(".pq-grid-col-resize-handle").show(), o.hideArrows())
                }
            }), !0)
        },
        setDroppables: function(e) {
            var n, i, r, o, a, l, s, d = this,
                c = d.that,
                u = e.col,
                h = e.ri,
                f = e.o_ci,
                p = f + u.o_colspan,
                g = d.onDrop(),
                v = {
                    hoverClass: "pq-drop-hover ui-state-highlight",
                    accept: ".pq-grid-col",
                    tolerance: "pointer",
                    drop: g
                },
                m = c.$header.find(":not(.pq-grid-header-search-row)>.pq-grid-col");
            for (s = m.length; s--;) a = t(m[s]), l = a.hasClass("ui-droppable"), n = c.getHeadCell(a), o = n.col, i = n.ri, r = n.ci, o == u || o.nodrop || o._nodrop || i > h && r >= f && p > r ? l && a.droppable("destroy") : l || a.droppable(v)
        },
        onDrop: function() {
            var e = this,
                n = this.that;
            return function(i, r) {
                if (!e.dropPending) {
                    var o = 1 * r.draggable.attr("pq-col-indx"),
                        a = 1 * r.draggable.attr("pq-row-indx"),
                        l = t(this),
                        s = 1 * l.attr("pq-col-indx"),
                        d = 1 * l.attr("pq-row-indx"),
                        c = e.leftDrop;
                    if (n._trigger("beforeColumnOrder", null, {
                            colIndxDrag: o,
                            colIndxDrop: s,
                            left: c
                        }) !== !1) {
                        var u = e.moveColumn(o, s, c, a, d);
                        e.dropPending = !0, window.setTimeout(function() {
                            n.iCols.init();
                            var t = n._trigger("columnOrder", null, {
                                dataIndx: u.dataIndx,
                                column: u,
                                oldcolIndx: o,
                                colIndx: n.getColIndx({
                                    column: u
                                })
                            });
                            t !== !1 && n.refresh(), e.dropPending = !1
                        })
                    }
                }
            }
        },
        getRowIndx: function(t, e, n) {
            for (var i, r; n && (i = t[n][e], r = t[n - 1][e], i == r);) n--;
            return n
        },
        moveColumn: function(t, e, n, i, r) {
            var o = this.that,
                a = this,
                l = o.options.colModel,
                s = o.headerCells,
                d = o.depth - 1,
                i = null == i ? a.getRowIndx(s, t, d) : i,
                r = null == r ? a.getRowIndx(s, e, d) : r,
                c = s[i][t],
                u = s[r][e],
                h = i ? s[i - 1][t].colModel : l,
                f = r ? s[r - 1][e].colModel : l,
                p = a._columnIndexOf(h, c),
                g = n ? 1 : 0,
                v = h.splice(p, 1)[0],
                m = a._columnIndexOf(f, u) + 1 - g;
            return f.splice(m, 0, v), v
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery;
    e.cHeaderSearch = function(t) {}, e.cHeaderSearch.prototype = {
        _bindFocus: function() {
            function e(e) {
                var r = t(e.target),
                    o = r.closest(".pq-grid-hd-search-field"),
                    a = o.attr("name");
                if (n.scrollColumn({
                        dataIndx: a
                    })) {
                    var l = n.getColIndx({
                            dataIndx: a
                        }),
                        s = i.get$Ele(l, a);
                    s.focus()
                }
            }
            for (var n = this.that, i = this, r = n.$header.find(".pq-grid-header-search-row"), o = 0; o < r.length; o++) t(r[o]).on("focusin", e)
        },
        _input: function(t, e, n, i, r, o) {
            return e = pq.formatEx(t, e, o), ["<input ", ' value="', e, "\" name='", t.dataIndx, "' type=text style='", i, "' class='", n, "' ", r, " />"].join("")
        },
        _onKeyDown: function(e, n, i) {
            var r, o = this,
                a = this.that,
                l = e.keyCode,
                s = t.ui.keyCode;
            if (l !== s.TAB) return !0;
            var d, c = o.getCellIndx(i.closest(".pq-grid-col")[0])[1],
                u = a.colModel,
                h = e.shiftKey,
                f = u[c];
            if ("textbox2" == (f.filterUI || {}).type && (a.scrollColumn({
                    colIndx: c
                }), r = o.getCellEd(c)[1], r[0] == i[0] ? h || (d = r[1]) : h && (d = r[0]), d)) return d.focus(), e.preventDefault(), !1;
            for (;;) {
                if (h ? c-- : c++, 0 > c || c >= u.length) break;
                var f = u[c],
                    p = f.filter;
                if (!f.hidden && p) {
                    a.scrollColumn({
                        colIndx: c
                    }, function() {
                        var n = o.getCellEd(c)[1];
                        return "textbox2" == (f.filterUI || {}).type && (n = t(h ? n[1] : n[0])), n ? (n.focus(), e.preventDefault(), !1) : void 0
                    });
                    break
                }
            }
        },
        _textarea: function(t, e, n, i, r) {
            return ["<textarea name='", t, "' style='" + i + "' class='" + n + "' " + r + " >", e, "</textarea>"].join("")
        },
        bindListener: function(e, n, i, r) {
            var o = this,
                a = o.that,
                l = r.filter,
                s = pq.filter.getVal(l),
                d = s[0],
                c = s[1];
            pq.fakeEvent(e, n, a.options.filterModel.timeout), e.off(n).on(n, function(n) {
                var o, l, s = r.filterUI,
                    u = s.type,
                    h = s.condition;
                return "checkbox" == u ? o = e.pqval({
                    incr: !0
                }) : "textbox2" == u ? (o = t(e[0]).val(), l = t(e[1]).val()) : o = e.val(), o = "" === o ? void 0 : pq.deFormat(r, o, h), l = "" === l ? void 0 : pq.deFormat(r, l, h), d !== o || c !== l ? (d = o, c = l, i = pq.getFn(i), i.call(a, n, {
                    column: r,
                    dataIndx: r.dataIndx,
                    value: o,
                    value2: l
                })) : void 0
            })
        },
        betweenTmpl: function(t, e) {
            var n = ["<div class='pq-from-div'>", t, "</div>", "<span class='pq-from-to-center'>-</span>", "<div class='pq-to-div'>", e, "</div>"].join("");
            return n
        },
        createListener: function(t) {
            var e = {},
                n = this.that;
            return e[t] = function(t, e) {
                var i = e.column;
                n.filter({
                    rules: [{
                        dataIndx: i.filterIndx || e.dataIndx,
                        condition: i.filter.condition,
                        value: e.value,
                        value2: e.value2
                    }]
                })
            }, e
        },
        getCellEd: function(e) {
            var n = this,
                i = n.data.length - 1,
                r = t(this.getCell(i, e)),
                o = r.find(".pq-grid-hd-search-field");
            return [r, o]
        },
        onCreateHeader: function() {
            var t = this;
            t.that.options.filterModel.header && t.eachH(function(e) {
                e.filter && t.postRenderCell(e)
            })
        },
        onHeaderKeyDown: function(e, n) {
            var i = t(e.originalEvent.target);
            return i.hasClass("pq-grid-hd-search-field") ? this._onKeyDown(e, n, i) : !0
        },
        postRenderCell: function(e) {
            var n = e.dataIndx,
                i = e.filterUI || {},
                r = e.filter,
                o = this,
                a = o.that,
                l = a.colIndxs[n],
                s = this.getCellEd(l),
                d = s[0],
                c = s[1];
            if (0 != c.length) {
                var u = i.type,
                    h = {
                        button: "click",
                        select: "change",
                        checkbox: "change",
                        textbox: "timeout",
                        textbox2: "timeout"
                    },
                    f = pq.filter.getVal(r)[0];
                "checkbox" == u ? c.pqval({
                    val: f
                }) : "select" == u && (f = f || [], t.isArray(f) || (f = [f]), e.format && (f = f.slice(0, 25).map(function(t) {
                    return pq.format(e, t)
                })), c.val(f.join(", ")));
                var p = i.init,
                    g = r.listener,
                    v = r.listeners || [g ? g : h[u]];
                p && p.find(function(t) {
                    return a.callFn(t, {
                        dataIndx: n,
                        column: e,
                        filter: r,
                        filterUI: i,
                        $cell: d,
                        $editor: c
                    })
                });
                for (var m = 0; m < v.length; m++) {
                    var w = v[m],
                        x = typeof w,
                        y = {};
                    "string" == x ? w = o.createListener(w) : "function" == x && (y[h[u]] = w, w = y);
                    for (var C in w) o.bindListener(c, C, w[C], e)
                }
            }
        },
        getControlStr: function(t) {
            var e = this.that,
                n = t.dataIndx,
                i = t.filter,
                r = " ui-corner-all",
                o = pq.filter.getVal(i),
                a = o[0],
                l = o[1],
                s = o[2],
                d = {
                    column: t,
                    dataIndx: n,
                    condition: s,
                    indx: 0
                },
                c = t.filterUI = pq.filter.getFilterUI(d, e),
                u = c.type,
                h = "";
            "textbox2" == u && (l = null != l ? l : "");
            var f = "pq-grid-hd-search-field " + (c.cls || ""),
                p = c.style || "",
                g = c.attr || "";
            if (u && u.indexOf("textbox") >= 0) a = a ? a : "", f = f + " pq-search-txt" + r, h = "textbox2" == u ? this.betweenTmpl(this._input(t, a, f + " pq-from", p, g, s), this._input(t, l, f + " pq-to", p, g, s)) : this._input(t, a, f, p, g, s);
            else if ("select" === u) {
                f += r;
                var v = ["name='", n, "' class='", f, "' style='", p, "' ", g].join("");
                h = "<input type='text' " + v + " ><span style='position:absolute;right:0;top:3px;' class='ui-icon ui-icon-arrowthick-1-s'></span>"
            } else if ("checkbox" == u) {
                var m = null == a || 0 == a ? "" : "checked=checked";
                h = ["<input ", m, " name='", n, "' type=checkbox class='" + f + "' style='" + p + "' " + g + "/>"].join("")
            } else "string" == typeof u && (h = u);
            return h
        },
        renderFilterCell: function(t, e, n) {
            var i, r, o, a = this,
                l = a.that,
                s = l.options,
                d = s.filterModel,
                c = t.cls,
                u = t.halign || t.align;
            return u && n.push("pq-align-" + u), c && n.push(c), n.push(t.clsHead), t.filter && (o = a.getControlStr(t), o && n.push("pq-col-" + e)), r = a.hasMenu(d, t), r && n.push("pq-has-menu"), i = ["<div class='pq-td-div' style='overflow:hidden;'>", "", o, "</div>", r ? "<span class='pq-filter-icon'></span>" : ""].join("")
        },
        hasMenu: function(t, e) {
            var n = t.menuIcon,
                i = (e.filter || {}).menuIcon;
            return n && i !== !1 || n !== !1 && i
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery.cRefresh = function(e) {
        var n = this;
        n.vrows = [], n.that = e, e.on("dataReadyDone", function() {
            n.addRowIndx(!0)
        }), t(window).on("resize" + e.eventNamespace + " orientationchange" + e.eventNamespace, n.onWindowResize.bind(n))
    };
    t.extend(e, {
        Z: function() {
            return (window.outerWidth - 8) / window.innerWidth
        },
        cssZ: function() {
            return document.body.style.zoom
        },
        isFullScreen: function() {
            return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || window.innerHeight == screen.height
        },
        isSB: function() {
            return t(document).height() > t(window).height()
        }
    }), t(function() {
        var n = e.Z,
            i = e.cssZ,
            r = n(),
            o = i();
        e.isZoom = function() {
            var t = n(),
                e = i();
            return r != t || o != e ? (r = t, o = e, !0) : void 0
        };
        var a = e.isSB,
            l = a();
        t.paramquery.onResize(document.body, function() {
            var e = a();
            e != l && (l = e, t(window).trigger("resize", {
                SB: !0
            }))
        })
    }), t(window).on("resize", function() {
        e.isZoom && (e.ISZOOM = e.isZoom())
    }), e.prototype = {
        addRowIndx: function(t) {
            for (var e, n = this.that, i = n.options.dataModel, r = i.dataUF, o = n.get_p_data(), a = o.length; a--;) e = o[a], e && (e.pq_ri = a);
            if (t)
                for (a = r.length; a--;) delete r[a].pq_ri
        },
        setGridAndCenterHeightForFlex: function() {
            var t = this.that;
            t.element.height(""), t.$grid_center.height(""), t.dims.htGrid = t.element.height()
        },
        setGridWidthForFlex: function() {
            var t = this.that,
                e = t.options,
                n = this.maxWidthPixel,
                i = t.element,
                r = t.$toolPanel[0].offsetWidth,
                o = t.iRenderB.getFlexWidth(),
                a = r + o;
            e.maxWidth && a >= this.maxWidthPixel && (a = n), t._trigger("contWd"), i.width(a + "px"), t.dims.wdGrid = a
        },
        _calcOffset: function(t) {
            var e = /(-|\+)([0-9]+)/,
                n = e.exec(t);
            return n && 3 === n.length ? parseInt(n[1] + n[2]) : 0
        },
        setMax: function(t) {
            var e = this.that,
                n = e.element,
                i = e.options,
                r = i[t];
            r ? (r == parseInt(r) && (r += "px"), n.css(t, r)) : n.css(t, "")
        },
        refreshGridWidthAndHeight: function() {
            var e, n, i = this.that,
                r = i.options,
                o = i.dims,
                a = (r.width + "").indexOf("%") > -1,
                l = (r.height + "").indexOf("%") > -1,
                s = (r.maxHeight + "").indexOf("%") > -1,
                d = "flex" == r.height,
                c = s && d,
                u = (r.maxWidth + "").indexOf("%") > -1,
                h = "flex" == r.width,
                f = u && h,
                p = i.element;
            if (a || l || c || f) {
                var g = p.parent();
                if (!g.length) return;
                var v, m;
                g[0] == document.body || "fixed" == p.css("position") ? (v = t(window).width(), m = window.innerHeight || t(window).height()) : (v = g.width(), m = g.height());
                var w = this._calcOffset,
                    x = a ? w(r.width) : 0,
                    y = l ? w(r.height) : 0;
                f ? e = parseInt(r.maxWidth) * v / 100 : a && (e = parseInt(r.width) * v / 100 + x), c ? n = parseInt(r.maxHeight) * m / 100 : l && (n = parseInt(r.height) * m / 100 + y)
            }
            e || (h && r.maxWidth ? u || (e = r.maxWidth) : a || (e = r.width)), r.maxWidth && (this.maxWidthPixel = e), n || (d && r.maxHeight ? s || (n = r.maxHeight) : l || (n = r.height)), parseFloat(e) == e ? (e = e < r.minWidth ? r.minWidth : e, p.css("width", e)) : "auto" === e && p.width(e), parseFloat(n) == n && (n = n < r.minHeight ? r.minHeight : n, p.css("height", n)), o.wdGrid = Math.round(p.width()), o.htGrid = Math.round(p.height())
        },
        isReactiveDims: function() {
            var t = this.that,
                e = t.options,
                n = e.width,
                i = e.height,
                r = e.maxWidth,
                o = e.maxHeight,
                a = function(t) {
                    return -1 != (t + "").indexOf("%")
                },
                l = a(n),
                s = "auto" === n,
                d = a(i),
                c = a(r),
                u = a(o);
            return l || s || d || c || u
        },
        getParentDims: function() {
            var e, n, i = this.that,
                r = i.element,
                o = r.parent();
            return o.length ? (o[0] == document.body || "fixed" == r.css("position") ? (n = window.innerHeight || t(window).height(), e = t(window).width()) : (n = o.height(), e = o.width()), [e, n]) : []
        },
        onWindowResize: function(n, i) {
            var r, o, a, l, s, d = this,
                c = d.that,
                u = c.dims || {},
                h = u.htParent,
                f = u.wdParent,
                p = c.options,
                g = c.element;
            if (!e.isFullScreen() && !(t.support.touch && p.editModel.indices && t(document.activeElement).is(".pq-editor-focus") || i && (s = i.$grid, s && (s == g || 0 == g.closest(s).length)))) return l = d.isReactiveDims(), e.ISZOOM ? d.setResizeTimer(function() {
                d.refresh({
                    soft: !0
                })
            }) : void(l && d.setResizeTimer(function() {
                if (a = d.getParentDims(), o = a[0], r = a[1], r == h && o == f) {
                    if (parseInt(g.width()) == parseInt(u.wdGrid)) return
                } else u.htParent = r, u.wdParent = o;
                d.refresh({
                    soft: !0
                })
            }))
        },
        setResizeTimer: function(t) {
            var e = this,
                n = e.that;
            clearTimeout(e._autoResizeTimeout), e._autoResizeTimeout = window.setTimeout(function() {
                n.element && (t ? t() : e.refreshAfterResize())
            }, n.options.autoSizeInterval || 100)
        },
        refresh: function(t) {
            t = t || {};
            var e, n = this,
                i = n.that,
                r = null == t.header ? !0 : t.header,
                o = t.pager,
                a = !t.soft,
                l = i.element,
                s = i.$toolPanel,
                d = i.dims = i.dims || {
                    htCenter: 0,
                    htHead: 0,
                    htSum: 0,
                    htBody: 0,
                    wdCenter: 0,
                    htTblSum: 0
                };
            if (t.colModel && i.refreshCM(), !l[0].offsetWidth) return void l.addClass("pq-pending-refresh");
            s.css("height", "1px"), t.toolbar && i.refreshToolbar(), e = i.options, e.collapsible._collapsed = !1, n.setMax("maxHeight"), n.setMax("maxWidth"), n.refreshGridWidthAndHeight(), a && o !== !1 && i._refreshPager(), d.htCenter = n.setCenterHeight(), d.wdCenter = d.wdGrid - s[0].offsetWidth, i.iRenderB.init({
                header: r,
                soft: t.soft,
                source: t.source
            }), "flex" == e.height && n.setGridAndCenterHeightForFlex(), "flex" == e.width && n.setGridWidthForFlex();
            var c = this.getParentDims();
            d.wdParent = c[0], d.htParent = c[1], a && i._createCollapse(), e.dataModel.postDataOnce = void 0, i._trigger("refreshFull")
        },
        setCenterHeight: function() {
            var t, e = this.that,
                n = e.$top,
                i = e.options;
            return ("flex" !== i.height || i.maxHeight) && (t = e.dims.htGrid - (i.showTop ? n[0].offsetHeight + parseInt(n.css("marginTop")) : 0) - e.$bottom[0].offsetHeight + 1, t = t >= 0 ? t : "", e.$grid_center.height(t)), t
        }
    }, t(function() {})
}(jQuery),
function(t) {
    var e = t.paramquery.cCheckBoxColumn = function(e, n) {
        var i, r, o = this;
        o.that = e, o.options = e.options, n.cbId ? (r = o.colUI = n, i = o.colCB = e.columns[n.cbId]) : i = r = o.colCB = o.colUI = n;
        var a = {
                all: !1,
                header: !1,
                select: !1,
                check: !0,
                uncheck: !1
            },
            l = i.cb = t.extend({}, a, i.cb),
            s = i.dataIndx;
        r._render = o.cellRender(i, r), e.on("dataAvailable", function() {
            e.one("dataReady", function() {
                return o.oneDataReady()
            })
        }).on("dataReady", o.onDataReady.bind(o)).on("valChange", o.onCheckBoxChange(o)).on("cellKeyDown", o.onCellKeyDown.bind(o)).on("refreshHeader", o.onRefreshHeader.bind(o)).on("change", o.onChange(o, e, s, l.check, l.uncheck)), l.select && e.on("rowSelect", o.onRowSelect(o, e)).on("beforeRowSelectDone", o.onBeforeRowSelect(o, e, s, l.check, l.uncheck)), e.on("beforeCheck", o.onBeforeCheck.bind(o))
    };
    e.prototype = t.extend({
        cellRender: function(t, e) {
            var n = this;
            return function(i) {
                var r, o, a, l = this,
                    s = i.rowData,
                    d = t.dataIndx,
                    c = t.cb,
                    u = e.renderLabel,
                    h = e.useLabel;
                if (!(s.pq_gtitle || s.pq_gsummary || i.Export)) return r = c.check === s[d] ? "checked" : "", o = n.isEditable(s, t, i.rowIndx, i.colIndx, d) ? "" : "disabled", u && (a = u.call(l, i)), null == a && (a = t == e ? "" : i.formatVal || i.cellData), [h ? " <label style='width:100%;'>" : "", "<input type='checkbox' ", r, " ", o, " />", a, h ? "</label>" : ""].join("")
            }
        },
        checkAll: function(t, e) {
            t = null == t ? !0 : t;
            var n = this.that,
                i = this.colCB.cb.all,
                r = i ? n.options.dataModel.data : n.pdata;
            return this.checkNodes(r, t, e)
        },
        checkNodes: function(t, e, n) {
            if (t.length) {
                null == e && (e = !0);
                var i = this,
                    r = i.that,
                    o = i.colUI.dataIndx,
                    a = i.colCB,
                    l = a.cb,
                    s = e ? l.check : l.uncheck,
                    d = a.dataIndx,
                    c = t[0],
                    u = c.pq_ri,
                    h = function() {
                        return r.refreshCell({
                            rowIndx: u,
                            dataIndx: o
                        }), !1
                    },
                    f = t.map(function(t) {
                        var e = {},
                            n = {};
                        return e[d] = t[d], n[d] = s, {
                            rowIndx: t.pq_ri,
                            rowData: t,
                            oldRow: e,
                            newRow: n
                        }
                    }),
                    p = {
                        rowIndx: u,
                        rowData: c,
                        dataIndx: o,
                        check: e,
                        rows: f
                    },
                    g = {
                        source: "checkbox"
                    };
                return r._trigger("beforeCheck", n, p) === !1 ? h() : (g.updateList = p.rows, g.history = g.track = l.select ? !1 : null, r._digestData(g) === !1 ? h() : void(l.maxCheck || 1 != g.updateList.length ? r.refresh({
                    header: !1
                }) : r.refreshRow({
                    rowIndx: u
                })))
            }
        },
        isEditable: function(t, e, n, i, r) {
            var o = this.that,
                a = {
                    rowIndx: n,
                    rowData: t,
                    column: e,
                    colIndx: i,
                    dataIndx: r
                };
            return o.isEditable(a)
        },
        onBeforeRowSelect: function(t, e, n, i, r) {
            return function(o, a) {
                if ("checkbox" != a.source) {
                    var l = function(o) {
                        for (var a, l, s, d = o.length, c = e.columns[n], u = e.colIndxs[n]; d--;) s = o[d], a = s.rowIndx, l = s.rowData, t.isEditable(l, c, a, u, n) ? l[n] = l.pq_rowselect ? r : i : o.splice(d, 1)
                    };
                    l(a.addList), l(a.deleteList)
                }
            }
        },
        onCellKeyDown: function(e, n) {
            if (n.dataIndx == this.colUI.dataIndx && (13 == e.keyCode || 32 == e.keyCode)) {
                var i = t(e.originalEvent.target).find("input");
                return i.click(), !1
            }
        },
        onChange: function(t, e, n, i, r) {
            return function(r, o) {
                var a = [],
                    l = [],
                    s = t.colUI.dataIndx,
                    d = function(t, n) {
                        t.length && e._trigger("check", r, {
                            rows: t,
                            dataIndx: s,
                            rowIndx: t[0].rowIndx,
                            rowData: t[0].rowData,
                            check: n
                        })
                    },
                    c = function(t) {
                        t.forEach(function(t) {
                            var e, r = t.newRow,
                                o = t.oldRow;
                            r.hasOwnProperty(n) && (e = r[n], e === i ? a.push(t) : o && o[n] === i && l.push(t))
                        })
                    };
                t.setValCBox(), c(o.addList), c(o.updateList), t.colCB.cb.select && e.SelectRow().update({
                    addList: a,
                    deleteList: l,
                    source: "checkbox"
                }), d(a, !0), d(l, !1)
            }
        },
        onCheckBoxChange: function(t) {
            return function(e, n) {
                return n.dataIndx == t.colUI.dataIndx ? t.checkNodes([n.rowData], n.input.checked, e) : void 0
            }
        },
        onDataReady: function() {
            this.setValCBox()
        },
        oneDataReady: function() {
            var t, e = this.that,
                n = e.get_p_data(),
                i = 0,
                r = n.length,
                o = this.colCB,
                a = o.cb,
                l = o.dataIndx;
            if (null != l && n && a.select)
                for (; r > i; i++)(t = n[i]) && (t[l] === a.check ? t.pq_rowselect = !0 : t.pq_rowselect && (t[l] = a.check))
        },
        onRowSelect: function(t, e) {
            return function(n, i) {
                "checkbox" != i.source && (i.addList.length || i.deleteList.length) && (t.setValCBox(), e.refresh({
                    header: !1
                }))
            }
        }
    }, pq.mixin.ChkGrpTree)
}(jQuery),
function(t) {
    function e(t, e, n) {
        for (var i = 0, r = t.length; r > i; i++) {
            for (var o, a = t[i], l = {}, s = 0, d = e.length; d > s; s++) o = e[s], l[o] = a[o];
            n.push(l)
        }
    }
    var n = t.paramquery,
        i = {};
    i.options = {
        stateColKeys: {
            width: 1,
            filter: ["crules", "mode"],
            hidden: 1
        },
        stateKeys: {
            height: 1,
            width: 1,
            freezeRows: 1,
            freezeCols: 1,
            groupModel: ["dataIndx", "collapsed", "grandSummary"],
            pageModel: ["curPage", "rPP"],
            sortModel: ["sorter"]
        },
        detailModel: {
            cache: !0,
            offset: 100,
            expandIcon: "ui-icon-triangle-1-se glyphicon glyphicon-minus",
            collapseIcon: "ui-icon-triangle-1-e glyphicon glyphicon-plus",
            height: 180
        },
        dragColumns: {
            enabled: !0,
            acceptIcon: "ui-icon-check glyphicon-ok",
            rejectIcon: "ui-icon-closethick glyphicon-remove",
            topIcon: "ui-icon-circle-arrow-s glyphicon glyphicon-circle-arrow-down",
            bottomIcon: "ui-icon-circle-arrow-n glyphicon glyphicon-circle-arrow-up"
        },
        flex: {
            on: !0,
            one: !1,
            all: !0
        },
        track: null,
        mergeModel: {
            flex: !1
        },
        realFocus: !0,
        sortModel: {
            on: !0,
            type: "local",
            multiKey: "shiftKey",
            number: !0,
            single: !0,
            cancel: !0,
            sorter: [],
            useCache: !0,
            ignoreCase: !1
        },
        filterModel: {
            on: !0,
            newDI: [],
            type: "local",
            mode: "AND",
            header: !1,
            timeout: 400
        }
    }, i._create = function() {
        var t = this,
            e = t.options;
        t.listeners = {}, t._queueATriggers = {}, t.iHistory = new n.cHistory(t), t.iGroup = new n.cGroup(t), t.iMerge = new n.cMerge(t), t.iFilterData = new n.cFilterData(t), t.iSelection = new r.Selection(t), t.iHeaderSearch = new n.cHeaderSearch(t), t.iUCData = new n.cUCData(t), t.iMouseSelection = new n.cMouseSelection(t), t._super(), new n.cFormula(t), t.iDragColumns = new n.cDragColumns(t), t.refreshToolbar(), "remote" === e.dataModel.location && t.refresh(), t.on("dataAvailable", function() {
            t.one("refreshDone", function() {
                t._trigger("ready"), setTimeout(function() {
                    t.element && t._trigger("complete")
                }, 0)
            })
        }), t.refreshDataAndView({
            header: !0
        })
    }, t.widget("paramquery.pqGrid", n._pqGrid, i), t.widget.extend = function() {
        var e, n, i = Array.prototype.shift,
            r = t.isPlainObject,
            o = t.isArray,
            a = t.widget.extend,
            l = i.apply(arguments);
        "boolean" == typeof l && (e = l, l = i.apply(arguments));
        var s, d, c, u = arguments,
            h = 0,
            f = u.length;
        for (null == e && (e = f > 1); f > h; h++) {
            s = u[h];
            for (d in s) c = s[d], void 0 !== c && (n = !(h > 0), r(c) ? (l[d] = l[d] || {}, a(n, l[d], c)) : o(c) ? l[d] = e && n ? c.slice() : c : l[d] = c)
        }
        return l
    };
    var r = window.pq = window.pq || {};
    r.grid = function(e, n) {
        var i = t(e).pqGrid(n),
            r = i.data("paramqueryPqGrid") || i.data("paramquery-pqGrid");
        return r
    }, r.grid.render = {}, n.pqGrid.regional = {};
    var o = n.pqGrid.prototype;
    n.pqGrid.defaults = o.options, o.focus = function(e) {
        var n, i, r, o, a, l, s, d, c = e || {},
            u = this,
            h = u.options,
            f = c.$td,
            p = document.activeElement,
            g = u.$cont,
            v = g[0],
            m = c.rowIndxPage,
            w = c.colIndx;
        if (f) null != m && null != w || (r = this.getCellIndices({
            $td: f
        }), m = r.rowIndxPage, w = r.colIndx);
        else {
            if (null == m || null == w) {
                if (i = this._focusEle, p && p != document.body && "pq-grid-excel" != p.id && "pq-body-outer" != p.className) return void(o = !0);
                i ? (m = i.rowIndxPage, w = i.colIndx) : o = !0
            }
            null != m && (s = u.iMerge, l = m + u.riOffset, s.ismergedCell(l, w) && (d = s.getRootCellO(l, w), m = d.rowIndxPage, w = d.colIndx), f = u.getCell({
                rowIndxPage: m,
                colIndx: w
            }))
        }
        if (null != m && null != w) {
            var x = f[0] && this.iRenderB.inViewport(m, w, f[0]);
            x ? (p != document.body && t(p).blur(), g.find(".pq-focus").removeAttr("tabindex").removeClass("pq-focus"), g.removeAttr("tabindex"), i = this._focusEle = this._focusEle || {}, f && (n = f[0]) && f.hasClass("pq-grid-cell") && !n.edited ? (i.$ele && i.$ele.length && i.$ele[0].removeAttribute("tabindex"), i.$ele = f, i.rowIndxPage = m, i.colIndx = w, n.setAttribute("tabindex", "-1"), o || (f.addClass("pq-focus"), n.focus())) : (a = h.dataModel.data, a && a.length || v.setAttribute("tabindex", 0))) : (i = this._focusEle, i && g.find(".pq-focus").removeClass("pq-focus"), f && (f.addClass("pq-focus"), this._focusEle = {
                $ele: f,
                rowIndxPage: m,
                colIndx: w
            }), document.activeElement != v && (g.attr("tabindex", 0), v.focus()))
        }
    }, o.onfocus = function(t) {
        var e = this._focusEle;
        e && this.getCell(e).addClass("pq-focus")
    }, o.onblur = function() {
        var t = this._focusEle;
        if (t) {
            var e = (t.rowIndxPage, t.colIndx, document.activeElement);
            this.$cont.find(".pq-focus").removeClass("pq-focus"), e && e != document.body && "pq-grid-excel" != e.id && "pq-body-outer" != e.className && (this._focusEle = {})
        }
    }, o.callFn = function(t, e) {
        return r.getFn(t).call(this, e)
    }, o.rowExpand = function(t) {
        this.iHierarchy.rowExpand(t)
    }, o.rowInvalidate = function(t) {
        this.iHierarchy.rowInvalidate(t)
    }, o.rowCollapse = function(t) {
        this.iHierarchy.rowCollapse(t)
    }, o._saveState = function(e, n, i) {
        var r, o, a, l;
        for (r in i) o = i[r], o && (a = e[r], t.isArray(o) ? null != a && (l = n[r] = t.isPlainObject(n[r]) ? n[r] : {}, o.forEach(function(t) {
            l[t] = a[t]
        })) : n[r] = a)
    }, o.saveState = function(t) {
        t = t || {};
        for (var e, n, i, r, o = this, a = o.element, l = o.options, s = l.stateColKeys, d = l.stateKeys, c = o.colModel, u = [], h = 0, f = c.length, p = a[0].id; f > h; h++) n = c[h], e = n.dataIndx, i = {
            dataIndx: e
        }, o._saveState(n, i, s), u[h] = i;
        return r = {
            colModel: u,
            datestamp: Date.now()
        }, o._saveState(l, r, d), t.stringify !== !1 && (r = JSON.stringify(r), t.save !== !1 && "undefined" != typeof Storage && localStorage.setItem("pq-grid" + (p || ""), r)), r
    }, o.getState = function() {
        return "undefined" != typeof Storage ? localStorage.getItem("pq-grid" + (this.element[0].id || "")) : void 0
    }, o.loadState = function(e) {
        e = e || {};
        var n, i = this,
            r = t.widget.extend,
            o = e.state || i.getState();
        if (!o) return !1;
        "string" == typeof o && (o = JSON.parse(o));
        for (var a, l, s, d = o.colModel, c = [], u = [], h = i.options, f = h.stateColKeys, p = i.depth > 1, g = p ? i.colModel : h.colModel, v = 0, m = d.length; m > v; v++) a = d[v], s = a.dataIndx, c[s] = a, u[s] = v;
        for (p || g.sort(function(t, e) {
                return u[t.dataIndx] - u[e.dataIndx]
            }), v = 0, m = g.length; m > v; v++) l = g[v], s = l.dataIndx, (a = c[s]) && i._saveState(a, l, f);
        return i.iCols.init(), r(h.sortModel, o.sortModel), r(h.pageModel, o.pageModel), i.Group().option(o.groupModel, !1), n = {
            freezeRows: o.freezeRows,
            freezeCols: o.freezeCols
        }, isNaN(1 * h.height) || isNaN(1 * o.height) || (n.height = o.height), isNaN(1 * h.width) || isNaN(1 * o.width) || (n.width = o.width), i.option(n), e.refresh !== !1 && i.refreshDataAndView(), !0
    }, o.refreshToolbar = function() {
        var e, n = this,
            i = n.options,
            o = i.toolbar;
        if (n._toolbar && (e = n._toolbar, e.destroy()), o) {
            var a = o.cls,
                a = a ? a : "",
                l = o.style,
                l = l ? l : "",
                s = o.attr,
                s = s ? s : "",
                d = o.items,
                c = t("<div class='" + a + "' style='" + l + "' " + s + " ></div>");
            e ? e.widget().replaceWith(c) : n.$top.append(c), e = r.toolbar(c, {
                items: d,
                gridInstance: n,
                bootstrap: i.bootstrap
            }), i.showToolbar || c.css("display", "none"), n._toolbar = e
        }
    }, o.isLeftOrRight = function(t) {
        var e = (this.options, this.freezeCols);
        return t > e ? "right" : "left"
    }, o.ovCreateHeader = function(t) {
        this.options.filterModel.header && this.iHeaderSearch.createDOM(t)
    }, o.filter = function(t) {
        return this.iFilterData.filter(t)
    }, o.Checkbox = function(t) {
        return this.iCheckBox[t]
    }, o._initTypeColumns = function() {
        for (var t = this.colModel, e = 0, i = t.length, r = this.iCheckBox = {}; i > e; e++) {
            var o = t[e],
                a = o.type;
            "checkbox" == a || "checkBoxSelection" == a ? (o.type = "checkbox", r[o.dataIndx] = new n.cCheckBoxColumn(this, o)) : "detail" == a && (o.dataIndx = "pq_detail", this.iHierarchy = new n.cHierarchy(this, o))
        }
    }, o.refreshHeader = function() {
        this.iRenderHead.refreshHS()
    }, o.refreshHeaderFilter = function(t) {
        var e = this.normalize(t),
            n = e.colIndx,
            i = e.column,
            r = this.iRenderHead,
            o = {},
            a = r.rows - 1;
        this.options.filterModel.header && (r.refreshCell(a, n, o, i), r.postRenderCell(i, n, a))
    }, o._refreshHeaderSortIcons = function() {
        this.iHeader.refreshHeaderSortIcons()
    }, o.pageData = function() {
        return this.pdata
    }, o.getData = function(t) {
        t = t || {};
        var n = t.dataIndx,
            i = n ? n.length : 0,
            r = t.data,
            o = !i,
            a = this.columns,
            l = this.options.dataModel,
            s = l.dataPrimary || l.data || [],
            d = l.dataUF || [],
            c = [];
        if (!i) return d.length ? s.concat(d) : s;
        r ? e(r, n, c) : (e(s, n, c), e(d, n, c));
        for (var u = [], h = n.reduce(function(t, e) {
                var n = a[e];
                return n && t.push({
                    dataIndx: e,
                    dir: "up",
                    dataType: n.dataType,
                    sortType: n.sortType
                }), t
            }, []), f = {}, p = 0, g = c.length; g > p; p++) {
            var v = c[p],
                m = JSON.stringify(v);
            f[m] || (u.push(v), f[m] = 1)
        }
        return u = this.iSort._sortLocalData(h, u, o)
    }, o.getPlainOptions = function(e, n) {
        var i = e[0];
        if (t.isPlainObject(i)) {
            var r = Object.keys(i);
            r[0] !== n && 1 == r.length && (e = e.map(function(t) {
                var e, i = {};
                for (e in t) i[n] = e, i.pq_label = t[e];
                return i
            }))
        } else e = e.map(function(t) {
            var e = {};
            return e[n] = t, e
        });
        return e
    }, o.getDataCascade = function(t, e, n) {
        var i, r, o = this,
            a = o.options.filterModel,
            l = a.newDI.slice(),
            s = e ? [e, t] : [t],
            d = l.indexOf(t),
            c = a.mode;
        return "AND" == c && l.length && "remote" != a.type && (d >= 0 && l.splice(d, l.length), l.length && (i = l.map(function(t) {
            var e = o.getColumn({
                    dataIndx: t
                }).filter,
                n = e.crules || [e];
            return {
                dataIndx: t,
                crules: n,
                mode: e.mode
            }
        }), r = o.filter({
            data: o.getData(),
            mode: "AND",
            rules: i
        }))), s = s.concat(n || []), o.getData({
            data: r,
            dataIndx: s
        })
    }, o.removeNullOptions = function(t, e, n) {
        var i;
        return null == n ? t.filter(function(t) {
            var n = t[e];
            return null != n && "" !== n ? !0 : i ? void 0 : (i = !0, t[e] = "", !0)
        }) : t.filter(function(t) {
            var n = t[e];
            return null != n && "" !== n
        })
    }, o.get_p_data = function() {
        var t, e, n, i, r = this.options,
            o = r.pageModel,
            a = o.type,
            l = r.dataModel.data,
            s = this.pdata,
            d = [];
        return a ? (e = o.rPP, n = this.riOffset, !s.length && l.length && (s = l.slice(n, n + e)), t = "remote" == a, d = t ? new Array(n) : l.slice(0, n), i = t ? [] : l.slice(n + e), d.concat(s, i)) : s.length ? s : l
    }, o._onDataAvailable = function(t) {
        t = t || {}, this.pdata = [];
        var e = this.options,
            n = !t.data,
            i = t.source,
            r = t.sort,
            o = [],
            a = e.filterModel,
            l = e.dataModel,
            s = e.sortModel;
        return n !== !1 && t.trigger !== !1 && this._trigger("dataAvailable", t.evt, {
            source: i
        }), o = a && a.on && "local" == a.type ? this.iFilterData.filterLocalData(t).data : l.data, "local" == s.type && r !== !1 && (n ? this.sort({
            refresh: !1
        }) : o = this.iSort.sortLocalData(o, !0)), n === !1 ? o : void this.refreshView(t)
    }, o.reset = function(e) {
        e = e || {};
        var n, i, r = this,
            o = e.sort,
            a = r.options,
            l = e.refresh !== !1,
            s = t.extend,
            d = e.filter,
            c = e.group;
        (o || d || c) && (o && (n = o === !0 ? {
            sorter: []
        } : o, s(a.sortModel, n)), d && !l && this.iFilterData.clearFilters(r.colModel), c && (i = c === !0 ? {
            dataIndx: []
        } : c, r.groupOption(i, !1)), l && (d ? (r.filter({
            oper: "replace",
            rules: []
        }), r.refreshHeader()) : o ? r.sort() : r.refreshView()))
    }, o._trigger = n._trigger, o.on = n.on, o.one = n.one, o.off = n.off, o.pager = function() {
        return this.pagerW = this.pagerW || this.widget().find(".pq-pager").pqPager("instance"), this.pagerW
    }, o.toolbar = function() {
        return this._toolbar.element
    }, o.Columns = function() {
        return this.iCols
    }
}(jQuery),
function(t) {
    var e = t.paramquery;
    e.cColModel = function(t) {
        this.that = t, this.vciArr, this.ciArr, this.init()
    }, e.cColModel.prototype = {
        alter: function(t) {
            var e = this.that;
            t.call(e), e.refreshCM(), e.refresh()
        },
        assignRowSpan: function() {
            for (var t, e, n, i, r, o = this.that, a = o.colModel.length, l = o.headerCells, s = o.depth, d = 0; a > d; d++)
                for (n = 0; s > n; n++)
                    if (t = l[n][d], !(d > 0 && t == l[n][d - 1] || n > 0 && t == l[n - 1][d])) {
                        for (r = 1, i = n + 1; s > i; i++) e = l[i][d], t == e && r++;
                        t.rowSpan = r
                    }
            return l
        },
        autoGenColumns: function() {
            var e = this.that,
                n = e.options,
                i = n.columnTemplate || {},
                r = i.dataType,
                o = i.title,
                a = i.width,
                l = n.dataModel.data,
                s = pq.validation,
                d = [];
            if (l && l.length) {
                var c = l[0];
                t.each(c, function(t, e) {
                    var n = "string";
                    s.isInteger(e) ? n = e + "".indexOf(".") > -1 ? "float" : "integer" : s.isDate(e) ? n = "date" : s.isFloat(e) && (n = "float"), d.push({
                        dataType: r ? r : n,
                        dataIndx: t,
                        title: o ? o : t,
                        width: a ? a : 100
                    })
                })
            }
            n.colModel = d
        },
        cacheIndices: function() {
            for (var t, e, n = this.that, i = "JSON" == this.getDataType(), r = {}, o = {}, a = {}, l = n.colModel, s = 0, d = l.length, c = 0, u = this.vciArr = [], h = this.ciArr = []; d > s; s++) {
                var f = l[s],
                    p = f.dataIndx;
                null == p && (p = "detail" == f.type ? "pq_detail" : i ? "dataIndx_" + s : s, "pq_detail" == p && (f.dataType = "object"), f.dataIndx = p), r[p] = f, o[p] = s, t = f.validations, t && (a[p] = a), f.hidden || (h[c] = s, u[s] = c, c++), f.align || (e = f.dataType, !e || "integer" != e && "float" != e || (f.align = "right"))
            }
            n.columns = r, n.colIndxs = o, n.validations = a
        },
        collapse: function(t) {
            var e, n, i, r = t.collapsible,
                o = r.on || !1,
                a = t.colModel || [],
                l = a.length,
                s = l,
                d = 0,
                c = r.last,
                u = c ? l - 1 : 0;
            if (l) {
                for (; s--;) e = a[s], null === c ? (i = e.showifOpen === o, i && d++) : i = u === s ? !1 : o, e.hidden = i, i || !(n = e.colModel) || e.collapsible || this.each(function(t) {
                    t.hidden = i
                }, n);
                d == l && this.each(function(t) {
                    t.hidden = !1
                }, [a[0]])
            }
        },
        each: function(t, e) {
            var n = this.that;
            (e || n.options.colModel).forEach(function(e) {
                t.call(n, e), e.colModel && this.each(t, e.colModel)
            }, this)
        },
        extend: function(e, n) {
            for (var i, r, o = t.extend, a = e.length; a--;) {
                var l = e[a];
                for (i in n) void 0 === l[i] && (r = n[i], r && "object" == typeof r ? l[i] = o(!0, {}, r) : l[i] = r)
            }
        },
        find: function(t, e) {
            for (var n, i, r = this.that, o = e || r.options.colModel, a = 0, l = o.length; l > a; a++) {
                if (n = o[a], t.call(r, n)) return n;
                if (n.colModel && (i = this.find(t, n.colModel))) return i
            }
        },
        getHeaderCells: function() {
            for (var t = this.that, e = t.options.colModel, n = t.colModel.length, i = t.depth, r = [], o = 0; i > o; o++) {
                r[o] = [];
                for (var a = 0, l = 0, s = 0; n > s; s++) {
                    var d;
                    if (0 == o) d = e[a];
                    else {
                        var c = r[o - 1][s],
                            u = c.colModel;
                        if (u && 0 != u.length) {
                            for (var h = s - c.leftPos, f = 0, p = 0, g = 0; g < u.length; g++)
                                if (f += u[g].childCount > 0 ? u[g].childCount : 1, f > h) {
                                    p = g;
                                    break
                                }
                            d = u[p]
                        } else d = c
                    }
                    var v = d.childCount ? d.childCount : 1;
                    s == l ? (d.leftPos = s, r[o][s] = d, l += v, e[a + 1] && a++) : r[o][s] = r[o][s - 1]
                }
            }
            return t.headerCells = r, r
        },
        getDataType: function() {
            var t = this.colModel;
            if (t && t[0]) {
                var e = t[0].dataIndx;
                return "string" == typeof e ? "JSON" : "ARRAY"
            }
        },
        getci: function(t) {
            return this.ciArr[t]
        },
        getvci: function(t) {
            return this.vciArr[t]
        },
        getNextVisibleCI: function(t) {
            for (var e = this.vciArr, n = this.that.colModel.length; n > t; t++)
                if (null != e[t]) return t
        },
        getPrevVisibleCI: function(t) {
            var e = this.vciArr;
            for (this.that.colModel.length; t >= 0; t--)
                if (null != e[t]) return t
        },
        getFirstVisibleCI: function() {
            return this.ciArr[0]
        },
        getLastVisibleCI: function() {
            var t = this.ciArr;
            return t[t.length - 1]
        },
        getVisibleTotal: function() {
            return this.ciArr.length
        },
        init: function(t) {
            var e, n, i, r = this,
                o = r.that,
                a = o.options,
                l = a.columnTemplate,
                s = a.colModel;
            s || (r.autoGenColumns(), s = a.colModel), e = r.nestedCols(s), o.depth = e.depth, n = o.colModel = e.colModel, i = n.length, l && r.extend(n, l), r.getHeaderCells(), r.assignRowSpan(), r.cacheIndices(), o._trigger("CMInit", null, t)
        },
        nestedCols: function(t, e, n, i) {
            var r = t.length,
                o = [];
            null == e && (e = 1);
            for (var a = e, l = 0, s = 0, d = 0, c = 0, u = 0; r > u; u++) {
                var h, f = t[u],
                    p = f.colModel;
                i && (f.parent = i), n === !0 && (f.hidden = n), p && p.length ? (f.collapsible && this.collapse(f), h = this.nestedCols(p, e + 1, f.hidden, f), o = o.concat(h.colModel), h.colSpan > 0 ? (h.depth > a && (a = h.depth), f.colSpan = h.colSpan, l += h.colSpan) : f.colSpan = 0, c += h.o_colspan, f.o_colspan = h.o_colspan, f.childCount = h.childCount, d += h.childCount) : (f.hidden ? f.colSpan = 0 : (f.colSpan = 1, l++), c++, f.o_colspan = 1, f.childCount = 0, d++, o.push(f))
            }
            return {
                depth: a,
                colModel: o,
                colSpan: l,
                width: s,
                childCount: d,
                o_colspan: c
            }
        },
        reduce: function(t, e) {
            var n = this.that,
                i = [];
            return (e || n.options.colModel).forEach(function(e, r) {
                var o, a, l = t.call(n, e, r);
                l && (a = l.colModel, a && a.length ? (o = this.reduce(t, a), o.length && (l.colModel = o, i.push(l))) : i.push(l))
            }, this), i
        },
        hide: function(t) {
            var e = this.that,
                n = e.columns;
            t.diShow = t.diShow || [], t.diHide = t.diHide || [], e._trigger("beforeHideCols", null, t) !== !1 && (t.diShow = t.diShow.filter(function(t) {
                var e = n[t];
                return e.hidden ? (delete e.hidden, !0) : void 0
            }), t.diHide = t.diHide.filter(function(t) {
                var e = n[t];
                return e.hidden ? void 0 : (e.hidden = !0, !0)
            }), e.refresh({
                colModel: !0
            }), e._trigger("hideCols", null, t))
        }
    }
}(jQuery),
function(t) {
    function e(e, n) {
        var i = this,
            r = e.options;
        i.that = e, i.type = "detail", i.refreshComplete = !0, i.rowHtDetail = r.detailModel.height, e.on("cellClick", i.toggle.bind(i)).on("cellKeyDown", function(e, n) {
            return e.keyCode == t.ui.keyCode.ENTER ? i.toggle(e, n) : void 0
        }).on("beforeViewEmpty", i.onBeforeViewEmpty.bind(i)).on("autoRowHeight", i.onAutoRowHeight.bind(i)).one("render", function() {
            e.iRenderB.removeView = i.removeView(i, e), e.iRenderB.renderView = i.renderView(i, e)
        }).one("destroy", i.onDestroy.bind(i)), n._render = i.renderCell.bind(i)
    }
    t.extend(t.paramquery.pqGrid.prototype, {
        parent: function() {
            return this._parent
        },
        child: function(t) {
            var e = this.normalize(t),
                n = e.rowData || {},
                i = n.pq_detail || {},
                r = i.child;
            return r
        }
    }), t.paramquery.cHierarchy = e, e.prototype = {
        detachCells: function(t) {
            t.children().detach(), t.remove()
        },
        getCls: function() {
            return "pq-detail-cont-" + this.that.uuid
        },
        getId: function(t) {
            return "pq-detail-" + t + "-" + this.that.uuid
        },
        getRip: function(t) {
            return 1 * t.id.split("-")[2]
        },
        onAutoRowHeight: function() {
            var e = this,
                n = this.that.iRenderB;
            n.$ele.find("." + e.getCls()).each(function(i, r) {
                var o = e.getRip(r),
                    a = n.getHeightCell(o);
                t(r).css("top", a)
            })
        },
        onBeforeViewEmpty: function(t, e) {
            var n = e.rowIndxPage,
                i = this.that.iRenderB,
                r = e.region,
                o = n >= 0 ? "#" + this.getId(n) : "." + this.getCls(),
                a = n >= 0 ? i.$ele.find(o) : i["$c" + r].find(o);
            this.detachCells(a)
        },
        onDestroy: function() {
            (this.that.getData() || []).forEach(function(t) {
                t.child && t.child.remove()
            })
        },
        onResize: function(t, e) {
            var n, i = [];
            e.resize(function() {
                i.push(e[0]), clearTimeout(n), n = setTimeout(function() {
                    var e = t.that.pdata,
                        n = [];
                    i.forEach(function(i) {
                        if (document.body.contains(i)) {
                            var r = t.getRip(i),
                                o = i.offsetHeight,
                                a = e[r],
                                l = a.pq_detail.height || t.rowHtDetail;
                            l != o && (a.pq_detail.height = o, n.push([r, o - l]))
                        }
                    }), i = [], n.length && (t.that._trigger("onResizeHierarchy"), t.softRefresh(n))
                }, 150)
            })
        },
        removeView: function(e, n) {
            var i = n.iRenderB.removeView;
            return function(n, r, o) {
                var a, l, s, d, c = i.apply(this, arguments),
                    u = e.getCls(),
                    h = this.getCellRegion(n, o);
                for (a = n; r >= a; a++) l = this.getRow(a, h), l && 1 == l.children.length && (s = t(l), d = s.children("." + u), 1 == d.length && (e.detachCells(d), l.parentNode.removeChild(l)));
                return c
            }
        },
        renderView: function(e, n) {
            var i = n.iRenderB.renderView;
            return function(r, o, a, l) {
                var s, d, c = i.apply(this, arguments),
                    u = n.iRenderB,
                    h = e.getCls() + " pq-detail",
                    f = n.options,
                    p = f.freezeRows,
                    g = f.detailModel.init,
                    v = this.data;
                if (e.refreshComplete) {
                    for (e.refreshComplete = !1, s = r; o >= s; s++)
                        if (d = v[s], d && !d.pq_hidden) {
                            var m = d.pq_detail = d.pq_detail || {},
                                w = m.show,
                                x = m.child;
                            if (!w) continue;
                            x || "function" == typeof g && (x = g.call(n, {
                                rowData: d
                            }), m.child = x);
                            var y = x.parent(),
                                C = u.getHeightCell(s),
                                b = n.dims.wdContLeft + 5,
                                I = "position:absolute;left:0;top:" + C + "px;padding:5px;width:100%;overflow:hidden;padding-left:" + b + "px;";
                            if (y.length) {
                                if (!document.body.contains(y[0])) throw "incorrectly detached detail";
                                y.css({
                                    top: C
                                })
                            } else y = t("<div role='gridcell' id='" + e.getId(s) + "' class='" + h + "' style='" + I + "'></div>").append(x), t(u.getRow(s, p > s ? "tr" : "right")).append(y), e.onResize(e, y);
                            for (var _, q, D = y.find(".pq-grid"), R = 0, M = D.length; M > R; R++) _ = t(D[R]), q = _.pqGrid("instance"), q._parent = n, _.hasClass("pq-pending-refresh") && _.is(":visible") && (_.removeClass("pq-pending-refresh"), q.refresh())
                        }
                    return e.refreshComplete = !0, c
                }
            }
        },
        renderCell: function(t) {
            var e, n = this.that.options.detailModel,
                i = t.cellData,
                r = t.rowData;
            return r.pq_gsummary || r.pq_gtitle ? "" : (e = i && i.show ? n.expandIcon : n.collapseIcon, "<div class='ui-icon " + e + "'></div>")
        },
        rowExpand: function(t) {
            var e, n = this.that,
                i = n.normalize(t),
                r = n.options,
                o = i.rowData,
                a = i.rowIndxPage,
                l = r.detailModel,
                s = "pq_detail";
            if (o) {
                if (n._trigger("beforeRowExpand", null, i) === !1) return;
                e = o[s] = o[s] || {}, e.show = !0, l.cache || this.rowInvalidate(i), this.softRefresh([
                    [a, e.height || this.rowHtDetail]
                ], i)
            }
        },
        rowInvalidate: function(t) {
            var e = this.that,
                n = e.getRowData(t),
                i = "pq_detail",
                r = n[i],
                o = r ? r.child : null;
            o && (o.remove(), n[i].child = null)
        },
        rowCollapse: function(t) {
            var e = this.that,
                n = e.options,
                i = e.normalize(t),
                r = i.rowData,
                o = i.rowIndxPage,
                a = n.detailModel,
                l = "pq_detail",
                s = r ? r[l] : null;
            if (s && s.show) {
                if (i.close = !0, e._trigger("beforeRowExpand", null, i) === !1) return;
                a.cache || this.rowInvalidate(i), s.show = !1, this.softRefresh([
                    [o, -(s.height || this.rowHtDetail)]
                ], i)
            }
        },
        softRefresh: function(t, e) {
            var n = this.that,
                i = n.iRenderB;
            i.initRowHtArrDetailSuper(t), i.setPanes(), i.setCellDims(!0), e && n.refreshRow(e), i.refresh()
        },
        toggle: function(t, e) {
            var n, i = this.that,
                r = e.column,
                o = e.rowData,
                a = e.rowIndx,
                l = this.type;
            o.pq_gtitle || o.pq_gsummary || r && r.type === l && (n = o.pq_detail = o.pq_detail || {}, i[n.show ? "rowCollapse" : "rowExpand"]({
                rowIndx: a
            }))
        }
    }
}(jQuery),
function(t) {
    var e = function(t) {
        var e = this;
        e.that = t, e["class"] = "pq-grid-overlay", e.ranges = [], t.on("assignTblDims", e.onRefresh(e, t))
    };
    t.paramquery.cCells = e, e.prototype = {
        addBlock: function(t, e) {
            if (t && this.addUnique(this.ranges, t)) {
                var n = this.that,
                    i = t.r1,
                    r = t.c1,
                    o = t.r2,
                    a = t.c2,
                    l = this.serialize(i, r, o, a),
                    s = l + " " + t.type,
                    d = l + " pq-number-overlay",
                    c = l + " pq-head-overlay",
                    u = n.iRenderB,
                    h = function(t, e) {
                        return u.getCellCont(t, e)
                    },
                    f = this.shiftRC(i, r, o, a);
                if (f) {
                    i = f[0], r = f[1], o = f[2], a = f[3];
                    var p, g, v, m, w, x, y, C, b, I, _ = h(i, r),
                        q = h(o, a);
                    if (f = u.getCellXY(i, r), w = f[0] - 1, x = f[1] - 1, f = u.getCellCoords(o, a), y = f[2], C = f[3], b = C - x, I = y - w, _ == q ? this.addLayer(w, x, b, I, s, _) : (p = h(i, a), g = h(o, r), v = _[0].offsetWidth, m = _[0].offsetHeight, g == _ ? (this.addLayer(w, x, b, v - w, s, _, "border-right:0;"), this.addLayer(0, x, b, y, s, q, "border-left:0;")) : _ == p ? (this.addLayer(w, x, m - x, I, s, _, "border-bottom:0;"), this.addLayer(w, 0, C, I, s, q, "border-top:0;")) : (this.addLayer(w, x, m - x, v - w, s, _, "border-right:0;border-bottom:0"), this.addLayer(0, x, m - x, y, s, p, "border-left:0;border-bottom:0"), this.addLayer(w, 0, C, v - w, s, g, "border-right:0;border-top:0"), this.addLayer(0, 0, C, y, s, q, "border-left:0;border-top:0"))), I = n.options.numberCell.outerWidth || 0, this.addLayer(0, x, b, I, d, u.$clt, ""), this.addLayer(0, x, b, I, d, u.$cleft, ""), 0 != n.options.showHeader) {
                        u = n.iRenderHead, f = u.getCellXY(0, r), w = f[0], x = f[1], f = u.getCellCoords(n.headerCells.length - 1, a), y = f[2], C = f[3], b = C - x, I = y - w;
                        var D = u.$cright;
                        this.addLayer(w, x, b, I, c, D, ""), D = u.$cleft, this.addLayer(w, x, b, I, c, D, "")
                    }
                }
            }
        },
        addLayer: function(e, n, i, r, o, a, l) {
            var s = "left:" + e + "px;top:" + n + "px;height:" + i + "px;width:" + r + "px;" + (l || "");
            t("<svg class='" + this["class"] + " " + o + "' style='" + s + "'></svg>").appendTo(a)
        },
        addUnique: function(t, e) {
            var n = t.filter(function(t) {
                return e.r1 == t.r1 && e.c1 == t.c1 && e.r2 == t.r2 && e.c2 == t.c2
            })[0];
            return n ? void 0 : (t.push(e), !0)
        },
        getLastVisibleFrozenCI: function() {
            for (var t = this.that, e = t.colModel, n = t.options.freezeCols - 1; n >= 0; n--)
                if (!e[n].hidden) return n
        },
        getLastVisibleFrozenRIP: function() {
            for (var t = this.that, e = t.get_p_data(), n = t.riOffset, i = t.options.freezeRows + n - 1; i >= n; i--)
                if (!e[i].pq_hidden) return i - n
        },
        getSelection: function() {
            var t = this.that,
                e = t.get_p_data(),
                n = t.colModel,
                i = [];
            return this.ranges.forEach(function(t) {
                var r, o, a, l = t.r1,
                    s = t.r2,
                    d = t.c1,
                    c = t.c2;
                for (o = l; s >= o; o++)
                    for (r = e[o], a = d; c >= a; a++) i.push({
                        dataIndx: n[a].dataIndx,
                        colIndx: a,
                        rowIndx: o,
                        rowData: r
                    })
            }), i
        },
        isSelected: function(t) {
            var e = this.that,
                n = e.normalize(t),
                i = n.rowIndx,
                r = n.colIndx;
            return null == r || null == i ? null : !!this.ranges.find(function(t) {
                var e = t.r1,
                    n = t.r2,
                    o = t.c1,
                    a = t.c2;
                return i >= e && n >= i && r >= o && a >= r ? !0 : void 0
            })
        },
        onRefresh: function(t, e) {
            var n;
            return function() {
                clearTimeout(n), n = setTimeout(function() {
                    e.element && (t.removeAll(), e.Selection().address().forEach(function(e) {
                        t.addBlock(e)
                    }))
                }, 50)
            }
        },
        removeAll: function() {
            var t = this.that,
                e = t.$cont,
                n = t.$header;
            e && (e.children().children().children("svg").remove(), n.children().children().children("svg").remove()), this.ranges = []
        },
        removeBlock: function(t) {
            if (t) {
                var e, n = t.r1,
                    i = t.c1,
                    r = t.r2,
                    o = t.c2,
                    a = this.that,
                    l = this.ranges.findIndex(function(t) {
                        return n == t.r1 && i == t.c1 && r == t.r2 && o == t.c2
                    });
                l >= 0 && (this.ranges.splice(l, 1), e = "." + this["class"] + "." + this.serialize(n, i, r, o), a.$cont.find(e).remove(), a.$header.find(e).remove())
            }
        },
        serialize: function(t, e, n, i) {
            return "r1" + t + "c1" + e + "r2" + n + "c2" + i
        },
        shiftRC: function(t, e, n, i) {
            var r, o = this.that,
                a = o.iMerge,
                l = o.options,
                s = o.pdata.length,
                d = l.freezeRows,
                c = o.riOffset;
            return t -= c, n -= c, t = d > t ? Math.max(t, Math.min(0, n)) : t, t >= s || 0 > n ? void 0 : (n = Math.min(n, s - 1), t += c, n += c, a.ismergedCell(t, e) && (r = a.getRootCell(t, e), t = r.o_ri, e = r.o_ci), a.ismergedCell(n, i) && (r = a.getRootCell(n, i), n = r.o_ri + r.o_rc - 1, i = r.o_ci + r.o_cc - 1), t -= c, n -= c, t = Math.max(t, 0), n = Math.min(n, s - 1), i = Math.min(i, o.colModel.length - 1), [t, e, n, i])
        }
    }
}(jQuery),
function(t) {
    function e(t) {
        t.shiftKey && "pqGrid:mousePQUp" != t.type || (this._trigger("selectEnd", null, {
            selection: this.Selection()
        }), this.off("mousePQUp", e), this.off("keyUp", e))
    }
    t.paramquery.pqGrid.prototype.Range = function(t, e) {
        return new n.Range(this, t, "range", e)
    };
    var n = window.pq = window.pq || {};
    n.extend = function(t, e, n) {
        var i = function() {};
        i.prototype = t.prototype;
        var r = e.prototype = new i,
            o = t.prototype;
        for (var a in n) {
            var l = o[a],
                s = n[a];
            l ? r[a] = function(t, e) {
                return function() {
                    var n, i = this._super;
                    return this._super = function() {
                        return t.apply(this, arguments)
                    }, n = e.apply(this, arguments), this._super = i, n
                }
            }(l, s) : r[a] = s
        }
        r.constructor = e, r._base = t, r._bp = function(t) {
            var e = arguments;
            return Array.prototype.shift.call(e), o[t].apply(this, e)
        }
    };
    var i = n.Range = function(t, e, n, r) {
        if (null == t) throw "invalid param";
        return this.that = t, this._areas = [], this instanceof i == 0 ? new i(t, e, n, r) : (this._type = n || "range", void this.init(e, r))
    };
    i.prototype = t.extend({
        add: function(t) {
            this.init(t)
        },
        address: function() {
            return this._areas
        },
        addressLast: function() {
            var t = this.address();
            return t[t.length - 1]
        },
        clear: function() {
            return this.copy({
                copy: !1,
                cut: !0,
                source: "clear"
            })
        },
        clearOther: function(t) {
            var e, n = this._normal(t, !0),
                i = this.address();
            for (e = i.length - 1; e >= 0; e--) {
                var r = i[e];
                r.r1 == n.r1 && r.c1 == n.c1 && r.r2 == n.r2 && r.c2 == n.c2 || i.splice(e, 1)
            }
        },
        newLine: function(t) {
            return '"' + t.replace(/"/g, '""') + '"'
        },
        _copyArea: function(t, e, n, i, r, o, a, l, s, d, c) {
            var u, h, f, p, g, v, m, w, x = this.that,
                y = x.readCell,
                C = this.getRenderVal,
                b = x.iMerge,
                I = [],
                _ = x.riOffset,
                q = x.iRenderB;
            for (g = n; i >= g; g++) m = r[g], w = m.dataType, I[g] = !w || "string" == w || "html" == w;
            for (p = t; e >= p; p++) {
                var D = [],
                    R = l[p],
                    M = {},
                    T = {},
                    k = {
                        rowIndx: p,
                        rowIndxPage: p - _,
                        rowData: R,
                        Export: !0,
                        exportClip: !0
                    };
                for (g = n; i >= g; g++) m = r[g], v = m.dataIndx, m.copy !== !1 && (u = R[v], d && (h = y(R, m, b, p, g), h === u && (k.colIndx = g, k.column = m, k.dataIndx = v, h = C(k, c, q)[0], I[g] && /(\r|\n)/.test(h) && (h = this.newLine(h))), D.push(h)), s && void 0 !== u && (M[v] = void 0, T[v] = u));
                s && a.push({
                    rowIndx: p,
                    rowData: R,
                    oldRow: T,
                    newRow: M
                }), f = D.join("	"), D = [], o.push(f || " ")
            }
        },
        copy: function(t) {
            t = t || {};
            var e, n, i, r, o, a = this.that,
                l = t.dest,
                s = !!t.cut,
                d = null == t.copy ? !0 : t.copy,
                c = t.source || (s ? "cut" : "copy"),
                u = t.history,
                h = t.allowInvalid,
                f = [],
                p = [],
                g = a.get_p_data(),
                v = a.colModel,
                m = t.render,
                w = this.address();
            if (u = null == u ? !0 : u, h = null == h ? !0 : h, m = null == m ? a.options.copyModel.render : m, w.length) {
                if (w.forEach(function(t) {
                        e = t.type, n = t.r1, i = t.c1, r = "cell" === e ? n : t.r2, o = "cell" === e ? i : t.c2, this._copyArea(n, r, i, o, v, p, f, g, s, d, m)
                    }, this), d) {
                    var x = p.join("\n");
                    if (t.clip) {
                        var y = t.clip;
                        y.val(x), y.select()
                    } else a._setGlobalStr(x)
                }
                if (l) a.paste({
                    dest: l,
                    rowList: f,
                    history: u,
                    allowInvalid: h
                });
                else if (s) {
                    var C = a._digestData({
                        updateList: f,
                        source: c,
                        history: u,
                        allowInvalid: h
                    });
                    C !== !1 && a.refresh({
                        source: "cut",
                        header: !1
                    })
                }
            }
        },
        _countArea: function(t) {
            var e = t,
                n = t.type,
                i = e.r1,
                r = e.c1,
                o = e.r2,
                a = e.c2;
            return "cell" === n ? 1 : "row" === n ? 0 : (o - i + 1) * (a - r + 1)
        },
        count: function() {
            for (var t = "range" === this._type, e = this.address(), n = 0, i = e.length, r = 0; i > r; r++) n += t ? this._countArea(e[r]) : 1;
            return n
        },
        cut: function(t) {
            return t = t || {}, t.cut = !0, this.copy(t)
        },
        getIndx: function(t) {
            return null == t ? this._areas.length - 1 : t
        },
        getValue: function() {
            var t, e, n, i, r, o, a, l, s, d, c = this.address(),
                u = [],
                h = this.that;
            if (c.length) {
                for (t = c[0], i = t.r1, r = t.c1, o = t.r2, a = t.c2, d = h.get_p_data(), l = i; o >= l; l++)
                    for (e = d[l], s = r; a >= s; s++) n = e[h.colModel[s].dataIndx], u.push(n);
                return u
            }
        },
        hide: function(t) {
            t = t || {};
            var e, n = this.that,
                i = n.colModel,
                r = n.get_p_data(),
                o = this._areas;
            o.forEach(function(t) {
                var n = t.type,
                    o = t.r1,
                    a = t.r2,
                    l = t.c1,
                    s = t.c2;
                if ("column" === n)
                    for (e = l; s >= e; e++) i[e].hidden = !0;
                else if ("row" === n)
                    for (e = o; a >= e; e++) r[e].pq_hidden = !0
            }), t.refresh !== !1 && n.refreshView()
        },
        indexOf: function(t) {
            t = this._normal(t);
            for (var e, n = t.r1, i = t.c1, r = t.r2, o = t.c2, a = this.address(), l = 0, s = a.length; s > l; l++)
                if (e = a[l], "row" !== e.type && n >= e.r1 && r <= e.r2 && i >= e.c1 && o <= e.c2) return l;
            return -1
        },
        index: function(t) {
            t = this._normal(t);
            for (var e, n = t.type, i = t.r1, r = t.c1, o = t.r2, a = t.c2, l = this.address(), s = 0, d = l.length; d > s; s++)
                if (e = l[s], n === e.type && i === e.r1 && o === e.r2 && r === e.c1 && a === e.c2) return s;
            return -1
        },
        init: function(t, e) {
            if (e = e !== !1, t)
                if ("function" == typeof t.push)
                    for (var n = 0, i = t.length; i > n; n++) this.init(t[n], e);
                else {
                    var r = this._normal(t, e),
                        o = this._areas = this._areas || [];
                    r && o.push(r)
                }
        },
        merge: function(t) {
            t = t || {};
            var e, n, i = this.that,
                r = i.options,
                o = r.mergeCells,
                a = this._areas,
                l = a[0];
            l && (e = l.r2 - l.r1 + 1, n = l.c2 - l.c1 + 1, (e > 1 || n > 1) && (l.rc = e, l.cc = n, o.push(l), t.refresh !== !1 && i.refreshView()))
        },
        replace: function(t, e) {
            var n = this._normal(t),
                i = this._areas,
                r = this.getIndx(e);
            i.splice(r, 1, n)
        },
        remove: function(t) {
            var e = this._areas,
                n = this.indexOf(t);
            n >= 0 && e.splice(n, 1)
        },
        resize: function(t, e) {
            var n = this._normal(t),
                i = this._areas,
                r = this.getIndx(e),
                o = i[r];
            return ["r1", "c1", "r2", "c2", "rc", "cc", "type"].forEach(function(t) {
                o[t] = n[t]
            }), this
        },
        rows: function(t) {
            var e = this.that,
                i = [],
                r = this.addressLast();
            if (r)
                for (var o = r.r1, a = r.c1, l = r.r2, s = r.c2, d = r.type, c = null == t ? o : o + t, u = null == t ? l : o + t, h = c; u >= h; h++) i.push({
                    r1: h,
                    c1: a,
                    r2: h,
                    c2: s,
                    type: d
                });
            return n.Range(e, i, "row")
        },
        _normal: function(t, e) {
            if (t.type) return t;
            var n;
            if ("function" == typeof t.push) {
                n = [];
                for (var i = 0, r = t.length; r > i; i++) {
                    var o = this._normal(t[i], e);
                    o && n.push(o)
                }
                return n
            }
            var a, l, s = this.that,
                d = s.get_p_data(),
                c = d.length - 1,
                u = s.colModel,
                h = u.length - 1,
                f = t.r1,
                p = t.c1,
                f = f > c ? c : f,
                p = p > h ? h : p,
                g = t.rc,
                v = t.cc,
                m = g ? f + g - 1 : t.r2,
                w = v ? p + v - 1 : t.c2,
                m = m > c ? c : m,
                w = w > h ? h : w;
            return g = m - f + 1, v = w - p + 1, 0 > h || 0 > c ? null : (f > m && (a = f, f = m, m = a), p > w && (a = p, p = w, w = a), null != f || null != p ? (null == f ? (f = 0, m = c, w = null == w ? p : w, l = "column") : null == p ? (!t._type, p = 0, m = null == m ? f : m, w = h, l = t._type || "row") : null == m || f == m && p == w ? (l = "cell", m = f, w = p) : l = "block", e && (n = s.iMerge.inflateRange(f, p, m, w), f = n[0], p = n[1], m = n[2], w = n[3]), t.r1 = f, t.c1 = p, t.r2 = m, t.c2 = w, t.rc = g, t.cc = v, t.type = t.type || l, t) : void 0)
        },
        select: function() {
            var t = this.that,
                e = t.iSelection,
                n = this._areas;
            return n.length && (e.removeAll({
                trigger: !1
            }), n.forEach(function(t) {
                e.add(t, !1)
            }), e.trigger()), this
        },
        unhide: function(t) {
            t = t || {};
            var e, n = this.that,
                i = n.colModel,
                r = n.get_p_data(),
                o = this._areas;
            o.forEach(function(t) {
                var n = t.type,
                    o = t.r1,
                    a = t.r2,
                    l = t.c1,
                    s = t.c2;
                if ("column" === n)
                    for (e = l; s >= e; e++) i[e].hidden = !1;
                else if ("row" === n)
                    for (e = o; a >= e; e++) r[e].pq_hidden = !1
            }), t.refresh !== !1 && n.refreshView()
        },
        unmerge: function(t) {
            t = t || {};
            var e = this.that,
                n = e.options,
                i = n.mergeCells,
                r = this._areas,
                o = r[0];
            if (o) {
                for (var a = 0; a < i.length; a++) {
                    var l = i[a];
                    if (l.r1 === o.r1 && l.c1 === o.c1) {
                        i.splice(a, 1);
                        break
                    }
                }
                t.refresh !== !1 && e.refreshView()
            }
        },
        value: function(t) {
            var e, n, i, r, o, a = 0,
                l = this.that,
                s = l.colModel,
                d = [],
                c = this.address();
            if (void 0 === t) return this.getValue();
            for (var u = 0; u < c.length; u++) {
                e = c[u], n = e.r1, i = e.c1, r = e.r2, o = e.c2;
                for (var h = n; r >= h; h++) {
                    for (var f = l.normalize({
                            rowIndx: h
                        }), p = f.rowData, g = f.rowIndx, v = {}, m = {}, w = i; o >= w; w++) {
                        var x = s[w].dataIndx;
                        m[x] = t[a++], v[x] = p[x]
                    }
                    d.push({
                        rowData: p,
                        rowIndx: g,
                        newRow: m,
                        oldRow: v
                    })
                }
            }
            return d.length && (l._digestData({
                updateList: d,
                source: "range"
            }), l.refresh({
                header: !1
            })), this
        }
    }, n.mixin.render);
    var r = n.Selection = function(e, n) {
        if (null == e) throw "invalid param";
        return this instanceof r == 0 ? new r(e, n) : (this._areas = [], this.that = e, this.iCells = new t.paramquery.cCells(e), void this._base(e, n))
    };
    n.extend(i, r, {
        add: function(t, e) {
            var n = this._normal(t, !0),
                i = this.iCells,
                r = this.indexOf(n);
            r >= 0 || (i.addBlock(n), this._super(n), e !== !1 && this.trigger())
        },
        clearOther: function(t) {
            var e = this.iCells,
                n = this._normal(t, !0);
            this.address().forEach(function(t) {
                t.r1 == n.r1 && t.c1 == n.c1 && t.r2 == n.r2 && t.c2 == n.c2 || e.removeBlock(t)
            }), this._super(n), this.trigger()
        },
        getSelection: function() {
            return this.iCells.getSelection()
        },
        isSelected: function(t) {
            return this.iCells.isSelected(t)
        },
        removeAll: function(t) {
            t = t || {}, this._areas.length && (this.iCells.removeAll(), this._areas = [], t.trigger !== !1 && this.trigger())
        },
        resizeOrReplace: function(t, e) {
            this.resize(t, e) || this.replace(t, e)
        },
        replace: function(t, e) {
            var n = this.iCells,
                i = this._normal(t),
                r = this._areas,
                o = this.getIndx(e),
                a = r[o];
            n.removeBlock(a), n.addBlock(i), this._super(i, o), this.trigger()
        },
        resize: function(t, e) {
            var n = this._normal(t, !0),
                i = n.r1,
                r = n.c1,
                o = n.r2,
                a = n.c2,
                l = this._areas || [];
            if (!l.length) return !1;
            var s = this.getIndx(e),
                d = l[s],
                c = d.r1,
                u = d.c1,
                h = d.r2,
                f = d.c2,
                p = c === i && u === r,
                g = c === i && f === a,
                v = h === o && u === r,
                m = h === o && f === a;
            return p && g && v && m ? !0 : void 0
        },
        selectAll: function(t) {
            t = t || {};
            var e, n = t.type,
                i = this.that,
                r = i.colModel,
                o = t.all,
                a = o ? 0 : i.riOffset,
                l = o ? i.get_p_data().length : i.pdata.length,
                s = r.length - 1,
                d = a + l - 1;
            return "row" === n ? (e = {
                r1: a,
                r2: d
            }, i.Range(e).select()) : (e = {
                r1: a,
                c1: 0
            }, e.r2 = d, e.c2 = s, i.Range(e).select()), this
        },
        trigger: function() {
            var t = this.that;
            t._trigger("selectChange", null, {
                selection: this
            }), t.off("mousePQUp", e), t.off("keyUp", e), t.on("mousePQUp", e), t.on("keyUp", e)
        }
    })
}(jQuery),
function(t) {
    var e = t.paramquery;
    t.widget("paramquery.pqToolbar", {
        options: {
            items: [],
            gridInstance: null,
            events: {
                button: "click",
                select: "change",
                checkbox: "change",
                textbox: "change",
                file: "change"
            }
        },
        _create: function() {
            var n, i, r = this.options,
                o = r.gridInstance,
                a = r.events,
                l = r.bootstrap,
                s = l.on,
                d = o.colModel,
                c = o.options.filterModel.timeout,
                u = r.items,
                h = this.element,
                f = 0,
                p = u.length;
            for (h.addClass("pq-toolbar"); p > f; f++) {
                var g, v, m, w = u[f],
                    x = w.type,
                    y = w.value,
                    C = w.icon,
                    b = w.options || {},
                    I = w.label,
                    i = w.listener,
                    _ = i ? [i] : w.listeners,
                    _ = _ || [function() {}],
                    q = w.cls,
                    D = q ? q : "",
                    D = s && "button" == x ? l.btn + " " + D : D,
                    D = D ? "class='" + D + "'" : "",
                    R = w.style,
                    M = R ? "style='" + R + "'" : "",
                    T = w.attr,
                    k = T ? T : "",
                    E = I ? "<label " + M + ">" + I : "",
                    S = I ? "</label>" : "",
                    P = I && "button" != x && "file" != x ? [D, k] : [D, k, M],
                    P = P.join(" ");
                if (w.options = b, "textbox" == x) v = t([E, "<input type='text' " + P + ">", S].join(""));
                else if ("textarea" == x) v = t([E, "<textarea " + P + "></textarea>", S].join(""));
                else if ("select" == x) "function" == typeof b && (b = b.call(o, {
                    colModel: d
                })), b = b || [], g = e.select({
                    options: b,
                    attr: P,
                    prepend: w.prepend,
                    groupIndx: w.groupIndx,
                    valueIndx: w.valueIndx,
                    labelIndx: w.labelIndx
                }), v = t([E, g, S].join(""));
                else if ("file" == x) v = t(["<label class='btn btn-default' " + P + ">", I || "File", "<input type='file' style='display:none;'>", "</label>"].join(""));
                else if ("checkbox" == x) v = t([I ? "<label " + M + ">" : "", "<input type='checkbox' ", y ? "checked='checked' " : "", P, ">", I ? I + "</label>" : ""].join(""));
                else if ("separator" == x) v = t("<span class='pq-separator' " + [k, M].join(" ") + "></span>");
                else if ("button" == x) {
                    var $ = "";
                    s && ($ = C ? "<span class='glyphicon " + C + "'></span>" : ""), v = t("<button type='button' " + P + ">" + $ + I + "</button>"), t.extend(b, {
                        label: I ? I : !1,
                        icon: C,
                        icons: {
                            primary: s ? "" : C
                        }
                    }), v.button(b)
                } else "string" == typeof x ? v = t(x) : "function" == typeof x && (g = x.call(o, {
                    colModel: d,
                    cls: D
                }), v = t(g));
                v.appendTo(h), m = this.getInner(v, I, x), "checkbox" !== x && void 0 !== y && m.val(y);
                for (var A = 0, H = _.length; H > A; A++) {
                    i = _[A];
                    var F = {};
                    "function" == typeof i ? F[a[x]] = i : F = i;
                    for (n in F) pq.fakeEvent(m, n, c), m.on(n, this._onEvent(o, F[n], w))
                }
            }
        }
    }), t.extend(e.pqToolbar.prototype, {
        getInner: function(e, n, i) {
            var r = e[0];
            return "LABEL" == r.nodeName.toUpperCase() ? t(r.children[0]) : e
        },
        refresh: function() {
            this.element.empty(), this._create()
        },
        _onEvent: function(e, n, i) {
            return function(r) {
                "checkbox" == i.type ? i.value = t(r.target).prop("checked") : i.value = t(r.target).val(), n.call(e, r)
            }
        },
        _destroy: function() {
            this.element.empty().removeClass("pq-toolbar").enableSelection()
        },
        _disable: function() {
            null == this.$disable && (this.$disable = t("<div class='pq-grid-disable'></div>").css("opacity", .2).appendTo(this.element))
        },
        _enable: function() {
            this.$disable && (this.element[0].removeChild(this.$disable[0]), this.$disable = null)
        },
        _setOption: function(t, e) {
            "disabled" == t && (1 == e ? this._disable() : this._enable())
        }
    }), pq.toolbar = function(e, n) {
        var i = t(e).pqToolbar(n),
            r = i.data("paramqueryPqToolbar") || i.data("paramquery-pqToolbar");
        return r
    }
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e.pqGrid.prototype;
    n.options.trackModel = {
        on: !1,
        dirtyClass: "pq-cell-dirty"
    }, e.cUCData = function(t) {
        this.that = t, this.udata = [], this.ddata = [], this.adata = [], this.options = t.options, t.on("dataAvailable", this.onDA(this))
    }, e.cUCData.prototype = {
        add: function(t) {
            for (var e = this.that, n = this.adata, i = this.ddata, r = t.rowData, o = this.options.trackModel, a = o.dirtyClass, l = e.getRecId({
                    rowData: r
                }), s = 0, d = n.length; d > s; s++) {
                var c = n[s];
                if (null != l && c.recId == l) throw "primary key violation";
                if (c.rowData == r) throw "same data can't be added twice."
            }
            for (var s = 0, d = i.length; d > s; s++)
                if (r == i[s].rowData) return void i.splice(s, 1);
            var u = [];
            for (var h in r) u.push(h);
            e.removeClass({
                rowData: r,
                dataIndx: u,
                cls: a
            });
            var t = {
                recId: l,
                rowData: r
            };
            n.push(t)
        },
        commit: function(t) {
            var e = this.that;
            if (null == t) this.commitAddAll(), this.commitUpdateAll(), this.commitDeleteAll();
            else {
                var n = t.history,
                    i = e.options.dataModel,
                    r = [],
                    o = i.recIndx,
                    a = t.type,
                    l = t.rows;
                n = null == n ? !1 : n, "add" == a ? l ? r = this.commitAdd(l, o) : this.commitAddAll() : "update" == a ? l ? this.commitUpdate(l, o) : this.commitUpdateAll() : "delete" == a && (l ? this.commitDelete(l, o) : this.commitDeleteAll()), r.length && (e._digestData({
                    source: "commit",
                    checkEditable: !1,
                    track: !1,
                    history: n,
                    updateList: r
                }), e.refreshView({
                    header: !1
                }))
            }
        },
        commitAdd: function(e, n) {
            var i, r, o, a, l, s, d = this.that,
                c = d.colModel,
                u = c.length,
                h = this.adata,
                f = t.inArray,
                p = h.length,
                g = d.getValueFromDataType,
                v = [],
                m = e.length,
                w = [];
            for (r = 0; m > r; r++)
                for (l = e[r], i = 0; p > i; i++)
                    if (a = h[i].rowData, s = !0, -1 == f(a, w)) {
                        for (o = 0; u > o; o++) {
                            var x = c[o],
                                y = x.dataType,
                                C = x.dataIndx;
                            if (!x.hidden && C != n) {
                                var b = a[C],
                                    b = g(b, y),
                                    I = l[C],
                                    I = g(I, y);
                                if (b !== I) {
                                    s = !1;
                                    break
                                }
                            }
                        }
                        if (s) {
                            var _ = {},
                                q = {};
                            _[n] = l[n], q[n] = a[n], v.push({
                                rowData: a,
                                oldRow: q,
                                newRow: _
                            }), w.push(a);
                            break
                        }
                    }
            var D = [];
            for (i = 0; p > i; i++) a = h[i].rowData, -1 == f(a, w) && D.push(h[i]);
            return this.adata = D, v
        },
        commitDelete: function(t, e) {
            for (var n, i, r, o, a = this.ddata, l = a.length, s = this.udata; l-- && (n = a[l].rowData, i = n[e], r = t.length);)
                for (; r--;)
                    if (i == t[r][e]) {
                        for (t.splice(r, 1), a.splice(l, 1), o = s.length; o--;) s[o].rowData == n && s.splice(o, 1);
                        break
                    }
        },
        commitUpdate: function(e, n) {
            var i, r, o = this.that,
                a = this.options.trackModel.dirtyClass,
                l = this.udata,
                s = l.length,
                d = e.length,
                c = [];
            for (i = 0; s > i; i++) {
                var u = l[i],
                    h = u.rowData,
                    f = u.oldRow;
                if (-1 == t.inArray(h, c))
                    for (r = 0; d > r; r++) {
                        var p = e[r];
                        if (h[n] == p[n]) {
                            c.push(h);
                            for (var g in f) o.removeClass({
                                rowData: h,
                                dataIndx: g,
                                cls: a
                            })
                        }
                    }
            }
            var v = [];
            for (i = 0; s > i; i++) h = l[i].rowData, -1 == t.inArray(h, c) && v.push(l[i]);
            this.udata = v
        },
        commitAddAll: function() {
            this.adata = []
        },
        commitDeleteAll: function() {
            for (var t, e = this.ddata, n = this.udata, i = n.length, r = e.length, o = 0; i > 0 && r > o; o++) {
                for (t = e[o].rowData; i--;) n[i].rowData == t && n.splice(i, 1);
                i = n.length
            }
            e.length = 0
        },
        commitUpdateAll: function() {
            for (var t = this.that, e = this.options.trackModel.dirtyClass, n = this.udata, i = 0, r = n.length; r > i; i++) {
                var o = n[i],
                    a = o.oldRow,
                    l = o.rowData;
                for (var s in a) t.removeClass({
                    rowData: l,
                    dataIndx: s,
                    cls: e
                })
            }
            this.udata = []
        },
        "delete": function(t) {
            for (var e = this.that, n = t.rowIndx, i = t.rowIndxPage, r = e.riOffset, n = null == n ? i + r : n, i = null == i ? n - r : i, o = e.options.pageModel.type, a = "remote" == o ? i : n, l = this.adata, s = this.ddata, d = e.getRowData(t), c = 0, u = l.length; u > c; c++)
                if (l[c].rowData == d) return void l.splice(c, 1);
            s.push({
                indx: a,
                rowData: d,
                rowIndx: n
            })
        },
        getChangesValue: function(e) {
            e = e || {};
            for (var n = this.that, i = e.all, r = this.udata, o = this.adata, a = this.ddata, l = [], s = [], d = [], c = [], u = [], h = [], f = 0, p = a.length; p > f; f++) {
                var g = a[f],
                    v = g.rowData,
                    m = {};
                u.push(v);
                for (var w in v) 0 != w.indexOf("pq_") && (m[w] = v[w]);
                h.push(m)
            }
            for (var f = 0, p = r.length; p > f; f++) {
                var g = r[f],
                    x = g.oldRow,
                    v = g.rowData;
                if (-1 == t.inArray(v, u) && -1 == t.inArray(v, l)) {
                    var m = {};
                    if (i !== !1)
                        for (var w in v) 0 != w.indexOf("pq_") && (m[w] = v[w]);
                    else {
                        for (var w in x) m[w] = v[w];
                        m[n.options.dataModel.recIndx] = g.recId
                    }
                    l.push(v), s.push(m), d.push(x)
                }
            }
            for (var f = 0, p = o.length; p > f; f++) {
                var g = o[f],
                    v = g.rowData,
                    m = {};
                for (var w in v) 0 != w.indexOf("pq_") && (m[w] = v[w]);
                c.push(m)
            }
            return {
                updateList: s,
                addList: c,
                deleteList: h,
                oldList: d
            }
        },
        getChanges: function() {
            for (var e = (this.that, this.udata), n = this.adata, i = this.ddata, r = t.inArray, o = [], a = [], l = [], s = [], d = 0, c = i.length; c > d; d++) {
                var u = i[d],
                    h = u.rowData;
                s.push(h)
            }
            for (var d = 0, c = e.length; c > d; d++) {
                var u = e[d],
                    f = u.oldRow,
                    h = u.rowData; - 1 == r(h, s) && -1 == r(h, o) && (o.push(h), a.push(f))
            }
            for (var d = 0, c = n.length; c > d; d++) {
                var u = n[d],
                    h = u.rowData;
                l.push(h)
            }
            return {
                updateList: o,
                addList: l,
                deleteList: s,
                oldList: a
            }
        },
        getChangesRaw: function() {
            var t = (this.that, this.udata),
                e = this.adata,
                n = this.ddata,
                i = {
                    updateList: [],
                    addList: [],
                    deleteList: []
                };
            return i.updateList = t, i.addList = e, i.deleteList = n, i
        },
        isDirty: function(t) {
            var e = this.that,
                n = this.udata,
                i = this.adata,
                r = this.ddata,
                o = !1,
                a = e.getRowData(t);
            if (a)
                for (var l = 0; l < n.length; l++) {
                    var s = n[l];
                    if (a == s.rowData) {
                        o = !0;
                        break
                    }
                } else(n.length || i.length || r.length) && (o = !0);
            return o
        },
        onDA: function(t) {
            return function(e, n) {
                "filter" != n.source && (t.udata = [], t.ddata = [], t.adata = [])
            }
        },
        rollbackAdd: function(t, e) {
            for (var n = this.adata, i = [], r = (t.type, 0), o = n.length; o > r; r++) {
                var a = n[r],
                    l = a.rowData;
                i.push({
                    type: "delete",
                    rowData: l
                })
            }
            return this.adata = [], i
        },
        rollbackDelete: function(t, e) {
            for (var n = this.ddata, i = [], r = (t.type, n.length - 1); r >= 0; r--) {
                var o = n[r],
                    a = (o.indx, o.rowIndx),
                    l = o.rowData;
                i.push({
                    type: "add",
                    rowIndx: a,
                    newRow: l
                })
            }
            return this.ddata = [], i
        },
        rollbackUpdate: function(t, e) {
            for (var n = this.that, i = this.options.trackModel.dirtyClass, r = this.udata, o = [], a = 0, l = r.length; l > a; a++) {
                var s = r[a],
                    d = s.recId,
                    c = s.rowData,
                    u = {},
                    h = s.oldRow;
                if (null != d) {
                    var f = [];
                    for (var p in h) u[p] = c[p], f.push(p);
                    n.removeClass({
                        rowData: c,
                        dataIndx: f,
                        cls: i,
                        refresh: !1
                    }), o.push({
                        type: "update",
                        rowData: c,
                        newRow: h,
                        oldRow: u
                    })
                }
            }
            return this.udata = [], o
        },
        rollback: function(t) {
            var e = this.that,
                n = e.options.dataModel,
                i = e.options.pageModel,
                r = t && null != t.refresh ? t.refresh : !0,
                o = t && null != t.type ? t.type : null,
                a = [],
                l = [],
                s = [],
                d = n.data;
            null != o && "update" != o || (l = this.rollbackUpdate(i, d)), null != o && "delete" != o || (a = this.rollbackDelete(i, d)), null != o && "add" != o || (s = this.rollbackAdd(i, d)), e._digestData({
                history: !1,
                allowInvalid: !0,
                checkEditable: !1,
                source: "rollback",
                track: !1,
                addList: a,
                updateList: l,
                deleteList: s
            }), r && e.refreshView({
                header: !1
            })
        },
        update: function(e) {
            var n = this.that,
                i = this.options.trackModel,
                r = i.dirtyClass,
                o = e.rowData || n.getRowData(e),
                a = n.getRecId({
                    rowData: o
                }),
                l = e.dataIndx,
                s = e.refresh,
                d = n.columns,
                c = n.getValueFromDataType,
                u = e.row,
                h = this.udata,
                f = h.slice(0),
                p = !1;
            if (null != a) {
                for (var g = 0, v = h.length; v > g; g++) {
                    var m = h[g],
                        w = m.oldRow;
                    if (m.rowData == o) {
                        p = !0;
                        for (var l in u) {
                            var x = d[l],
                                y = x.dataType,
                                C = u[l],
                                C = c(C, y),
                                b = w[l],
                                b = c(b, y);
                            if (w.hasOwnProperty(l) && b === C) {
                                var I = {
                                    rowData: o,
                                    dataIndx: l,
                                    refresh: s,
                                    cls: r
                                };
                                n.removeClass(I), delete w[l]
                            } else {
                                var I = {
                                    rowData: o,
                                    dataIndx: l,
                                    refresh: s,
                                    cls: r
                                };
                                n.addClass(I), w.hasOwnProperty(l) || (w[l] = o[l])
                            }
                        }
                        t.isEmptyObject(w) && f.splice(g, 1);
                        break
                    }
                }
                if (!p) {
                    var w = {};
                    for (var l in u) {
                        w[l] = o[l];
                        var I = {
                            rowData: o,
                            dataIndx: l,
                            refresh: s,
                            cls: r
                        };
                        n.addClass(I)
                    }
                    var I = {
                        rowData: o,
                        recId: a,
                        oldRow: w
                    };
                    f.push(I)
                }
                this.udata = f
            }
        }
    }, n.getChanges = function(t) {
        if (this.blurEditor({
                force: !0
            }), t) {
            var e = t.format;
            if (e) {
                if ("byVal" == e) return this.iUCData.getChangesValue(t);
                if ("raw" == e) return this.iUCData.getChangesRaw()
            }
        }
        return this.iUCData.getChanges()
    }, n.rollback = function(t) {
        this.blurEditor({
            force: !0
        }), this.iUCData.rollback(t)
    }, n.isDirty = function(t) {
        return this.iUCData.isDirty(t)
    }, n.commit = function(t) {
        this.iUCData.commit(t)
    }, n.updateRow = function(t) {
        var e, n = this,
            i = t.rowList || [{
                rowIndx: t.rowIndx,
                newRow: t.newRow || t.row,
                rowData: t.rowData,
                rowIndxPage: t.rowIndxPage
            }],
            r = [];
        if (n.normalizeList(i).forEach(function(t) {
                var e, n = t.newRow,
                    i = t.rowData,
                    o = t.oldRow = {};
                if (i) {
                    for (e in n) o[e] = i[e];
                    r.push(t)
                }
            }), r.length) {
            var o = {
                    source: t.source || "update",
                    history: t.history,
                    checkEditable: t.checkEditable,
                    track: t.track,
                    allowInvalid: t.allowInvalid,
                    updateList: r
                },
                a = this._digestData(o);
            if (a === !1) return !1;
            t.refresh !== !1 && (r = o.updateList, e = r.length, e > 1 ? n.refresh({
                header: !1
            }) : 1 == e && n.refreshRow({
                rowIndx: r[0].rowIndx
            }))
        }
    }, n.getRecId = function(t) {
        var e = this,
            n = e.options.dataModel;
        t.dataIndx = n.recIndx;
        var i = e.getCellData(t);
        return null == i ? null : i
    }, n.getCellData = function(t) {
        var e = t.rowData || this.getRowData(t),
            n = t.dataIndx;
        return e ? e[n] : null
    }, n.getRowData = function(t) {
        if (!t) return null;
        var e, n = t.rowData;
        if (null != n) return n;
        if (e = t.recId, null == e) {
            var i = t.rowIndx,
                i = null != i ? i : t.rowIndxPage + this.riOffset,
                r = this.get_p_data(),
                o = r[i];
            return o
        }
        for (var a = this.options, l = a.dataModel, s = l.recIndx, d = l.data, c = 0, u = d.length; u > c; c++) {
            var o = d[c];
            if (o[s] == e) return o
        }
        return null
    }, n.addNodes = function(t, e) {
        e = null == e ? this.options.dataModel.data.length : e, this._digestData({
            addList: t.map(function(t) {
                return {
                    rowIndx: e++,
                    newRow: t
                }
            }),
            source: "addNodes"
        }), this.refreshView()
    }, n.deleteNodes = function(t) {
        this._digestData({
            deleteList: t.map(function(t) {
                return {
                    rowData: t
                }
            }),
            source: "deleteNodes"
        }), this.refreshView()
    }, n.moveNodes = function(t, e) {
        var n = this,
            i = n.options,
            r = n.riOffset,
            o = i.dataModel.data;
        e = null == e ? o.length : e, n._trigger("beforeMoveNode"), t.forEach(function(t) {
            e = pq.moveItem(t, o, o.indexOf(t), e)
        }), o != n.pdata && (n.pdata = o.slice(r, i.pageModel.rPP + r)), n._trigger("moveNode"), n.refresh()
    }, n.deleteRow = function(t) {
        var e = this,
            n = e.normalizeList(t.rowList || [{
                rowIndx: t.rowIndx,
                rowIndxPage: t.rowIndxPage,
                rowData: t.rowData
            }]);
        return n.length ? (this._digestData({
            source: t.source || "delete",
            history: t.history,
            track: t.track,
            deleteList: n
        }), void(t.refresh !== !1 && e.refreshView({
            header: !1
        }))) : !1
    }, n.addRow = function(t) {
        var e, n, i = this,
            r = i.riOffset,
            o = i.options.dataModel,
            a = o.data = o.data || [];
        return t.rowData && (t.newRow = t.rowData), null != t.rowIndxPage && (t.rowIndx = t.rowIndxPage + r), n = t.rowList || [{
            rowIndx: t.rowIndx,
            newRow: t.newRow
        }], n.length && this._digestData({
            source: t.source || "add",
            history: t.history,
            track: t.track,
            checkEditable: t.checkEditable,
            addList: n
        }) !== !1 ? (t.refresh !== !1 && this.refreshView({
            header: !1
        }), e = n[0].rowIndx, null == e ? a.length - 1 : e) : !1
    }
}(jQuery),
function() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(t) {
        return setTimeout(t, 10)
    }, window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(t) {
        clearTimeout(t)
    }
}(),
function(t) {
    function e(t) {
        var e = this;
        e.that = t, t.on("mousePQUp", e.onMousePQUp.bind(e)).on("cellClick", e.onCellClick.bind(e)).on("cellMouseDown", e.onCellMouseDown.bind(e)).on("cellMouseEnter", e.onCellMouseEnter.bind(e)).on("refresh refreshRow", e.onRefresh.bind(e))
    }
    var n = t.paramquery;
    n.cMouseSelection = e, e.prototype = t.extend({
        onCellMouseDown: function(t, e) {
            if (!t.isDefaultPrevented()) {
                var n = this.that,
                    i = e.rowIndx,
                    r = n.iSelection,
                    o = e.colIndx,
                    a = n.options.selectionModel,
                    l = a.type,
                    s = a.mode,
                    d = r.addressLast();
                if ("cell" !== l) return void n.focus(e);
                if (null != o) {
                    if (-1 == o) {
                        if (!a.row) return;
                        o = void 0
                    }
                    if (t.shiftKey && "single" !== s && d && null != d.firstR) {
                        var c = d.firstR,
                            u = d.firstC;
                        r.resizeOrReplace({
                            r1: c,
                            c1: u,
                            r2: i,
                            c2: o,
                            firstR: c,
                            firstC: u
                        })
                    } else pq.isCtrl(t) && "single" !== s ? (this.mousedown = {
                        r1: i,
                        c1: o
                    }, n.Selection().add({
                        r1: i,
                        c1: o,
                        firstR: i,
                        firstC: o
                    })) : (this.mousedown = {
                        r1: i,
                        c1: o
                    }, r.clearOther({
                        r1: i,
                        c1: o
                    }), r.resizeOrReplace({
                        r1: i,
                        c1: o,
                        firstR: i,
                        firstC: o
                    }));
                    return n.focus(e), !0
                }
            }
        },
        onCellMouseEnter: function(t, e) {
            var n = this.that,
                i = n.options.selectionModel,
                r = i.type,
                o = this.mousedown,
                a = i.mode;
            if (o && "single" !== a) {
                if ("cell" === r) {
                    var l = o.r1,
                        s = o.c1,
                        d = e.rowIndx,
                        c = e.colIndx,
                        u = n.Selection();
                    n.scrollCell({
                        rowIndx: d,
                        colIndx: c
                    }), u.resizeOrReplace({
                        r1: l,
                        c1: s,
                        r2: d,
                        c2: c
                    })
                }
                n.focus(e)
            }
        },
        onCellClick: function(t, e) {
            var n, i = this.that,
                r = i.options.selectionModel,
                o = "single" == r.mode,
                a = r.toggle,
                l = i.iRows;
            if ("row" == r.type) {
                if (!r.row && -1 == e.colIndx) return;
                n = l.isSelected(e), o && !n || a || !pq.isCtrl(t) ? !o && t.shiftKey ? l.extend(e) : !o || n && a ? (e.isFirst = !0, l[a ? "toggle" : "replace"](e)) : n || l.replace(e) : (e.isFirst = !0, l.toggle(e))
            }
        },
        onMousePQUp: function() {
            this.mousedown = null
        },
        onRefresh: function() {
            var t = this.that;
            this.setTimer(function() {
                t.element && t.focus()
            }, 300)
        }
    }, new n.cClass)
}(jQuery),
function(t) {
    var e = null,
        n = !1,
        i = "pq-grid-excel",
        r = t.paramquery,
        o = r.pqGrid.prototype;
    t.extend(o.options, {
        copyModel: {
            on: !0,
            render: !1,
            header: !0,
            zIndex: 1e4
        },
        cutModel: {
            on: !0
        },
        pasteModel: {
            on: !0,
            compare: "byVal",
            select: !0,
            validate: !0,
            allowInvalid: !0,
            type: "replace"
        }
    }), t.extend(o, {
        _setGlobalStr: function(t) {
            a.clip = t
        },
        canPaste: function() {
            return !!r.cExcel.clip
        },
        clearPaste: function() {
            r.cExcel.clip = ""
        },
        copy: function() {
            return this.iSelection.copy()
        },
        cut: function() {
            return this.iSelection.copy({
                cut: !0,
                source: "cut"
            })
        },
        paste: function(t) {
            e = new a(this), e.paste(t), e = null
        },
        clear: function() {
            var t = this.iSelection;
            t.address().length ? t.clear() : this.iRows.toRange().clear()
        }
    });
    var a = r.cExcel = function(t, e) {
        this.that = t
    };
    a.clip = "", a.prototype = {
        createClipBoard: function() {
            var e = this.that,
                n = t("#pq-grid-excel-div"),
                r = e.options.copyModel,
                o = t("#" + i);
            0 == o.length && (n = t("<div id='pq-grid-excel-div'  style='position:fixed;top:20px;left:20px;height:1px;width:1px;overflow:hidden;z-index:" + r.zIndex + ";'/>").appendTo(document.body), o = t("<textarea id='" + i + "' autocomplete='off' spellcheck='false' style='overflow:hidden;height:10000px;width:10000px;opacity:0' />").appendTo(n), o.css({
                opacity: 0
            }).on("keyup", function(t) {
                pq.isCtrl(t) && e.element && e._trigger("keyUp", t)
            })), o.on("focusin", function(t) {
                t.stopPropagation()
            }), o.select()
        },
        destroyClipBoard: function() {
            this.clearClipBoard();
            var e = this.that,
                n = t(window).scrollTop(),
                i = t(window).scrollLeft();
            e.focus();
            var r = t(window).scrollTop(),
                o = t(window).scrollLeft();
            n == r && i == o || window.scrollTo(i, n)
        },
        clearClipBoard: function() {
            var e = t("#" + i);
            e.val("")
        },
        copy: function(t) {
            var e = this.that,
                n = e.iSelection;
            return n.address().length ? n.copy(t) : void e.iRows.toRange().copy(t)
        },
        getRows: function(t) {
            return t = t.replace(/\n$/, ""), t = t.replace(/(^|\t|\n)"(?=[^\t]*?[\r\n])([^"]|"")*"(?=$|\t|\n)/g, function(t) {
                return t.replace(/(\r\n|\n)/g, "\r").replace(/^(\t|\n)?"/, "$1").replace(/"$/, "").replace(/""/g, '"')
            }), t.split("\n")
        },
        paste: function(e) {
            e = e || {};
            var n = this.that,
                i = e.dest,
                r = e.clip,
                o = e.text || (r ? r.length ? r.val() : "" : a.clip),
                l = this.getRows(o),
                s = l.length,
                d = n.colModel,
                c = n.options,
                u = n.readCell,
                h = c.pasteModel,
                f = "row",
                p = !1,
                g = d.length;
            if (h.on && 0 != o.length && 0 != s) {
                for (var v = 0; s > v; v++) l[v] = l[v].split("	");
                var m, w, x, y, C = h.type,
                    b = i ? n.Range(i) : n.Selection(),
                    I = b.address(),
                    _ = I.length ? I : n.iRows.toRange().address(),
                    q = _[0],
                    D = {
                        rows: l,
                        areas: [q]
                    };
                if (n._trigger("beforePaste", null, D) === !1) return !1;
                q && n.getRowData({
                    rowIndx: q.r1
                }) ? (f = "row" == q.type ? "row" : "cell", m = q.r1, x = q.r2, w = q.c1, y = q.c2) : (f = "cell", m = 0, x = 0, w = 0, y = 0);
                var R, M;
                "replace" == C ? (R = m, M = s > x - m + 1 ? "extend" : "repeat") : "append" == C ? (R = x + 1, M = "extend") : "prepend" == C && (R = m, M = "extend");
                var T, k, E, S = "extend" == M ? s : x - m + 1,
                    P = 0,
                    $ = [],
                    A = [],
                    H = 0;
                for (v = 0; S > v; v++) {
                    var F = l[P],
                        O = v + R,
                        V = "replace" == C ? n.getRowData({
                            rowIndx: O
                        }) : null,
                        L = V ? {} : null,
                        N = {};
                    void 0 === F && "repeat" === M && (P = 0, F = l[P]), P++;
                    var B = F,
                        U = B.length;
                    if (!k)
                        if ("cell" == f) {
                            if (T = U > y - w + 1 ? "extend" : "repeat", k = "extend" == T ? U : y - w + 1, isNaN(k)) throw "lenH NaN. assert failed.";
                            k + w > g && (k = g - w)
                        } else k = g, w = 0;
                    var z = 0,
                        j = 0,
                        W = 0;
                    for (E = k, j = 0; E > j; j++) {
                        z >= U && (z = 0);
                        var G = j + w,
                            K = d[G],
                            Q = B[z],
                            X = K.dataIndx;
                        K.copy !== !1 ? (z++, N[X] = Q, L && (L[X] = u(V, K))) : (W++, "extend" == T && g > E + w && E++)
                    }
                    0 == t.isEmptyObject(N) && (null == V ? (p = !0, $.push({
                        newRow: N,
                        rowIndx: O
                    })) : A.push({
                        newRow: N,
                        rowIndx: O,
                        rowData: V,
                        oldRow: L
                    }), H++)
                }
                var Y = {
                    addList: $,
                    updateList: A,
                    source: "paste",
                    allowInvalid: h.allowInvalid,
                    validate: h.validate
                };
                n._digestData(Y), n[p ? "refreshView" : "refresh"]({
                    header: !1
                }), h.select && n.Range({
                    r1: R,
                    c1: w,
                    r2: R + H - 1,
                    c2: "extend" == T ? w + k - 1 + W : y
                }).select(), n._trigger("paste", null, D)
            }
        }
    }, t(document).unbind(".pqExcel").bind("keydown.pqExcel", function(r) {
        if (pq.isCtrl(r)) {
            var o = t(r.target);
            if (!o.hasClass("pq-grid-cell") && !o.is("#" + i) && !o.hasClass("pq-body-outer")) return;
            var s, d = o.closest(".pq-grid");
            if (e || o.length && d.length) {
                if (!e) {
                    try {
                        if (s = d.pqGrid("instance"), s.options.selectionModel["native"]) return !0
                    } catch (c) {
                        return !0
                    }
                    e = new a(s, o), e.createClipBoard()
                }
                if ("67" == r.keyCode || "99" == r.keyCode) e.copy({
                    clip: t("#" + i)
                });
                else if ("88" == r.keyCode) e.copy({
                    cut: !0,
                    clip: t("#" + i)
                });
                else if ("86" == r.keyCode || "118" == r.keyCode) n = !0, e.clearClipBoard(), window.setTimeout(function() {
                    e && (e.paste({
                        clip: t("#" + i)
                    }), e.destroyClipBoard(), e = null), n = !1
                }, 3);
                else {
                    var u = t("#" + i);
                    if (u.length) {
                        var h = document.activeElement;
                        h == u[0] && e.that.onKeyPressDown(r)
                    }
                }
            }
        } else {
            var f = r.keyCode,
                p = t.ui.keyCode,
                g = f == p.UP || f == p.DOWN || f == p.LEFT || f == p.RIGHT || f == p.PAGE_UP || f == p.PAGE_DOWN;
            if (g) {
                if (l) return !1;
                o = t(r.target), (o.hasClass("pq-grid-row") || o.hasClass("pq-grid-cell")) && (l = !0)
            }
        }
    }).bind("keyup.pqExcel", function(i) {
        var r = i.keyCode;
        if (n || !e || pq.isCtrl(i) || -1 == t.inArray(r, [17, 91, 93, 224]) || (e.destroyClipBoard(), e = null), l) {
            var o = t(i.target);
            o.hasClass("pq-grid-row") || o.hasClass("pq-grid-cell") || (l = !1)
        }
    });
    var l = !1
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e.pqGrid.prototype.options,
        i = {
            on: !0,
            checkEditable: !0,
            checkEditableAdd: !1,
            allowInvalid: !0
        };
    n.historyModel = n.historyModel || i;
    var r = e.cHistory = function(t) {
        var e = this;
        this.that = t, this.options = t.options, this.records = [], this.counter = 0, this.id = 0, t.on("keyDown", function(t, n) {
            return e.onKeyDown(t, n)
        }).on("dataAvailable", function(t, n) {
            "filter" != n.source && e.reset()
        })
    };
    r.prototype = {
        onKeyDown: function(t, e) {
            var n = {
                    z: "90",
                    y: "89",
                    c: "67",
                    v: "86"
                },
                i = pq.isCtrl(t);
            return i && t.keyCode == n.z ? (this.undo(), !1) : i && t.keyCode == n.y ? (this.redo(), !1) : void 0
        },
        resetUndo: function() {
            if (0 == this.counter) return !1;
            this.counter = 0;
            var t = this.that;
            t._trigger("history", null, {
                type: "resetUndo",
                num_undo: 0,
                num_redo: this.records.length - this.counter,
                canUndo: !1,
                canRedo: !0
            })
        },
        reset: function() {
            if (0 == this.counter && 0 == this.records.length) return !1;
            this.records = [], this.counter = 0, this.id = 0;
            var t = this.that;
            t._trigger("history", null, {
                num_undo: 0,
                num_redo: 0,
                type: "reset",
                canUndo: !1,
                canRedo: !1
            })
        },
        increment: function() {
            var t = this.records,
                e = t.length;
            if (e) {
                var n = t[e - 1].id;
                this.id = n + 1
            } else this.id = 0
        },
        push: function(e) {
            var n = this.canRedo(),
                i = this.records,
                r = this.counter;
            i.length > r && i.splice(r, i.length - r), i[r] = t.extend({
                id: this.id
            }, e), this.counter++;
            var o, a, l = this.that;
            1 == this.counter && (o = !0), n && this.counter == i.length && (a = !1), l._trigger("history", null, {
                type: "add",
                canUndo: o,
                canRedo: a,
                num_undo: this.counter,
                num_redo: 0
            })
        },
        canUndo: function() {
            return this.counter > 0
        },
        canRedo: function() {
            return this.counter < this.records.length
        },
        processCol: function(t, e) {
            var n = this.that;
            if (t.length) {
                var i = "add" == t.type,
                    i = e ? i : !i;
                n[i ? "addColumn" : "deleteColumn"]({
                    colList: t,
                    history: !1
                })
            }
        },
        undo: function() {
            var t = this.canRedo(),
                e = this.that,
                n = this.options.historyModel,
                i = this.records;
            if (!(this.counter > 0)) return !1;
            this.counter--;
            var r, o, a = this.counter,
                l = i[a],
                s = l.colList || [],
                d = (l.id, l.updateList.map(function(t) {
                    return {
                        rowIndx: e.getRowIndx({
                            rowData: t.rowData
                        }).rowIndx,
                        rowData: t.rowData,
                        oldRow: t.newRow,
                        newRow: t.oldRow
                    }
                })),
                c = l.addList.map(function(t) {
                    return {
                        rowData: t.newRow
                    }
                }),
                u = l.deleteList.map(function(t) {
                    return {
                        newRow: t.rowData,
                        rowIndx: t.rowIndx
                    }
                });
            if (s.length) this.processCol(s);
            else {
                e._digestData({
                    history: !1,
                    source: "undo",
                    checkEditable: n.checkEditable,
                    checkEditableAdd: n.checkEditableAdd,
                    allowInvalid: n.allowInvalid,
                    addList: u,
                    updateList: d,
                    deleteList: c
                });
                e[u.length || c.length ? "refreshView" : "refresh"]({
                    source: "undo",
                    header: !1
                })
            }
            return t === !1 && (r = !0), 0 == this.counter && (o = !1), e._trigger("history", null, {
                canUndo: o,
                canRedo: r,
                type: "undo",
                num_undo: this.counter,
                num_redo: this.records.length - this.counter
            }), !0
        },
        redo: function() {
            var t = this.canUndo(),
                e = this.that,
                n = this.options.historyModel,
                i = this.counter,
                r = this.records;
            if (i == r.length) return !1;
            var o = r[i],
                a = o.colList || [],
                l = (o.id, o.updateList.map(function(t) {
                    return {
                        rowIndx: e.getRowIndx({
                            rowData: t.rowData
                        }).rowIndx,
                        rowData: t.rowData,
                        newRow: t.newRow,
                        oldRow: t.oldRow
                    }
                })),
                s = o.deleteList.map(function(t) {
                    return {
                        rowData: t.rowData
                    }
                }),
                d = o.addList.map(function(t) {
                    return {
                        newRow: t.newRow,
                        rowIndx: t.rowIndx
                    }
                });
            if (a.length) this.processCol(a, !0);
            else {
                e._digestData({
                    history: !1,
                    source: "redo",
                    checkEditable: n.checkEditable,
                    checkEditableAdd: n.checkEditableAdd,
                    allowInvalid: n.allowInvalid,
                    addList: d,
                    updateList: l,
                    deleteList: s
                });
                e[d.length || s.length ? "refreshView" : "refresh"]({
                    source: "redo",
                    header: !1
                })
            }
            this.counter < r.length && this.counter++;
            var c, u;
            return 0 == t && (c = !0), this.counter == this.records.length && (u = !1), e._trigger("history", null, {
                canUndo: c,
                canRedo: u,
                type: "redo",
                num_undo: this.counter,
                num_redo: this.records.length - this.counter
            }), !0
        }
    };
    var o = e.pqGrid.prototype;
    o.history = function(t) {
        var e = t.method;
        return this.iHistory[e](t)
    }, o.History = function() {
        return this.iHistory
    }
}(jQuery),
function(t) {
    var e = t.paramquery;
    pq.filter = {
        dpBeforeShow: function(e, n, i) {
            return function() {
                var r, o, a = e.getDataCascade(n);
                a.length && (r = "" == a[0][n] ? a[1][n] : a[0][n], o = a[a.length - 1][n]), t(this).datepicker("option", "defaultDate", new Date(1 == i ? o : r))
            }
        },
        datepicker: function(e) {
            var n = e.column,
                i = n.dataIndx,
                r = this,
                o = e.filterUI,
                a = e.$editor,
                l = n.dataType,
                s = {
                    dateFormat: o.format || n.format,
                    changeYear: !0,
                    changeMonth: !0
                };
            return "date" == l ? (a.each(function(e, n) {
                var a = t.extend({}, s, 1 == e ? o.dpOptions2 || o.dpOptions : o.dpOptions);
                a.defaultDate || (a.beforeShow = a.beforeShow || pq.filter.dpBeforeShow(r, i, e)), t(n).datepicker(a)
            }), !0) : void 0
        },
        filterFnEq: function(e, n) {
            var i = (e.column || {}).dataType;
            return "date" == i ? this.filterFnTD(e, n) : "bool" == i ? {
                type: "checkbox"
            } : t.extend({
                maxCheck: 1
            }, this.filterFnSelect(e, n))
        },
        filterFnSelect: function(t, e) {
            var n = t.column.dataIndx,
                i = t.indx;
            return {
                type: "select",
                style: "padding-right:16px;cursor:default;",
                attr: "readonly",
                valueIndx: n,
                labelIndx: n,
                options: this.options,
                init: 0 == i ? this.rangeInit.bind(e) : function() {}
            }
        },
        filterFnT: function() {
            return {
                type: "textbox",
                attr: "autocomplete='off'"
            }
        },
        filterFnTD: function() {
            return {
                type: "textbox",
                attr: "autocomplete='off'",
                init: pq.filter.datepicker
            }
        },
        getVal: function(t) {
            var e = (t.crules || [])[0] || {};
            return [e.value, e.value2, e.condition]
        },
        setVal: function(t, e) {
            var n = t.crules = t.crules || [];
            return n[0] = n[0] || {}, n[0].value = e, e
        }
    }, t.extend(pq.filter, {
        conditions: {
            begin: {
                string: 1,
                numberList: 1,
                dateList: 1,
                filterFn: pq.filter.filterFnT
            },
            between: {
                stringList: 1,
                date: 1,
                number: 1,
                filter: {
                    attr: "autocomplete='off'",
                    type: "textbox2",
                    init: pq.filter.datepicker
                }
            },
            contain: {
                string: 1,
                numberList: 1,
                dateList: 1,
                filterFn: pq.filter.filterFnT
            },
            equal: {
                string: 1,
                bool: 1,
                date: 1,
                number: 1,
                filterFn: pq.filter.filterFnEq
            },
            empty: {
                string: 1,
                bool: 1,
                date: 1,
                number: 1,
                nr: 1
            },
            end: {
                string: 1,
                numberList: 1,
                dateList: 1,
                filterFn: pq.filter.filterFnT
            },
            great: {
                stringList: 1,
                number: 1,
                date: 1,
                filterFn: pq.filter.filterFnTD
            },
            gte: {
                stringList: 1,
                number: 1,
                date: 1,
                filterFn: pq.filter.filterFnTD
            },
            less: {
                stringList: 1,
                number: 1,
                date: 1,
                filterFn: pq.filter.filterFnTD
            },
            lte: {
                stringList: 1,
                number: 1,
                date: 1,
                filterFn: pq.filter.filterFnTD
            },
            notbegin: {
                string: 1,
                numberList: 1,
                dateList: 1,
                filterFn: pq.filter.filterFnT
            },
            notcontain: {
                string: 1,
                numberList: 1,
                dateList: 1,
                filterFn: pq.filter.filterFnT
            },
            notequal: {
                string: 1,
                date: 1,
                number: 1,
                bool: 1,
                filterFn: pq.filter.filterFnEq
            },
            notempty: {
                string: 1,
                bool: 1,
                date: 1,
                number: 1,
                nr: 1
            },
            notend: {
                string: 1,
                numberList: 1,
                dateList: 1,
                filterFn: pq.filter.filterFnT
            },
            range: {
                cascade: 1,
                string: 1,
                number: 1,
                date: 1,
                bool: 1,
                filterFn: pq.filter.filterFnSelect
            },
            regexp: {
                string: 1,
                numberList: 1,
                dateList: 1,
                filterFn: pq.filter.filterFnT
            }
        },
        getConditionsCol: function(t, e) {
            var n = e.conditionList || function(e) {
                    var n = e.getConditionsDT(pq.getDataType(t));
                    return n.sort(), n
                }(this),
                i = e.conditionExclude,
                r = {};
            return i && (i.forEach(function(t) {
                r[t] = 1
            }), n = n.filter(function(t) {
                return !r[t]
            })), n
        },
        getConditionsDT: function(t) {
            var e, n, i, r = [],
                o = this.conditions;
            for (e in o) n = o[e], i = n[t + "List"], (n[t] && 0 !== i || i) && r.push(e);
            return r
        },
        getFilterUI: function(e, n) {
            var i = e.column,
                r = i.filterFn,
                o = (0 === e.indx ? i.filter : {}) || {},
                a = this.conditions[e.condition] || {},
                l = a.filterFn,
                s = a.filter || {};
            delete o.type, r = r ? r.call(n, e) || {} : {}, l = l ? l.call(this, e, n) || {} : {};
            var d = t.extend({}, s, l, o, r);
            return d.condition = e.condition, d.init = [], d.options = [], [r, o, l, s].forEach(function(t) {
                t.init && d.init.push(t.init), t.options && d.options.push(t.options)
            }), d
        },
        options: function(t) {
            var e = t.column,
                n = t.filterUI,
                i = n.groupIndx,
                r = e.dataIndx;
            return this.getDataCascade(r, i, n.diExtra)
        },
        getOptions: function(t, e, n) {
            for (var i, r, o = e.options, a = t.dataIndx, l = {
                    column: t,
                    dataIndx: a,
                    filterUI: e,
                    condition: e.condition
                }, s = 0, d = o.length; d > s; s++)
                if (i = o[s], i && (r = "function" == typeof i ? i.call(n, l) : i)) return r = n.getPlainOptions(r, a), r = n.removeNullOptions(r, e.dataIndx || a, e.groupIndx);
            return []
        },
        rangeInit: function(e) {
            var n = this,
                i = e.column,
                r = e.$editor,
                o = e.headMenu,
                a = e.filterUI;
            o || r.parent().off("click keydown").on("click keydown", function(o) {
                if ("keydown" != o.type || o.keyCode == t.ui.keyCode.DOWN) {
                    var l = n.uuid + "_" + i.dataIndx;
                    if (!t("#" + l).length) {
                        var s = new pq.cFilterMenu.select(n, i),
                            d = t("<div id='" + l + "' style='width:270px;' class='pq-theme'><div></div></div>").appendTo(document.body),
                            c = d.children();
                        pq.makePopup(d[0], r), s.create(c, a), d.position({
                            my: "left top",
                            at: "left bottom",
                            of: e.$editor
                        })
                    }
                }
            })
        },
        getType: function(t, e) {
            var n = this.conditions[t] || {},
                i = n.filterFn,
                r = n.filter || {};
            return r.type || (i ? i.call(this, {
                condition: t,
                column: e
            }) : {}).type
        }
    });
    var n = function(t) {
        var e = this;
        e.that = t, t.on("load", e.onLoad.bind(e)).on("filter clearFilter", e.onFilterChange.bind(e))
    };
    e.cFilterData = n;
    var i = n.conditions = {
        equal: function(t, e) {
            return t == e ? !0 : void 0
        },
        notequal: function(t, e) {
            return !i.equal(t, e)
        },
        contain: function(t, e) {
            return -1 != (t + "").indexOf(e) ? !0 : void 0
        },
        notcontain: function(t, e) {
            return !i.contain(t, e)
        },
        empty: function(t) {
            return 0 == t.length ? !0 : void 0
        },
        notempty: function(t) {
            return !i.empty(t)
        },
        begin: function(t, e) {
            return 0 == (t + "").indexOf(e) ? !0 : void 0
        },
        notbegin: function(t, e) {
            return !i.begin(t, e)
        },
        end: function(t, e) {
            t += "", e += "";
            var n = t.lastIndexOf(e);
            return -1 != n && n + e.length == t.length ? !0 : void 0
        },
        notend: function(t, e) {
            return !i.end(t, e)
        },
        regexp: function(t, e) {
            return e.test(t) ? (e.lastIndex = 0, !0) : void 0
        },
        great: function(t, e) {
            return t > e ? !0 : void 0
        },
        gte: function(t, e) {
            return t >= e ? !0 : void 0
        },
        between: function(t, e, n) {
            return t >= e && n >= t ? !0 : void 0
        },
        range: function(e, n) {
            return -1 != t.inArray(e, n) ? !0 : void 0
        },
        less: function(t, e) {
            return e > t ? !0 : void 0
        },
        lte: function(t, e) {
            return e >= t ? !0 : void 0
        }
    };
    n.convert = function(t, e) {
        return null == t || "" === t ? "" : ("string" == e ? t = (t + "").trim().toUpperCase() : "date" == e ? t = Date.parse(t) : "number" == e ? 1 * t == t && (t = 1 * t) : "bool" == e && (t = String(t).toLowerCase()), t)
    }, n.convertEx = function(t, e, n, i) {
        var r = pq.getDataType({
                dataType: e
            }),
            o = pq.filter.conditions[n],
            a = o[r];
        return a ? this.convert(t, r) : o.string ? (i && (t = pq.format(i, t)), "regexp" == n ? t : this.convert(t, "string")) : o.number ? this.convert(t, "number") : void 0
    }, n.prototype = {
        addMissingConditions: function(t) {
            var e = this.that;
            t.forEach(function(t) {
                var n = e.getColumn({
                    dataIndx: t.dataIndx
                }).filter || {};
                t.condition = void 0 === t.condition ? pq.filter.getVal(n)[2] : t.condition
            })
        },
        clearFilters: function(t) {
            t.forEach(function(t) {
                var e = t.filter,
                    n = pq.filter.conditions;
                e && (e.crules || []).forEach(function(t) {
                    (n[t.condition] || {}).nr && (t.condition = void 0), t.value = t.value2 = void 0
                })
            })
        },
        compatibilityCheck: function(t) {
            var e, n = t.data,
                i = "Incorrect filter parameters. Please check upgrade guide";
            if (n)
                if (e = n[0]) {
                    if (e.hasOwnProperty("dataIndx") && e.hasOwnProperty("value")) throw i
                } else if (!t.rules) throw i
        },
        copyRuleToColumn: function(t, e, n) {
            var i = e.filter = e.filter || {},
                r = t.crules || [],
                o = r[0],
                a = o ? o.condition : t.condition,
                l = o ? o.value : t.value,
                s = o ? o.value2 : t.value2;
            "remove" == n ? (i.on = !1, a ? i.crules = [{
                condition: a,
                value: "range" == a ? [] : void 0
            }] : i.crules = void 0) : (i.on = !0, i.mode = t.mode, i.crules = o ? r : [{
                condition: a,
                value: l,
                value2: s
            }])
        },
        filter: function(t) {
            t = t || {}, this.compatibilityCheck(t);
            var e, n, i = this.that,
                r = i.options,
                o = !1,
                a = t.data,
                l = t.rules = t.rules || (t.rule ? [t.rule] : []),
                s = !a,
                d = r.dataModel,
                c = r.filterModel,
                u = t.mode || c.mode,
                h = t.oper,
                f = "replace" == h,
                p = s ? i.colModel : this.getCMFromRules(l),
                g = 0,
                v = l.length;
            if ("remove" != h && this.addMissingConditions(l), s) {
                if (i._trigger("beforeFilter", null, t) === !1) return;
                for (null != t.header && (o = t.header), f && this.clearFilters(p); v > g; g++) e = l[g], n = i.getColumn({
                    dataIndx: e.dataIndx
                }), this.copyRuleToColumn(e, n, h)
            } else
                for (; v > g; g++) e = l[g], n = p[g], this.copyRuleToColumn(e, n);
            var m = {
                header: o,
                CM: p,
                data: a,
                rules: l,
                mode: u
            };
            return "remote" != d.location || "local" == c.type ? (m.source = "filter", m.trigger = !1, i._onDataAvailable(m)) : void i.remoteRequest({
                apply: s,
                CM: p,
                callback: function() {
                    return i._onDataAvailable(m)
                }
            })
        },
        filterLocalData: function(t) {
            t = t || {};
            var e, n, i = this.that,
                r = t.data,
                o = !r,
                a = o ? i.colModel : t.CM,
                l = this.getRulesFromCM({
                    CM: a,
                    apply: o
                }),
                s = i.options,
                d = s.dataModel,
                c = i.iSort,
                u = r || d.data,
                h = d.dataUF = d.dataUF || [],
                f = [],
                p = [],
                g = s.filterModel,
                v = t.mode || g.mode;
            if (o)
                if (h.length) {
                    n = !0;
                    for (var m = 0, w = h.length; w > m; m++) u.push(h[m]);
                    h = d.dataUF = []
                } else {
                    if (!l.length) return {
                        data: u,
                        dataUF: h
                    };
                    c.saveOrder()
                }
            if (g.on && v && l && l.length) {
                if (u.length)
                    if (e = {
                            filters: l,
                            mode: v,
                            data: u
                        }, i._trigger("customFilter", null, e) === !1) f = e.dataTmp, p = e.dataUF;
                    else
                        for (var m = 0, w = u.length; w > m; m++) {
                            var x = u[m];
                            this.isMatchRow(x, l, v) ? f.push(x) : p.push(x)
                        }
                    u = f, h = p, 0 == c.readSorter().length && (u = c.sortLocalData(u)), o && (d.data = u, d.dataUF = h)
            } else n && o && (e = {
                data: u
            }, i._trigger("clearFilter", null, e) === !1 && (u = e.data), 0 == c.readSorter().length && (u = c.sortLocalData(u)), d.data = u, i._queueATriggers.filter = {
                ui: {
                    type: "local"
                }
            });
            return o && (i._queueATriggers.filter = {
                ui: {
                    type: "local",
                    rules: l
                }
            }), {
                data: u,
                dataUF: h
            }
        },
        _getRulesFromCM: function(e, i, r, o, a, l, s) {
            if ("between" === r) "" === o || null == o ? (r = "lte", o = s(a, l, r)) : "" === a || null == a ? (r = "gte", o = s(o, l, r)) : (o = s(o, l, r), a = s(a, l, r));
            else if ("regexp" === r) {
                if ("remote" == e) o = o.toString();
                else if ("string" == typeof o) try {
                    var d = i.modifiers || "gi";
                    o = new RegExp(o, d)
                } catch (c) {
                    o = /.*/
                }
            } else if ("range" === r || t.isArray(o)) {
                if (null == o) return;
                if ("function" == typeof o.push) {
                    if (0 === o.length) return;
                    o = o.slice();
                    for (var u = 0, h = o.length; h > u; u++) o[u] = s(o[u], l, r)
                }
            } else r && (o = s(o, l, r), null != a && (a = s(a, l, r)));
            var f;
            return f = "remote" == e ? "" : ((i.conditions || {})[r] || {}).compare || pq.filter.conditions[r].compare || n.conditions[r], [o, a, f, r]
        },
        getRulesFromCM: function(t) {
            var n = t.CM;
            if (!n) throw "CM N/A";
            for (var i = this, r = n.length, o = 0, a = t.location, l = "remote" === a, s = [], d = e.cFilterData, c = function(t, e, n) {
                    return l ? (t = null == t ? "" : t, t.toString()) : d.convertEx(t, e, n)
                }; r > o; o++) {
                var u = n[o],
                    h = u.filter;
                if (h) {
                    var f, p, g, v, m, w, x = u.dataIndx,
                        y = u.dataType,
                        C = h.crules || [h],
                        b = [];
                    y = y && "stringi" != y && "function" != typeof y ? y : "string", C.forEach(function(t) {
                        v = t.condition, p = t.value, g = t.value2, v && i.isCorrect(v, p, g) && (w = i._getRulesFromCM(a, h, v, p, g, y, c)) && (p = w[0], g = w[1], m = w[2], b.push({
                            condition: w[3],
                            value: p,
                            value2: g,
                            cbFn: m
                        }))
                    }), b.length && (f = {
                        dataIndx: x,
                        dataType: y
                    }, l && 1 == b.length ? (f.value = b[0].value, f.value2 = b[0].value2, f.condition = b[0].condition) : (f.crules = b, f.mode = h.mode, l || (f.column = u)), s.push(f))
                }
            }
            return (t.apply || l) && this.sortRulesAndFMIndx(s), s
        },
        getCMFromRules: function(t) {
            var e = this.that;
            return t.map(function(t) {
                var n = e.getColumn({
                    dataIndx: t.dataIndx
                });
                return JSON.parse(JSON.stringify(n, function(t, e) {
                    return "parent" != t ? e : void 0
                }))
            })
        },
        getQueryStringFilter: function() {
            var t, e = this.that,
                n = e.options,
                i = n.stringify,
                r = n.filterModel,
                o = r.mode,
                a = e.colModel,
                l = r.newDI || [],
                s = this.getRulesFromCM({
                    CM: a,
                    location: "remote"
                }),
                d = "";
            return r && r.on && s && (s.length ? (t = {
                mode: o,
                data: s
            }, d = i === !1 ? t : JSON.stringify(t)) : (d = "", l.length && e._trigger("clearFilter"))), d
        },
        isCorrect: function(t, e, n) {
            var i = pq.filter.conditions,
                r = i[t];
            if (r) return !!(null != e && "" !== e || null != n && "" !== n || r.nr);
            throw "filter condition NA"
        },
        isMatchCell: function(t, e) {
            for (var i, r, o, a, l, s, d, c = t.dataIndx, u = t.column, h = t.dataType, f = t.mode, p = [], g = t.crules, v = g.length, m = e[c], w = 0; v > w; w++) s = g[w], o = s.condition, i = s.value, r = s.value2, a = s.cbFn, o && (d = "regexp" === o ? null == m ? "" : m : n.convertEx(m, h, o, u), p.push(!!a(d, i, r)));
            if (v = p.length, "AND" === f) {
                for (w = 0; v > w; w++)
                    if (l = p[w], !l) return !1;
                return !0
            }
            for (w = 0; v > w; w++)
                if (l = p[w]) return !0;
            return !1
        },
        isMatchRow: function(t, e, n) {
            var i, r, o = 0,
                a = e.length,
                l = "AND" == n,
                s = !l;
            if (0 == a) return !0;
            for (; a > o; o++) {
                if (i = e[o], r = this.isMatchCell(i, t), r && (i.found = !0), s && r) return !0;
                if (l && !r) return !1
            }
            return l
        },
        onFilterChange: function() {
            var t = this.that,
                e = t.options,
                n = t.columns,
                i = e.filterModel,
                r = "remote" == i.type,
                o = i.oldDI || [],
                a = !e.dataModel.data.length,
                l = "pq-col-filtered",
                s = r || a,
                d = (i.rules || []).reduce(function(t, e) {
                    return (e.found || s) && t.push(e.dataIndx), t
                }, []);
            o.forEach(function(e) {
                var i = t.getCellHeader({
                        dataIndx: e
                    }),
                    r = n[e];
                i.length && (i.removeClass(l), t.getCellFilter({
                    dataIndx: e
                }).removeClass(l)), r.clsHead = (r.clsHead || "").split(" ").filter(function(t) {
                    return t !== l
                }).join(" ")
            }), d.forEach(function(e) {
                var i = t.getCellHeader({
                        dataIndx: e
                    }),
                    r = n[e];
                i.length && (i.addClass(l), t.getCellFilter({
                    dataIndx: e
                }).addClass(l)), r.clsHead = (r.clsHead || "") + " " + l
            }), i.oldDI = i.newDI = d
        },
        onLoad: function() {
            var t = this.that.options.dataModel.dataUF;
            t && (t.length = 0)
        },
        sortRulesAndFMIndx: function(t) {
            var e = this.that.options.filterModel,
                n = e.newDI;
            t.sort(function(t, e) {
                var i = t.dataIndx,
                    r = e.dataIndx,
                    o = n.indexOf(i),
                    a = n.indexOf(r);
                return o >= 0 && a >= 0 ? o - a : o >= 0 ? -1 : a >= 0 ? 1 : 0
            }), e.rules = t
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e.cSort = function(t) {
            var e = this;
            e.that = t, e.sorters = [], e.tmpPrefix = "pq_tmp_", e.cancel = !1
        };
    e.pqGrid.prototype.sort = function(t) {
        if (t = t || {}, t.data) return this.iSort._sortLocalData(t.sorter, t.data);
        var e = this,
            n = this.options,
            i = n.dataModel,
            r = i.data,
            o = n.sortModel,
            a = o.type;
        if (r && r.length || "local" != a) {
            var l, s = n.editModel,
                d = this.iSort,
                c = d.getSorter(),
                u = t.evt,
                h = null == t.single ? d.readSingle() : t.single,
                f = d.readCancel();
            if (t.sorter ? t.addon ? (t.single = h, t.cancel = f, l = d.addon(t)) : l = t.sorter : l = d.readSorter(), l.length || c.length) {
                s.indices && e.blurEditor({
                    force: !0
                });
                var p = {
                    dataIndx: l.length ? l[0].dataIndx : null,
                    oldSorter: c,
                    sorter: l,
                    source: t.source,
                    single: h
                };
                if (e._trigger("beforeSort", u, p) === !1) return void d.cancelSort();
                d.resumeSort(), "local" == a && d.saveOrder(), d.setSorter(l), d.setSingle(h), d.writeSorter(l), d.writeSingle(h), "local" == a ? (i.data = d.sortLocalData(r, !t.skipCustomSort), this._queueATriggers.sort = {
                    evt: u,
                    ui: p
                }, t.refresh !== !1 && this.refreshView()) : "remote" == a && (this._queueATriggers.sort = {
                    evt: u,
                    ui: p
                }, t.initByRemote || this.remoteRequest({
                    initBySort: !0,
                    callback: function() {
                        e._onDataAvailable()
                    }
                }))
            }
        }
    }, n.prototype = {
        addon: function(e) {
            e = e || {};
            var n = e.sorter[0],
                i = n.dataIndx,
                r = n.dir,
                o = e.single,
                a = e.cancel,
                l = this.readSorter(),
                s = l[0];
            if (null == o) throw "sort single N/A";
            if (null != i)
                if (o && !e.tempMultiple)
                    if (l = l.length ? [l[0]] : [], s = l[0], s && s.dataIndx == n.dataIndx) {
                        var d = s.dir,
                            c = "up" === d ? "down" : a && "down" === d ? "" : "up";
                        "" === c ? l.length-- : s.dir = c
                    } else c = r || "up", l[0] = t.extend({}, n, {
                        dir: c
                    });
            else {
                var u = this.inSorters(l, i);
                u > -1 ? (d = l[u].dir, "up" == d ? l[u].dir = "down" : a && "down" == d ? l.splice(u, 1) : 1 == l.length ? l[u].dir = "up" : l.splice(u, 1)) : l.push(t.extend({}, n, {
                    dir: "up"
                }))
            }
            return l
        },
        cancelSort: function() {
            this.cancel = !0
        },
        resumeSort: function() {
            this.cancel = !1
        },
        readSorter: function() {
            var t = this.that,
                e = t.columns,
                n = (t.options.sortModel.sorter || []).filter(function(t) {
                    return !!e[t.dataIndx]
                });
            return n = pq.arrayUnique(n, "dataIndx")
        },
        setSingle: function(t) {
            this.single = t
        },
        getSingle: function() {
            return this.single
        },
        readSingle: function() {
            return this.that.options.sortModel.single
        },
        setCancel: function(t) {
            this.cancel = t
        },
        readCancel: function() {
            return this.that.options.sortModel.cancel
        },
        saveOrder: function(t) {
            var e, t, n = this.that,
                i = n.options.dataModel;
            if (!(i.dataUF || []).length && !this.getSorter().length) {
                t = n.get_p_data();
                for (var r = 0, o = t.length; o > r; r++) e = t[r], e && (e.pq_order = r)
            }
        },
        getCancel: function() {
            return this.cancel
        },
        getQueryStringSort: function() {
            if (this.cancel) return "";
            var t = this.that,
                e = this.sorters,
                n = t.options,
                i = n.stringify;
            return e.length ? i === !1 ? e : JSON.stringify(e) : ""
        },
        getSorter: function() {
            return this.sorters
        },
        setSorter: function(t) {
            this.sorters = t.slice(0)
        },
        inSorters: function(t, e) {
            for (var n = 0; n < t.length; n++)
                if (t[n].dataIndx == e) return n;
            return -1
        },
        sortLocalData: function(t, e) {
            var n = this.sorters;
            return n.length || t.length && null != t[0].pq_order && (n = [{
                dataIndx: "pq_order",
                dir: "up",
                dataType: "integer"
            }]), this._sortLocalData(n, t, e)
        },
        compileSorter: function(t, e) {
            var n = this,
                r = n.that,
                o = r.columns,
                a = r.options,
                l = [],
                s = [],
                d = [],
                c = n.tmpPrefix,
                u = a.sortModel,
                h = u.useCache,
                f = u.ignoreCase,
                p = t.length;
            e = e || a.dataModel.data;
            for (var g = 0; p > g; g++) {
                var v = t[g],
                    m = v.sortIndx || v.dataIndx,
                    w = o[m] || {},
                    x = v.dir = v.dir || "up",
                    y = "up" == x ? 1 : -1,
                    C = w.sortType,
                    C = pq.getFn(C),
                    b = w.dataType || v.dataType || "string",
                    b = "string" == b && f ? "stringi" : b,
                    I = h && "date" == b,
                    _ = I ? c + m : m;
                s[g] = _, d[g] = y, C ? l[g] = function(t, e) {
                    return function(n, i, r, o) {
                        return e(n, i, r, o, t)
                    }
                }(C, i.sort_sortType) : "integer" == b ? l[g] = i.sort_number : "float" == b ? l[g] = i.sort_number : "function" == typeof b ? l[g] = function(t, e) {
                    return function(n, i, r, o) {
                        return e(n, i, r, o, t)
                    }
                }(b, i.sort_dataType) : "date" == b ? l[g] = i["sort_date" + (I ? "_fast" : "")] : "bool" == b ? l[g] = i.sort_bool : "stringi" == b ? l[g] = i.sort_locale : l[g] = i.sort_string, I && n.addCache(e, b, m, _)
            }
            return n._composite(l, s, d, p)
        },
        _composite: function(t, e, n, i) {
            return function(r, o) {
                for (var a = 0, l = 0; i > l && (a = t[l](r, o, e[l], n[l]), 0 == a); l++);
                return a
            }
        },
        _sortLocalData: function(t, e, n) {
            if (!e) return [];
            if (!e.length || !t || !t.length) return e;
            var i = this,
                r = i.that,
                o = r.options.sortModel,
                a = i.compileSorter(t, e),
                l = {
                    sort_composite: a,
                    data: e,
                    sorter: t
                };
            return n && r._trigger("customSort", null, l) === !1 ? e = l.data : e.sort(a), o.useCache && i.removeCache(t, e)(), e
        },
        addCache: function(t, e, n, r) {
            for (var o = i["get_" + e], a = t.length; a--;) {
                var l = t[a];
                l[r] = o(l[n])
            }
        },
        removeCache: function(t, e) {
            var n = this.tmpPrefix;
            return function() {
                for (var i = t.length; i--;) {
                    var r = t[i],
                        o = n + r.dataIndx,
                        a = e.length;
                    if (a && e[0].hasOwnProperty(o))
                        for (; a--;) delete e[a][o]
                }
            }
        },
        writeCancel: function(t) {
            this.that.options.sortModel.cancel = t
        },
        writeSingle: function(t) {
            this.that.options.sortModel.single = t
        },
        writeSorter: function(t) {
            var e = this.that.options,
                n = e.sortModel;
            n.sorter = t
        }
    };
    var i = {
        get_date: function(t) {
            var e;
            return t ? isNaN(e = Date.parse(t)) ? 0 : e : 0
        },
        sort_number: function(t, e, n, i) {
            var r = t[n],
                o = e[n];
            return r = r ? 1 * r : 0, o = o ? 1 * o : 0, (r - o) * i
        },
        sort_date: function(t, e, n, i) {
            var r = t[n],
                o = e[n];
            return r = r ? Date.parse(r) : 0, o = o ? Date.parse(o) : 0, (r - o) * i
        },
        sort_date_fast: function(t, e, n, i) {
            var r = t[n],
                o = e[n];
            return (r - o) * i
        },
        sort_dataType: function(t, e, n, i, r) {
            var o = t[n],
                a = e[n];
            return r(o, a) * i
        },
        sort_sortType: function(t, e, n, i, r) {
            return r(t, e, n) * i
        },
        sort_string: function(t, e, n, i) {
            var r = t[n] || "",
                o = e[n] || "",
                a = 0;
            return r > o ? a = 1 : o > r && (a = -1), a * i
        },
        sort_locale: function(t, e, n, i) {
            var r = t[n] || "",
                o = e[n] || "";
            return r.localeCompare(o) * i
        },
        sort_bool: function(t, e, n, i) {
            var r = t[n],
                o = e[n],
                a = 0;
            return r && !o || r === !1 && null == o ? a = 1 : (o && !r || o === !1 && null == r) && (a = -1), a * i
        }
    };
    pq.sortObj = i
}(jQuery),
function(t) {
    function e(t, e, n) {
        var i, r = 0,
            o = e,
            a = t.length;
        for (n = n > a ? a : n; n > o; o++) i = t[o], i.pq_hidden !== !0 && r++;
        return r
    }

    function n(t) {
        this.that = t, this.mc = null;
        var e = this;
        t.on("dataReady columnOrder groupShowHide", function(n, i) {
            t.options.mergeCells && "pager" !== i.source && e.init()
        })
    }
    var i = t.paramquery.pqGrid.prototype;
    i.calcVisibleRows = e, t.paramquery.cMerge = n, n.prototype = {
        calcVisibleColumns: function(t, e, n) {
            var i = 0,
                r = t.length;
            for (n = n > r ? r : n; n > e; e++) t[e].hidden !== !0 && i++;
            return i
        },
        findNextVisibleColumn: function(t, e, n) {
            for (var i, r = e; e + n > r; r++) {
                if (i = t[r], !i) return -1;
                if (!i.hidden) return r
            }
        },
        findNextVisibleRow: function(t, e, n) {
            for (var i, r = e; e + n > r; r++) {
                if (i = t[r], !i) return -1;
                if (!i.pq_hidden) return r
            }
        },
        getData: function(t, e, n) {
            var i, r = this.mc;
            if (r[t] && (i = r[t][e])) {
                var o = i.data;
                return o ? o[n] : null
            }
        },
        inflateRange: function(t, e, n, i) {
            var r = this.that,
                o = !1,
                a = r.options,
                l = a.groupModel,
                s = l.on ? r.riOffset + r.pdata.length - 1 : a.dataModel.data.length - 1,
                d = r.colModel.length - 1,
                c = this.mc2;
            if (!c) return [t, e, n, i];
            t: for (var u = 0, h = c.length; h > u; u++) {
                var f = c[u],
                    p = f.r1,
                    g = f.c1,
                    v = p + f.rc - 1,
                    m = g + f.cc - 1,
                    v = v > s ? s : v,
                    m = m > d ? d : m,
                    w = t > p && v >= t,
                    x = n >= p && v > n,
                    y = e > g && m >= e,
                    C = i >= g && m > i;
                if ((w || x) && m >= e && i >= g || (y || C) && v >= t && n >= p) {
                    o = !0, t = t > p ? p : t, e = e > g ? g : e, n = v > n ? v : n, i = m > i ? m : i;
                    break t
                }
            }
            return o ? this.inflateRange(t, e, n, i) : [t, e, n, i]
        },
        init: function() {
            for (var t = this.that, n = this.findNextVisibleColumn, i = this.findNextVisibleRow, r = this.calcVisibleColumns, o = t.colModel, a = t.options.mergeCells || [], l = t.get_p_data(), s = [], d = [], c = 0, u = a.length; u > c; c++) {
                var h, f, p = a[c],
                    g = p.r1,
                    v = g,
                    m = l[g],
                    w = p.c1,
                    x = w,
                    y = o[w],
                    C = p.rc,
                    b = p.cc;
                if (y && m && (y.hidden && (x = n(o, w, b)), h = r(o, w, w + b), m.pq_hidden && (v = i(l, g, C)), f = e(l, g, g + C), !(1 > f || 1 > h))) {
                    s.push({
                        r1: g,
                        c1: w,
                        rc: C,
                        cc: b
                    }), d[v] = d[v] || [], d[v][x] = {
                        show: !0,
                        rowspan: f,
                        colspan: h,
                        o_rowspan: C,
                        o_colspan: b,
                        style: p.style,
                        cls: p.cls,
                        attr: p.attr,
                        r1: g,
                        c1: w,
                        v_r1: v,
                        v_c1: x
                    };
                    for (var I = {
                            show: !1,
                            r1: g,
                            c1: w,
                            v_r1: v,
                            v_c1: x
                        }, _ = g; g + C > _; _++) {
                        d[_] = d[_] || [];
                        for (var q = w; w + b > q; q++) _ == v && q == x || (d[_][q] = I)
                    }
                }
            }
            t._mergeCells = d.length > 0, this.mc = d, this.mc2 = s
        },
        ismergedCell: function(t, e) {
            var n, i = this.mc;
            if (i && i[t] && (n = i[t][e])) {
                var r = n.v_r1,
                    o = n.v_c1;
                return t == r && e == o ? {
                    o_ri: n.r1,
                    o_ci: n.c1,
                    v_rc: n.rowspan,
                    v_cc: n.colspan,
                    o_rc: n.o_rowspan,
                    o_cc: n.o_colspan
                } : !0
            }
            return !1
        },
        isRootCell: function(t, e, n) {
            var i, r = this.mc;
            if (r && r[t] && (i = r[t][e])) {
                if ("o" == n) return t == i.r1 && e == i.c1;
                var o = i.v_r1,
                    a = i.v_c1;
                if (o == t && a == e) {
                    var l = r[o][a];
                    return {
                        rowspan: l.rowspan,
                        colspan: l.colspan
                    }
                }
            }
        },
        removeData: function(t, e, n) {
            var i, r = (this.that, this.mc);
            if (r && r[t] && (i = r[t][e])) {
                var o = i.data;
                o && (o[n] = null)
            }
        },
        getRootCell: function(t, e) {
            var n, i, r, o = this.mc;
            return o && o[t] && (r = o[t][e]) ? (n = r.v_r1, i = r.v_c1, r = o[n][i], {
                o_ri: r.r1,
                o_ci: r.c1,
                v_ri: n,
                v_ci: i,
                v_rc: r.rowspan,
                v_cc: r.colspan,
                o_rc: r.o_rowspan,
                o_cc: r.o_colspan
            }) : void 0
        },
        getRootCellO: function(t, e, n, i) {
            i = i || "o";
            var r, o = "o" == i,
                a = this.getRootCell(t, e);
            return a ? (r = {
                rowIndx: a[o ? "o_ri" : "v_ri"],
                colIndx: a[o ? "o_ci" : "v_ci"]
            }, this.that.normalize(r)) : (n && (r = {
                rowIndx: t,
                colIndx: e
            }), r ? this.that.normalize(r) : null)
        },
        getRootCellV: function(t, e, n) {
            return this.getRootCellO(t, e, n, "v")
        },
        getClsStyle: function(t, e) {
            return this.mc[t][e]
        },
        getMergeCells: function(t, e, n) {
            for (var i, r, o, a = this.that, l = a.options.mergeCells, s = a.riOffset, d = s + n, c = [], u = l ? l.length : 0, h = 0; u > h; h++) i = l[h], r = i.r1, o = i.c1, (!e || r >= s && d > r) && (e && (r -= s), r += t, c.push({
                r1: r,
                c1: o,
                r2: r + i.rc - 1,
                c2: o + i.cc - 1
            }));
            return c
        },
        setData: function(t, e, n) {
            var i, r = this.mc;
            r[t] && (i = r[t][e]) && (i.data = n)
        }
    }
}(jQuery),
function(t) {
    function e(t, e, n, i) {
        t.push("<li data-option='", n, "' class='pq-menu-item'>", "<label>", "<input type='checkbox' ", e[n] ? "checked" : "", "/>", i["strGroup_" + n], "</label></li>")
    }
    var n = t.paramquery;
    n.pqGrid.defaults.groupModel = {
        agg: {},
        cascade: !0,
        cbId: "pq_group_cb",
        collapsed: [],
        dataIndx: [],
        fixCols: !0,
        groupCols: [],
        header: !0,
        headerMenu: !0,
        icon: ["ui-icon-triangle-1-se", "ui-icon-triangle-1-e"],
        id: "pq_gid",
        parentId: "parentId",
        childstr: "children",
        menuItems: ["merge", "fixCols", "grandSummary"],
        on: !1,
        refreshOnChange: !0,
        pivotColsTotal: "after",
        separator: "_",
        source: "checkboxGroup",
        showSummary: [],
        summaryInTitleRow: "collapsed",
        summaryEdit: !0,
        title: [],
        titleDefault: "{0} ({1})"
    }, pq.aggregate = {
        sum: function(t) {
            for (var e, n = 0, i = t.length; i--;) e = t[i], null != e && (n += e - 0);
            return n
        },
        avg: function(t, e) {
            try {
                var n = pq.formulas.AVERAGE(t)
            } catch (i) {
                n = i
            }
            return isNaN(n) ? null : n
        },
        flatten: function(t) {
            return t.filter(function(t) {
                return null != t
            })
        },
        max: function(t, e) {
            var n, i = e.dataType;
            return t = this.flatten(t), t.length ? ("float" == i || "integer" == i ? n = Math.max.apply(Math, t) : "date" == i ? (t.sort(function(t, e) {
                return t = Date.parse(t), e = Date.parse(e), e - t
            }), n = t[0]) : (t.sort(), n = t[t.length - 1]), n) : void 0
        },
        min: function(t, e) {
            var n, i, r, o, a = e.dataType;
            if (t = this.flatten(t), t.length) {
                if ("integer" == a || "float" == a) n = Math.min.apply(Math, t);
                else if ("date" == a) {
                    for (o = t.length, i = []; o--;) r = t[o], i.push({
                        dateO: r,
                        dateP: Date.parse(r)
                    });
                    i.sort(function(t, e) {
                        return t.dateP - e.dateP
                    }), n = i.length ? i[0].dateO : void 0
                } else t.sort(), n = t[0];
                return n
            }
        },
        count: function(t) {
            return this.flatten(t).length
        },
        stdev: function(t) {
            try {
                var e = pq.formulas.STDEV(t)
            } catch (n) {
                e = n
            }
            return isNaN(e) ? null : e
        },
        stdevp: function(t) {
            try {
                var e = pq.formulas.STDEVP(t)
            } catch (n) {
                e = n
            }
            return isNaN(e) ? null : e
        }
    };
    var i = n.cGroup = function(t) {
        var e = this,
            n = t.options.groupModel;
        e.model = "groupModel", e.cbId = n.cbId, e.childstr = n.childstr, e.id = n.id, e.parentId = n.parentId, e.cache = [], e.prop = "pq_group_prop", e.that = t, n.on && e.init()
    };
    i.beforeTrigger = function(t, e) {
        return function(n) {
            return e._trigger("beforeGroupExpand", t, n) === !1;
        }
    }, i.onGroupItemClick = function(e) {
        return function(n) {
            var i = t(n.target),
                r = t(this).data("indx");
            i.hasClass("pq-group-remove") ? e.removeGroup(r) : e.toggleLevel(r, n)
        }
    }, i.prototype = t.extend({}, pq.mixin.ChkGrpTree, pq.mixin.GrpTree, {
        addGroup: function(t, e) {
            var n = this,
                i = n.that,
                r = i.options.groupModel.dataIndx || [],
                o = pq.objectify(r),
                a = r.slice();
            null == t || o[t] || (null == e ? a.push(t) : a.splice(e, 0, t), n.option({
                dataIndx: a
            }, "", "", function() {
                n.triggerChange()
            }))
        },
        createHeader: function() {
            for (var e = this, n = e.that, r = e.$header, o = n.options, a = o.bootstrap, l = n.columns, s = a.on, d = o.groupModel, c = d.dataIndx, u = c.length; u--;) null == l[c[u]] && c.splice(u, 1);
            if (u = c.length, d.header && d.on) {
                if (r ? r.empty() : (r = e.$header = t("<div class='pq-group-header ui-helper-clearfix' ></div>").appendTo(n.$top), r.on("click", ".pq-group-item", i.onGroupItemClick(e))), u) {
                    for (var h = [], f = 0; u > f; f++) {
                        var p = c[f],
                            g = l[p],
                            v = d.collapsed,
                            m = s ? a.groupModel.icon : d.icon,
                            w = v[f] ? m[1] : m[0];
                        h.push("<div tabindex='0' class='pq-group-item' data-indx='", p, "' >", "<span class='", e.toggleIcon, w, "' ></span>", g.pq_title || ("string" == typeof g.title ? g.title : p), "<span class='", e.groupRemoveIcon, "' ></span></div>")
                    }
                    r[0].innerHTML = h.join("")
                }
                e.initHeader(o, d)
            } else r && (r.remove(), e.$header = null)
        },
        collapse: function(t) {
            this.expand(t, !0)
        },
        collapseAll: function(t) {
            this.expandAll(t, !0)
        },
        collapseTo: function(t) {
            this.expandTo(t, !0)
        },
        concat: function() {
            var t = this.parentId,
                e = this.id,
                n = this.childstr;
            return function(i, r, o) {
                var a = o[e];
                return r.forEach(function(e) {
                    e[t] = a, i.push(e)
                }), o[n] = r, i
            }
        },
        editorSummary: function(e, n) {
            var i = this;
            return function(e) {
                var r = e.rowData;
                if (r.pq_gsummary || r.pq_gtitle) {
                    var o, a = pq.aggregate,
                        l = e.column,
                        s = l.summary,
                        d = s ? s.edit : null,
                        c = t.inArray,
                        u = l.dataType,
                        h = [""];
                    if (c(e.dataIndx, n.dataIndx) > -1) return !1;
                    if (!n.summaryEdit && !d || d === !1) return !1;
                    o = i.getAggOptions(u);
                    for (var f in a) c(f, o) > -1 && h.push(f);
                    return 1 == h.length ? !1 : {
                        type: "select",
                        prepend: n.prepend,
                        options: n.options || h,
                        valueIndx: n.valueIndx,
                        labelIndx: n.labelIndx,
                        init: n.init || i.editorInit,
                        getData: n.getData || i.editorGetData
                    }
                }
            }
        },
        editorInit: function(t) {
            var e, n = t.column.summary,
                i = this.options.groupModel.dataIndx;
            n || (n = t.column.summary = {}), e = n[i[t.rowData.pq_level]] || n.type, t.$cell.find("select").val(e)
        },
        editorGetData: function(t) {
            var e = t.column,
                n = this.options.groupModel.dataIndx,
                i = n[t.rowData.pq_level],
                r = e.dataType,
                o = e.summary,
                a = t.$cell.find("select").val();
            return o[o[i] ? i : "type"] = a, this.one("beforeValidate", function(t, n) {
                n.allowInvalid = !0, n.track = !1, n.history = !1, e.dataType = "string", this.one(!0, "change", function(t, n) {
                    e.dataType = r
                })
            }), a
        },
        expandTo: function(t, e) {
            for (var n, i, r = this.that, o = !!e, a = t.split(","), l = a.length, s = this.childstr, d = this.getRoots(r.pdata), c = 0; l > c && (i = a[c], n = d[i]);) o || (n.pq_close = o), d = n[s], c++;
            n && (n.pq_close = o, r._trigger("group", null, {
                node: n,
                close: o
            }) !== !1 && this.softRefresh())
        },
        expandAll: function(t, e) {
            t = t || 0, e = !!e, this.trigger({
                all: !0,
                close: e,
                level: t
            }) !== !1 && (this.that.pdata.forEach(function(n) {
                n.pq_level >= t && (n.pq_close = e)
            }), this.createHeader(), this.softRefresh())
        },
        expand: function(t, e) {
            t = t || 0, this.trigger({
                close: !!e,
                level: t
            }) !== !1 && (this.that.pdata.forEach(function(n) {
                n.pq_level == t && (n.pq_close = e)
            }), this.createHeader(), this.softRefresh())
        },
        firstCol: function() {
            return this.that.colModel[this.that.getFirstVisibleCI()]
        },
        flattenG: function(t, e, n, i) {
            var r = this,
                o = n.dataIndx,
                a = n.titleInFirstCol,
                l = r.id,
                s = r.parentId,
                d = r.childstr,
                c = n.separator,
                u = a ? r.firstCol().dataIndx : null,
                h = r.concat(),
                f = o.length,
                p = [];
            return function g(i, r, v, m) {
                if (!f) return i;
                v = v || {};
                var w = r || 0,
                    x = v[d],
                    y = o[w],
                    C = n.collapsed[w],
                    b = (n.showSummary[w], e(i, y, t[y]));
                return b.forEach(function(t) {
                    var e, n = t[1],
                        i = t[0],
                        r = (m ? m + c : "") + i,
                        o = n.length;
                    p.length;
                    e = {
                        pq_gtitle: !0,
                        pq_level: w,
                        pq_close: C,
                        pq_items: o
                    }, e[l] = r, e[s] = v[l], e[d] = [], e[y] = i, a && (e[u] = i), p.push(e), x && x.push(e), f > w + 1 ? g(n, w + 1, e, r) : p = h(p, n, e)
                }), p
            }
        },
        getAggOptions: function(t) {
            var e = this.that.options,
                n = e.summaryOptions;
            return "integer" == t || "float" == t ? t = "number" : "date" !== t && (t = "string"), n[t].split(",")
        },
        getVal: function(e) {
            var n = t.trim;
            return function(t, i, r) {
                var o = t[i],
                    a = r.groupChange;
                return a ? (a = pq.getFn(a))(o) : (o = n(o), e ? o.toUpperCase() : o)
            }
        },
        getSumCols: function() {
            return this._sumCols
        },
        getSumDIs: function() {
            return this._sumDIs
        },
        group: function(t) {
            return function(e, n, i) {
                var r = {},
                    o = [];
                return e.forEach(function(e) {
                    e.pq_hidden = void 0;
                    var a = t(e, n, i),
                        l = r[a];
                    null == l && (r[a] = l = o.length, o[l] = [a, []]), o[l][1].push(e)
                }), o
            }
        },
        groupData: function() {
            var t = this,
                e = t.that,
                n = e.options,
                i = n.groupModel,
                r = t.getVal(i.ignoreCase),
                o = i.dataIndx,
                a = e.pdata,
                l = e.columns,
                s = (t.setSumCols(o), function() {});
            e.pdata = t.flattenG(l, t.group(r), i, s)(a), t.summaryT()
        },
        hideRows: function(t, e, n, i) {
            for (var r, o = this.that, a = !0, l = o.pdata, s = t, d = l.length; d > s; s++)
                if (r = l[s], r.pq_gsummary) n || i ? r.pq_level >= e && (r.pq_hidden = a) : r.pq_level > e && (r.pq_hidden = a);
                else if (r.pq_gtitle) {
                if (r.pq_level <= e) break;
                r.pq_hidden = a
            } else r.pq_hidden = a
        },
        init: function() {
            var t, e, n, i, r, o, a = this;
            a.onCMInit(), a._init || (a.mc = [], a.summaryData = [], o = a.that, t = o.options, e = t.groupModel, n = t.bootstrap, i = n.on, r = i ? "glyphicon " : "ui-icon ", a.groupRemoveIcon = "pq-group-remove " + r + (i ? "glyphicon-remove" : "ui-icon-close"), a.toggleIcon = "pq-group-toggle " + r, o.on("cellClick", a.onCellClick(a)).on("cellKeyDown", a.onCellKeyDown(a, e)).on(!0, "cellMouseDown", a.onCellMouseDown()).on("change", a.onChange(a, e)).on("dataReady", a.onDataReady(a, o)).on("beforeFilterDone", function() {
                a.saveState()
            }).on("columnDragDone", a.onColumnDrag(a)).on("columnOrder", a.onColumnOrder(a, e)).on("customSort", a.onCustomSort.bind(a)).on("valChange", a.onCheckbox(a, e)).on("refresh refreshRow", a.onRefresh(a, e)).on("refreshHeader", a.onRefreshHeader.bind(a)), e.titleInFirstCol && o.on("CMInit", a.onCMInit.bind(a)), o.on("beforeCheck", a.onBeforeCheck.bind(a)), a.setCascadeInit(!0), a._init = !0)
        },
        initHeadSortable: function() {
            var t = this,
                e = t.that,
                n = t.$header,
                i = e.options;
            n.sortable({
                axis: "x",
                distance: 3,
                tolerance: "pointer",
                cancel: ".pq-group-menu",
                stop: t.onSortable(t, i)
            })
        },
        initHeadDroppable: function() {
            var t = this,
                e = t.that,
                n = t.$header;
            n && (n.droppable({
                accept: function(n) {
                    var i = 1 * n.attr("pq-col-indx");
                    if (!isNaN(i) && e.colModel[i]) return t.acceptDrop
                },
                tolerance: "pointer",
                hoverClass: "pq-drop-hover",
                drop: t.onDrop(e, t)
            }), t.acceptDrop = !0)
        },
        initHeader: function(t, e) {
            var n = this;
            if (n.$header) {
                var i = n.$header,
                    r = i.find(".pq-group-item");
                i.data("uiSortable") || n.initHeadSortable(), r.length || i.append("<span class='pq-group-placeholder'>" + t.strGroup_header + "</span>"), e.headerMenu && n.initHeaderMenu()
            }
        },
        initHeaderMenu: function() {
            for (var n, i = this, r = i.that, o = r.BS_on, a = r.options, l = i.$header, s = ["<ul class='pq-group-menu'><li>", o ? "<span class='glyphicon glyphicon-chevron-left'></span>" : "", "<ul>"], d = a.groupModel, c = d.menuItems, u = 0, h = c.length; h > u; u++) e(s, d, c[u], a);
            s.push("</ul></li></ul>"), n = t(s.join("")).appendTo(l), n.menu({
                icons: {
                    submenu: "ui-icon-carat-1-w"
                },
                position: {
                    my: "right top",
                    at: "left top"
                }
            }), n.change(function(e) {
                if ("INPUT" == e.target.nodeName) {
                    var n = t(e.target),
                        r = n.closest("li").data("option"),
                        o = {};
                    o[r] = !a.groupModel[r], i.option(o)
                }
            })
        },
        isOn: function() {
            var t = this.that.options.groupModel;
            return t.on && (t.dataIndx || []).length
        },
        getRC: function(t) {
            var e = 1,
                n = this;
            return (t[n.childstr] || []).forEach(function(t) {
                e += n.getRC(t)
            }), e + (t.pq_child_sum ? 1 : 0)
        },
        initmerge: function() {
            var t, e = this,
                n = e.that,
                i = n.options,
                r = i.groupModel,
                o = r.merge,
                a = r.summaryInTitleRow,
                l = r.titleInFirstCol,
                s = n.colModel.length,
                d = [],
                c = r.dataIndx,
                u = (c.length - 1, n.pdata || []);
            o ? c.forEach(function(n, i) {
                u.forEach(function(n) {
                    n.pq_gtitle && i == n.pq_level && (t = e.getRC(n), d.push({
                        r1: n.pq_ri,
                        rc: t,
                        c1: i,
                        cc: 1
                    }))
                })
            }) : c.length && u.forEach(function(t) {
                t.pq_gtitle && (a && (t.pq_close || "collapsed" !== a) || d.push({
                    r1: t.pq_ri,
                    rc: 1,
                    c1: l ? 0 : t.pq_level,
                    cc: s
                }))
            }), d.length ? (e.mc = i.mergeCells = d, n.iMerge.init()) : this.mc.length && (e.mc.length = 0, n.iMerge.init())
        },
        initcollapsed: function() {
            var t, e, n, i, r, o = this.that,
                a = o.options.groupModel,
                l = a.merge,
                s = a.summaryInTitleRow,
                d = this.cacheClose,
                c = o.pdata,
                u = this.id;
            if (c)
                for (var h = 0, f = c.length; f > h; h++) t = c[h], e = t.pq_gtitle, e && (i = t.pq_level, r = null, d && (n = d[t[u]], null != n && (delete d[t[u]], r = t.pq_close = n)), null == r && (r = t.pq_close), r ? this.hideRows(h + 1, i, l, s) : l && (t.pq_hidden = !0))
        },
        updateItems: function(t) {
            var e, n, i = this,
                r = 0,
                o = i.childstr;
            return (t || i.that.pdata).forEach(function(t) {
                t.pq_gtitle && (e = t[o], n = e.length, n && e[0][o] ? t.pq_items = i.updateItems(e) : t.pq_items = n, r += t.pq_items)
            }), r
        },
        removeEmptyParent: function(t) {
            var e = this,
                n = e.that.pdata,
                i = e.childstr;
            if (!t[i].length) {
                var r = e.getParent(t),
                    o = r ? r[i] : n,
                    a = o.indexOf(t);
                o.splice(a, 1), r && e.removeEmptyParent(r)
            }
        },
        addNodes: function(t, e, n) {
            this.moveNodes(t, e, n, !0)
        },
        deleteNodes: function(t) {
            this.moveNodes(t, null, null, null, !0)
        },
        moveNodes: function(t, e, n, i, r) {
            var o, a, l, s = this,
                d = s.that,
                c = s.childstr,
                u = "pq_hidden",
                h = d.options,
                f = h.groupModel,
                p = f.dataIndx,
                g = (s.id, h.dataModel.data),
                v = s.parentId,
                m = 0,
                w = t.length;
            if (!p.length, e) {
                var x = e[c],
                    y = x.length,
                    C = x[0],
                    n = null == n || n >= y ? y : n,
                    b = g.indexOf(C) + n;
                if (C.pq_gtitle) throw "incorrect nodes"
            }
            if (t = t.slice(0), w) {
                for (d._trigger("beforeMoveNode"); w > m; m++) l = t[m], i ? e[c].splice(n++, 0, l) : (o = s.getParent(l), a = o[c].indexOf(l), r ? o[c].splice(a, 1) : o == e ? n = pq.moveItem(l, e[c], a, n) : (e[c].splice(n++, 0, l), o[c].splice(a, 1))), C && (p.forEach(function(t) {
                    l[t] = C[t]
                }), l[v] = C[v], l[u] = C[u]), i ? g.splice(b++, 0, l) : (a = g.indexOf(l), r ? g.splice(a, 1) : b = pq.moveItem(l, g, a, b), s.removeEmptyParent(o));
                s.updateItems(), s.summaryT(), s.isCascade(f) && (s.cascadeInit(), s.setValCBox()), d.iRefresh.addRowIndx(), s.initmerge(), d._trigger((i ? "add" : r ? "delete" : "move") + "Node"), d.refresh({
                    header: !1
                })
            }
        },
        onCellClick: function(e) {
            return function(n, i) {
                if (i.rowData.pq_gtitle && t(n.originalEvent.target).hasClass("pq-group-icon"))
                    if (pq.isCtrl(n)) {
                        var r = i.rowData;
                        e[r.pq_close ? "expand" : "collapse"](r.pq_level)
                    } else e.toggleRow(i.rowIndxPage, n)
            }
        },
        onCellMouseDown: function() {
            return function(e, n) {
                n.rowData.pq_gtitle && t(e.originalEvent.target).hasClass("pq-group-icon") && e.preventDefault()
            }
        },
        onCellKeyDown: function(e, n) {
            return function(i, r) {
                return r.rowData.pq_gtitle && t.inArray(r.dataIndx, n.dataIndx) >= 0 && i.keyCode == t.ui.keyCode.ENTER ? (e.toggleRow(r.rowIndxPage, i), !1) : void 0
            }
        },
        onChange: function(t, e) {
            return function(n, i) {
                e.source == i.source || "checkbox" == i.source || (t.summaryT(), t.that.refresh())
            }
        },
        onColumnDrag: function(t) {
            return function(e, n) {
                var i = n.column,
                    r = i.colModel;
                r && r.length || i.groupable === !1 || i.denyGroup ? t.acceptDrop = !1 : t.initHeadDroppable()
            }
        },
        onCustomSort: function(t, e) {
            var n = this,
                i = n.that,
                r = i.options,
                o = r.groupModel,
                a = o.dataIndx,
                l = e.sorter,
                s = (l[0] || {}).dataIndx,
                d = i.columns[s],
                c = a.indexOf(s),
                u = i.colIndxs[s];
            if (a.length && 1 == l.length) {
                if (c >= 0 && d.groupChange) return;
                if ("pq_order" == s || (d.summary || {}).type) return n._delaySort(e);
                var h = a.map(function(t) {
                    return {
                        dataIndx: t,
                        dir: l[0].dir
                    }
                }).concat(l);
                return h = pq.arrayUnique(h, "dataIndx"), n._delaySort(e, function(t) {
                    o.titleInFirstCol && 0 === u ? e.sort_composite = h.map(function(e) {
                        return i.iSort.compileSorter([e], t)
                    }) : e.sort_composite = h.map(function(e) {
                        return e.dataIndx == s ? i.iSort.compileSorter([e], t) : void 0
                    })
                })
            }
        },
        _delaySort: function(t, e) {
            var n = this,
                i = n.that,
                r = i.pdata;
            return r && r.length ? (i.one("skipGroup", function() {
                return e && e(r), t.data = r, n.onCustomSortTree({}, t), i.pdata = t.data, n.summaryRestore(), !1
            }), !1) : void 0
        },
        summaryRestore: function() {
            function t(e, i) {
                var r = [];
                return e.forEach(function(e) {
                    r.push(e), t(e[n] || [], e).forEach(function(t) {
                        r.push(t)
                    })
                }), i && i.pq_child_sum && r.push(i.pq_child_sum), r
            }
            var e = this,
                n = e.childstr,
                i = e.that;
            i.pdata = t(e.getRoots())
        },
        onDrop: function(t, e) {
            return function(n, i) {
                var r = 1 * i.draggable.attr("pq-col-indx"),
                    o = t.colModel[r].dataIndx;
                e.addGroup(o), e.acceptDrop = !1
            }
        },
        onSortable: function(e, n) {
            return function() {
                var i, r, o, a = [],
                    l = n.groupModel.dataIndx,
                    s = t(this).find(".pq-group-item");
                s.each(function(e, n) {
                    r = t(n), o = r.data("indx"), l[e] !== o && (i = !0), a.push(o)
                }), i && e.option({
                    dataIndx: a
                }, "", "", function() {
                    e.triggerChange()
                })
            }
        },
        onDataReady: function(t, e) {
            return function() {
                var n = e.options.groupModel,
                    i = n.dataIndx.length;
                n.on && (i || n.grandSummary ? (e._trigger("skipGroup") !== !1 && (t.groupData(), t.buildCache()), e.iRefresh.addRowIndx(), t.refreshColumns(), i && (t.initcollapsed(), t.initmerge(), t.isCascade(n) && t.cascadeInit())) : t.refreshColumns(), t.setValCBox()), t.createHeader()
            }
        },
        onColumnOrder: function(t, e) {
            return function() {
                return e.titleInFirstCol ? (t.that.refreshView(), !1) : void t.initmerge()
            }
        },
        option: function(e, n, i, r) {
            var o, a = e.dataIndx,
                l = this.that,
                s = a ? a.length : 0,
                d = this,
                c = l.options,
                u = c.groupModel,
                h = u.dataIndx;
            u.on && h.length && (e.on === !1 || 0 === s) && d.showRows(), o = t.extend({}, u), t.extend(u, e), r && r(), d.init(), d.setOption(), l._trigger("groupOption", null, {
                source: i,
                oldGM: o
            }), n !== !1 && l.refreshView()
        },
        showRows: function() {
            this.that.options.dataModel.data.forEach(function(t) {
                t.pq_hidden && (t.pq_hidden = void 0)
            })
        },
        renderBodyCell: function(t, e) {
            var n, i = this,
                r = e.checkbox,
                o = e.dataIndx.length - (i.isPivot() ? 1 : 0),
                a = e.titleInFirstCol,
                l = a ? e.indent : 0,
                s = l * o,
                d = "";
            return o && (s += l),
                function(t) {
                    var o, l, c = t.rowData,
                        u = t.column,
                        h = u.renderLabel;
                    return t.Export ? void 0 : (o = h && h.call(i.that, t), o = o || t.formatVal || t.cellData, r && a && (n = i.renderCB(r, c, e.cbId), n && (d = n[0])), l = d && (u.useLabel || e.useLabel), {
                        text: (l ? "<label style='width:100%;'>" : "") + d + (null == o ? "" : o) + (l ? "</label>" : ""),
                        style: "text-indent:" + s + "px;"
                    })
                }
        },
        renderCell: function(t, e) {
            var n = this.renderTitle(t, e),
                i = this.that,
                r = e.dataIndx,
                o = (pq.objectify(this.isPivot() ? r.slice(0, r.length - 1) : r), this.renderBodyCell(t, e)),
                a = this.renderSummary(t);
            return function(t, r) {
                t._render = t._renderG = function(t) {
                    var l = t.rowData,
                        s = l.pq_gtitle;
                    return r && s ? n(t) : s || l.pq_gsummary ? a(t) : e.titleInFirstCol && t.colIndx === i.getFirstVisibleCI() ? o(t) : void 0
                }
            }
        },
        renderSummary: function(t) {
            var e = this.that,
                n = t.groupModel.dataIndx;
            return function(i) {
                var r, o, a, l = i.rowData,
                    s = i.column,
                    d = s.summary;
                return d && (o = d[n[l.pq_level]] || d.type) ? (a = t.summaryTitle[o], "function" == typeof a ? a.call(e, i) : (r = i.formatVal, null == r && (r = i.cellData, r = null == r ? "" : r), "number" != typeof r || s.format || parseInt(r) === r || (r = r.toFixed(2)), a ? a.replace("{0}", r) : r)) : void 0
            }
        },
        updateformatVal: function(t, e, n) {
            var i = t.dataIndx[n],
                r = this.that.columns[i];
            r.format && r != e.column && (e.formatVal = pq.format(r, e.cellData))
        },
        renderTitle: function(t, e) {
            var n, i, r = this,
                o = r.that,
                a = e.checkbox,
                l = t.bootstrap,
                s = ["pq-group-title-cell"],
                d = e.titleInFirstCol,
                c = e.indent,
                u = l.on,
                h = u ? l.groupModel.icon : e.icon,
                f = u ? ["glyphicon " + h[0], "glyphicon " + h[1]] : ["ui-icon " + h[0], "ui-icon " + h[1]];
            return function(t) {
                var l, u, h, p, g, v = t.rowData,
                    m = t.column,
                    w = m.useLabel;
                return null != t.cellData ? (l = v.pq_close, u = v.pq_level, h = e.title, r.updateformatVal(e, t, u), h = m.renderLabel || h[u] || e.titleDefault, h = "function" == typeof h ? h.call(o, t) : h.replace("{0}", t.formatVal || t.cellData).replace("{1}", v.pq_items), h = null == h ? t.formatVal || t.cellData : h, g = l ? 1 : 0, p = "pq-group-icon " + f[g], t.Export ? h : (a && d && r.isCascade(e) && (n = r.renderCB(a, v, e.cbId), n && (i = n[0], n[1] && s.push(n[1]))), w = i && (null != w ? w : e.useLabel), {
                    text: [w ? "<label style='width:100%;'>" : "", "<span class='", p, "'></span>", i, h, w ? "</label>" : ""].join(""),
                    cls: s.join(" "),
                    style: "text-align:left;text-indent:" + c * u + "px;"
                })) : void 0
            }
        },
        triggerChange: function() {
            this.that._trigger("groupChange")
        },
        removeGroup: function(t) {
            var e = this;
            e.option({
                dataIndx: e.that.options.groupModel.dataIndx.filter(function(e) {
                    return e != t
                })
            }, "", "", function() {
                e.triggerChange()
            })
        },
        refreshColumns: function() {
            for (var t, e, n, i = this.that, r = i.options, o = r.groupModel, a = o.on, l = o.fixCols, s = this.renderCell(r, o), d = o.dataIndx, c = d.length, u = i.colModel, h = u.length; h--;) t = u[h], t._renderG && (delete t._render, delete t._renderG), t._nodrag && (delete t._nodrag, delete t._nodrop), a && (e = t.summary) && e.type && s(t);
            if (r.geditor = a ? this.editorSummary(r, o) : void 0, a)
                if (o.titleInFirstCol) t = this.firstCol(), s(t, !0);
                else
                    for (h = c - 1; h >= 0; h--) t = i.getColumn({
                        dataIndx: d[h]
                    }), s(t, !0);
            if (l && a)
                for (h = 0; c > h; h++) n = i.getColIndx({
                    dataIndx: d[h]
                }), t = u[n], t._nodrag = t._nodrop = !0, n != h && (i.iDragColumns.moveColumn(n, h, !0), i.refreshCM(null, {
                    group: !0
                }))
        },
        saveState: function(t) {
            var e = this.that,
                n = this.cacheClose = this.cacheClose || {},
                i = this.id,
                r = e.options.groupModel;
            r.on && r.dataIndx.length && (e.pdata.forEach(function(t) {
                t.pq_gtitle && (n[t[i]] = t.pq_close)
            }), t && this.refreshView("group"))
        },
        setSumCols: function(t) {
            var e = [],
                n = [];
            return t = pq.objectify(t), this.that.colModel.forEach(function(i) {
                var r, o = i.summary;
                o && o.type && (r = i.dataIndx, t[r] || (e.push(i), n.push(r)))
            }), this._sumCols = e, this._sumDIs = n, [e, n]
        },
        setOption: function() {
            var t = this;
            t._init && (t.refreshColumns(), t.summaryData.length = 0, t.initmerge())
        },
        softRefresh: function() {
            var t = this,
                e = t.that;
            t.pdata = null, e.pdata.forEach(function(t) {
                delete t.pq_hidden
            }), t.initcollapsed(), t.initmerge(), e.refresh({
                header: !1
            })
        },
        toggleLevel: function(e, n) {
            var i = this.that.options.groupModel,
                r = i.collapsed,
                o = t.inArray(e, i.dataIndx),
                a = pq.isCtrl(n) ? "All" : "",
                l = r[o];
            this[(l ? "expand" : "collapse") + a](o)
        },
        trigger: function(t) {
            var e, n, r, o, a = t.evt,
                l = t.rd,
                s = t.level,
                d = t.all,
                c = t.close,
                u = this.that,
                h = u.options.groupModel,
                f = h.dataIndx,
                p = h.collapsed,
                g = i.beforeTrigger(a, u),
                v = {};
            if (l) {
                if (e = l.pq_level, n = f[e], r = l[n], c = !l.pq_close, v = {
                        level: e,
                        close: c,
                        group: r
                    }, g(v)) return !1;
                l.pq_close = c
            } else if (d) {
                if (v = {
                        all: !0,
                        close: c,
                        level: s
                    }, g(v)) return !1;
                for (o = s; o < f.length; o++) p[o] = c
            } else if (null != s) {
                if (v = {
                        level: s,
                        close: c
                    }, g(v)) return !1;
                p[s] = c
            }
            return u._trigger("group", null, v)
        },
        toggleRow: function(t, e) {
            var n = this.that,
                i = n.pdata,
                r = i[t];
            this.trigger({
                evt: e,
                rd: r
            }) !== !1 && this.softRefresh()
        }
    });
    var r = n.pqGrid.prototype;
    r.Group = function(t) {
        var e = this.iGroup;
        return null == t ? e : void e.expandTo(t.indx)
    }
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e.pqGrid.prototype,
        i = n.options;
    t(document).on("pqGrid:bootup", function(t, e) {
        var n = e.instance;
        n.iDrag = new r(n)
    });
    var r = e.cDrag = function(t) {
        var e = this,
            n = t.options,
            i = n.dragModel;
        i.on && (e.that = t, n.postRenderInterval = n.postRenderInterval || -1, e.model = i, e.ns = ".pq-drag", t.on("CMInit", e.onCMInit.bind(e)).on("create", e.onCreate.bind(e)))
    };
    n.Drag = function() {
        return this.iDrag
    }, i.dragModel = {
        afterDrop: function() {},
        beforeDrop: function(t, e) {
            var n = this.Drag().getUI().nodes,
                i = this,
                r = this.Tree(),
                o = this.Group();
            r.isOn() ? i = r : o.isOn() && (i = o), i.deleteNodes(n)
        },
        diDrag: -1,
        dragNodes: function(t) {
            return [t]
        },
        contentHelper: function(t, e) {
            var n = e[0],
                i = e.length;
            return t.map(function(t) {
                return n[t]
            }).join(", ") + (i > 1 ? " ( " + e.length + " )" : "")
        },
        clsHandle: "pq-drag-handle",
        clsDnD: "pq-dnd",
        iconAccept: "ui-icon ui-icon-check",
        iconReject: "ui-icon ui-icon-cancel",
        tmplDragN: "<span class='ui-icon ui-icon-grip-dotted-vertical pq-drag-handle' style='cursor:move;position:absolute;left:2px;top:4px;'>&nbsp;</span>",
        tmplDrag: "<span class='ui-icon ui-icon-grip-dotted-vertical pq-drag-handle' style='cursor:move;vertical-align:text-bottom;touch-action:none;float:left;'>&nbsp;</span>",
        cssHelper: {
            opacity: .7,
            position: "absolute",
            height: 25,
            width: 200,
            overflow: "hidden",
            background: "#fff",
            border: "1px solid",
            boxShadow: "4px 4px 2px #aaaaaa",
            zIndex: 1001
        },
        tmplHelper: "<div class='pq-border-0 pq-grid-cell' style='pointer-events: none;'><span class='pq-icon' style='vertical-align:text-bottom;margin:0 5px;'></span><span></span></div>"
    }, r.prototype = {
        addIcon: function(t) {
            var e = "pq-icon";
            this.$helper.find("." + e).attr("class", "").addClass(e + " " + t)
        },
        addAcceptIcon: function() {
            this.addIcon(this.model.iconAccept)
        },
        addRejectIcon: function() {
            this.addIcon(this.model.iconReject)
        },
        getHelper: function(e) {
            var n = this,
                i = n.that,
                r = n.model,
                o = t(e.target).closest(".pq-grid-cell,.pq-grid-number-cell"),
                a = n.cellObj = i.getCellIndices({
                    $td: o
                }),
                l = (o[0], r.diHelper || [r.diDrag]),
                s = a.rowData,
                d = a.nodes = r.dragNodes.call(i, s, e),
                c = r.contentHelper.call(i, l, d),
                u = n.$helper = t(r.tmplHelper);
            return u.find("span:eq(1)").html(c), n.addRejectIcon(), u.addClass("pq-theme pq-drag-helper").css(r.cssHelper).data("Drag", n), u[0]
        },
        getUI: function() {
            return this.cellObj
        },
        grid: function() {
            return this.that
        },
        isSingle: function() {
            return 1 == this.getData().length
        },
        onCMInit: function() {
            var e = this.that,
                n = this.model,
                i = n.tmplDragN,
                r = n.isDraggable,
                o = e.columns[n.diDrag];
            (o || e.options.numberCell).postRender = function(n) {
                r && !r.call(e, n) || t(n.cell).prepend(i)
            }
        },
        onCreate: function() {
            var e = this,
                n = e.model,
                i = -1 == n.diDrag;
            e.that.on(!0, "cellMouseDown", e.onCellMouseDown.bind(e)), e.ele = e.that.$cont.children(":first").addClass(n.clsDnD + (i ? " pq-drag-number" : "")).draggable(t.extend({
                cursorAt: {
                    left: 2,
                    top: 20
                },
                containment: "document",
                appendTo: "body"
            }, n.options, {
                handle: "." + n.clsHandle,
                helper: e.getHelper.bind(e),
                revert: e.revert.bind(e)
            }))
        },
        onDrop: function(t, e, n) {
            this.model[t].call(this.that, e, n)
        },
        revert: function(e) {
            e || this.$helper.hide("explode", function() {
                t(this).remove()
            })
        },
        onCellMouseDown: function(e) {
            var n = this,
                i = n.model,
                r = t(e.originalEvent.target);
            r.closest("." + i.clsHandle + ",.pq-grid-number-cell").length && e.preventDefault()
        },
        over: function(t, e) {
            this.addAcceptIcon()
        },
        out: function(t, e) {
            this.addRejectIcon()
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e.pqGrid.prototype,
        i = n.options;
    t(document).on("pqGrid:bootup", function(t, e) {
        var n = e.instance;
        n.iDrop = new r(n)
    }), n.Drop = function() {
        return this.iDrop
    }, i.dropModel = {
        accept: ".pq-dnd",
        drop: function(t, e) {
            var n = e.helper.data("Drag"),
                i = this,
                r = i.Group(),
                o = i.Tree(),
                a = e.rowData,
                l = e.ratioY() <= .5,
                s = e.rowIndx + (l ? 0 : 1),
                d = function(t) {
                    var e;
                    t.isFolder(a) ? (e = a, l || (c = 0)) : (e = t.getParent(a), c = t.getChildren(e).indexOf(a) + (l ? 0 : 1)), h ? t.moveNodes(f, e, c) : t.addNodes(f, e, c)
                };
            if (n) {
                var c, u = n.getUI(),
                    h = n.grid() == i,
                    f = u.nodes;
                r.isOn() ? d(r) : o.isOn() ? d(o) : h ? i.moveNodes(f, s) : i.addNodes(f, s)
            }
        }
    };
    var r = e.cDrop = function(t) {
        var e = this,
            n = t.options,
            i = n.dropModel;
        e.model = i, i.on && (e.that = t, e.ns = ".pq-drop", t.on("create", e.onCreate.bind(e)))
    };
    r.prototype = {
        addUI: function(e, n, i) {
            var r = this;
            e.$cell = i, e.ratioY = function() {
                return r.ratioY(n, i)
            }, t.extend(e, r.that.getCellIndices({
                $td: i
            }))
        },
        callFn: function(t, e, n) {
            var i = this.model[t];
            return i ? i.call(this.that, e, n) : void 0
        },
        feedback: function(t, e) {
            if (e.length) {
                var n = this,
                    i = n.getCellY(e),
                    r = i[0],
                    o = n.that.$cont,
                    a = n.ratioY(t, e),
                    l = o.offset().left,
                    s = i[1];
                n.$feedback = n.$feedback || n.newF(), n.$feedback.css({
                    top: .5 >= a ? r - 1 : s - 1,
                    left: l,
                    width: o[0].clientWidth,
                    zIndex: 1e4
                }), o.css("cursor", "copy")
            }
        },
        getCell: function(t) {
            return t.closest(".pq-grid-cell,.pq-grid-number-cell")
        },
        getCellY: function(t) {
            var e = t.offset(),
                n = e.top,
                i = n + t[0].offsetHeight;
            return [n, i]
        },
        getDrag: function(t) {
            return t.helper.data("Drag")
        },
        isOn: function() {
            return this.model.on
        },
        isOver: function() {},
        newF: function() {
            return t("<svg class='pq-border-0' style='box-sizing: border-box;position:absolute;border-width:2px;border-style:solid;pointer-events:none;height:0;'></svg>").appendTo(document.body)
        },
        onCreate: function() {
            var e = this;
            e.that.$cont.droppable(t.extend({
                tolerance: "pointer"
            }, e.model.options, {
                accept: e.model.accept,
                over: e.onOver.bind(e),
                out: e.onOut.bind(e),
                drop: e.onDrop.bind(e)
            }))
        },
        onOver: function(t, e) {
            var n = this,
                i = n.Drag = n.getDrag(e);
            e.draggable.on("drag.pq", n.onDrag.bind(n)), i && i.over(t, e), n.isOver = function() {
                return !0
            }, n.callFn("over", t, e)
        },
        onOut: function(t, e) {
            e.draggable.off("drag.pq"), this.removeFeedback();
            var n = this.getDrag(e);
            n && n.out(t, e), this.isOver = function() {}, this.callFn("out", t, e)
        },
        onDrag: function(t, e) {
            var n = this,
                i = pq.elementFromXY(t),
                r = n.getCell(i),
                o = n.Drag,
                a = function() {
                    n.denyDrop = n.callFn("isDroppable", t, e) === !1, n.denyDrop ? (o && o.out(), n.removeFeedback()) : (o && o.over(), n.feedback(t, r))
                };
            (r.length || n.that.$cont[0].contains(i[0])) && (n.addUI(e, t, r), e.rowData && a())
        },
        onDropX: function(t, e) {
            var n, i = this,
                r = i.that,
                o = e.draggable,
                a = e.helper.data("Drag"),
                l = function(i) {
                    if (a && a.grid() != r) a.onDrop(i, t, e);
                    else try {
                        n = o.draggable("instance"), n.options[i].call(o[0], t, e)
                    } catch (l) {}
                };
            l("beforeDrop"), i.callFn("drop", t, e), l("afterDrop")
        },
        onDrop: function(t, e) {
            var n, i = this,
                r = pq.elementFromXY(t);
            i.onOut(t, e), i.denyDrop || (n = i.getCell(r), (n.length || i.that.$cont[0].contains(r[0])) && (i.addUI(e, t, n), i.onDropX(t, e)))
        },
        onMouseout: function() {
            this.removeFeedback()
        },
        onMouseup: function() {
            var e = this;
            e.removeFeedback(), t(document).off(e.ns), e.that.$cont.off(e.ns)
        },
        ratioY: function(t, e) {
            if (e.length) {
                var n = t.pageY,
                    i = this.getCellY(e),
                    r = i[0],
                    o = i[1];
                return (n - r) / (o - r)
            }
        },
        removeFeedback: function() {
            var t = this;
            t.$feedback && (t.$feedback.remove(), t.$feedback = null), t.that.$cont.css("cursor", "")
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery;
    e.pqGrid.defaults.contextMenu = {
        init: function(t, e) {
            var n = {
                    r1: e.rowIndx,
                    c1: e.colIndx,
                    rc: 1,
                    cc: 1
                },
                i = this.Selection(); - 1 == i.indexOf(n) && (i.removeAll(), this.Range(n).select()), this.focus(e)
        }
    }, t(document).on("pqGrid:bootup", function(t, e) {
        var i = e.instance;
        i.iContext = new n(i)
    });
    var n = e.cContext = function(t) {
        var e = this,
            n = e.model = t.options.contextMenu;
        e.that = t, e.ns = ".pq-cmenu", t.on("cellRightClick " + (n.head ? "headRightClick" : ""), e.onContext.bind(e)).on("destroy", e.removeMenu.bind(e))
    };
    n.prototype = {
        get$Item: function(e) {
            return t(e.target).closest(".pq-cmenu-item")
        },
        getItem: function(t) {
            return this.get$Item(t).data("item")
        },
        onContextDoc: function(t) {
            this.getItem(t) || this.removeMenu()
        },
        onclickDoc: function(t) {
            var e, n, i = this.getItem(t);
            i ? (n = i.action, n && (e = n.call(this.that, t, this.ui, i), e !== !1 && this.removeMenu())) : this.removeMenu()
        },
        removeMenu: function() {
            this.$menu && (this.$menu.remove(), delete this.$menu, t(document.body).off(this.ns))
        },
        removeSubMenu: function(t, e) {
            var n = "subMenu";
            e[n] && (e[n].remove(), delete e[n])
        },
        onMouseOver: function(t) {
            var e, n = this,
                i = n.getItem(t),
                r = "subMenu",
                o = n.get$Item(t),
                a = (i || {}).subItems;
            o.siblings().each(n.removeSubMenu), a && a.length && !o[0][r] && (e = n.createMenu(a), e.position({
                my: "left top",
                at: "right top",
                of: o,
                collision: "flipfit"
            }), o[0][r] = e)
        },
        onRemove: function(e) {
            return function() {
                t(this).find(".pq-cmenu-item").each(e.removeSubMenu)
            }
        },
        getItemHtml: function(t, e) {
            if ("separator" == t) return "<tr class='pq-cmenu-item'><td colspan=4 class='pq-bg-0' style='height:2px;'></td></td>";
            var n = t.style,
                i = t.tooltip,
                r = n ? 'style="' + n + '"' : "",
                o = i ? 'title="' + i + '"' : "";
            return "<tr class='pq-cmenu-item " + (t.disabled ? "pq_disabled" : "") + " " + (t.cls || "") + "' indx=" + e + "><td><span class='" + (t.icon || "") + "' /></td><td " + r + " " + o + ">" + t.name + "</td><td>" + (t.shortcut || "") + "</td><td><span class='" + (t.subItems ? "pq-submenu ui-icon ui-icon-carat-1-e" : "") + "' /></td></tr>"
        },
        createMenu: function(e) {
            e = e.filter(function(t) {
                return null != t
            });
            var n, i = this,
                r = "";
            return e.forEach(function(t, e) {
                r += i.getItemHtml(t, e)
            }), n = t("<div class='pq-cmenu pq-theme pq-popup'><table>" + r + "</table></div>").appendTo(document.body), n.find(".pq-cmenu-item").each(function(n, i) {
                t(i).data("item", e[n])
            }), n.on("mouseover", i.onMouseOver.bind(i)).on("remove", i.onRemove(i)), n
        },
        onContext: function(t, e) {
            return this.model.on ? this.showMenu(t, e) : void 0
        },
        showMenu: function(e, n) {
            var i = this,
                r = i.model,
                o = i.that,
                a = i.$menu,
                l = r.items,
                s = "function" == typeof l ? l.call(o, e, n) : l;
            return a && i.removeMenu(), s && s.length ? (r.init.call(o, e, n), i.ui = n, a = i.$menu = i.createMenu(s), a.css({
                position: "absolute",
                left: e.pageX,
                top: e.pageY
            }), t(document.body).on("click" + i.ns, i.onclickDoc.bind(i)).on("contextmenu" + i.ns, i.onContextDoc.bind(i)), !1) : void 0
        }
    }
}(jQuery),
function(t) {
    t(document).on("pqGrid:bootup", function(t, e) {
        var i = e.instance;
        i.iAnim = new n(i)
    });
    var e = t.paramquery,
        n = e.cAnim = function(t) {
            var e = this,
                n = e.model = t.options.animModel;
            e.grid = t, n.on && t.on(n.events, e.onBefore.bind(e))
        },
        i = e.pqGrid.prototype,
        r = i.options;
    i.Anim = function() {
        return this.iAnim
    }, r.animModel = {
        duration: 290,
        events: "beforeSortDone beforeFilterDone beforeRowExpandDone beforeGroupExpandDone beforeMoveNode beforeAutoRowHeight beforeValidateDone beforeTreeExpandDone onResizeHierarchy",
        eventsH: "beforeHideColsDone beforeColumnCollapseDone beforeColumnOrderDone beforeFlex columnResize"
    }, n.prototype = {
        cleanUp: function() {
            (this.data || []).forEach(function(t) {
                t.pq_top = t.pq_hideOld = void 0
            }), this.data = this.render = null
        },
        isActive: function() {
            return this._active
        },
        onBefore: function(t, e) {
            if (!t.isDefaultPrevented() && !this.data) {
                var n, i = this,
                    r = i.grid,
                    o = r.iRenderB,
                    a = i.data = o.data,
                    l = i.render = [];
                try {
                    i.htTbl = o.dims.htTbl, o.eachV(function(t, e) {
                        n = o.get$Row(e), t.pq_render = 1, l.push([t, n.clone(), n.map(function(t, e) {
                            return e.parentNode
                        })])
                    }), a.forEach(function(t, e) {
                        t.pq_top = o.getTop(e), t.pq_hideOld = t.pq_hidden
                    }), r.one("refresh", i.oneRefresh.bind(i)), setTimeout(function() {
                        i.cleanUp()
                    })
                } catch (s) {
                    i.data = null
                }
            }
        },
        oneRefresh: function() {
            if (this.data) {
                var e, n = this,
                    i = n.grid,
                    r = i.iRenderB,
                    o = n.model.duration,
                    a = t([r.$tbl_left[0], r.$tbl_right[0]]),
                    l = n.htTbl,
                    s = r.dims.htTbl;
                n._active = !0, l > s && a.css("height", l), setTimeout(function() {
                    a.css("height", r.dims.htTbl), n._active = !1
                }, o), r.eachV(function(t, n) {
                    delete t.pq_render;
                    var i, a, l = r.getTop(n),
                        s = t.pq_top;
                    (s != l || t.pq_hideOld) && (e = r.get$Row(n), null == s || t.pq_hideOld ? (i = {
                        opacity: 0
                    }, a = {
                        opacity: 1
                    }) : (i = {
                        top: s
                    }, a = {
                        top: l
                    }), e.css(i).animate(a, o))
                }), n.render.forEach(n.removeRows.bind(n)), n.cleanUp()
            }
        },
        removeRows: function(e) {
            var n, i, r = e[0],
                o = r.pq_ri,
                a = this.model.duration,
                l = {
                    opacity: 1,
                    top: r.pq_top
                };
            if (r.pq_render) {
                if (delete r.pq_render, n = e[1].each(function(n, i) {
                        t(i).removeAttr("id").appendTo(e[2][n]).children().removeAttr("id")
                    }), n.css(l), null == o || r.pq_hidden) l = {
                    opacity: 0
                };
                else try {
                    i = this.grid.iRenderB.getTop(o), l = {
                        top: i
                    }
                } catch (s) {
                    l = {
                        opacity: 0
                    }
                }
                n.animate(l, a, function() {
                    this.parentNode && this.parentNode.removeChild(this)
                })
            }
        }
    }
}(jQuery),
function(t) {
    t(document).on("pqGrid:bootup", function(t, e) {
        var i = e.instance;
        i.iAnimH = new n(i)
    });
    var e = t.paramquery,
        n = e.cAnimH = function(t) {
            var e = this,
                n = e.model = t.options.animModel;
            e.grid = t, n.on && t.on(n.eventsH, e.onBeforeCol.bind(e))
        },
        i = e.pqGrid.prototype;
    i.AnimH = function() {
        return this.iAnimH
    }, n.prototype = {
        cleanUp: function() {
            (this.data || []).forEach(function(t) {
                t.pq_left = t.pq_hideOld = void 0
            }), this.data = this.render = null
        },
        get$Col: function() {
            var t = this.grid,
                e = t.iRenderB,
                n = t.iRenderHead,
                i = t.iRenderSum,
                r = e.getAllCells(),
                o = n.getAllCells(),
                a = i.getAllCells();
            return function(t) {
                return e.get$Col(t, r).add(n.get$Col(t, o)).add(i.get$Col(t, a))
            }
        },
        onBeforeCol: function(t) {
            if (!t.isDefaultPrevented() && !this.data) {
                var e, n = this,
                    i = n.grid,
                    r = n.data = i.getColModel(),
                    o = n.get$Col(),
                    a = i.iRenderB,
                    l = n.render = [];
                r.forEach(function(t, e) {
                    t.pq_hideOld = t.hidden, t.pq_left = a.getLeft(e)
                }), a.eachH(function(t, n) {
                    e = o(n), t.pq_render = 1, l.push([t, e.clone(), e.map(function(t, e) {
                        return e.parentNode.id
                    })])
                }), i.one("softRefresh refresh", n.oneRefreshCol.bind(n))
            }
        },
        oneRefreshCol: function() {
            if (this.data) {
                var t, e = this,
                    n = e.grid,
                    i = n.iRenderB,
                    r = e.model.duration,
                    o = e.get$Col();
                i.eachH(function(e, n) {
                    delete e.pq_render;
                    var a = i.getLeft(n),
                        l = e.pq_left;
                    (l != a || e.pq_hideOld) && (t = o(n), null == l ? t.css("opacity", 0).animate({
                        opacity: 1
                    }, r) : e.pq_hideOld ? t.css({
                        opacity: 0,
                        left: l
                    }).animate({
                        opacity: 1,
                        left: a
                    }, r) : t.css("left", l).animate({
                        left: a
                    }, r))
                }), e.render.forEach(e.removeCols.bind(e)), e.cleanUp()
            }
        },
        removeCols: function(e) {
            var n, i, r, o = this,
                a = e[0],
                l = o.model.duration,
                s = o.grid,
                d = s.iRenderB,
                c = s.colIndxs[a.dataIndx];
            a.pq_render && (delete a.pq_render, n = e[1].each(function(n, i) {
                t(i).removeAttr("id").appendTo(document.getElementById(e[2][n]))
            }), null == c || a.hidden ? (n.css("opacity", 1), r = {
                opacity: 0
            }) : (i = d.getLeft(c), r = {
                left: i
            }), n.animate(r, l, function() {
                this.parentNode && this.parentNode.removeChild(this)
            }))
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery;
    t(document).on("pqGrid:bootup", function(t, e) {
        var i = e.instance;
        i.iFillHandle = new n(i)
    }), e.pqGrid.defaults.fillHandle = "all", e.pqGrid.defaults.autofill = !0;
    var n = e.cFillHandle = function(t) {
        var e = this;
        e.$wrap, e.locked, e.sel, e.that = t, t.on("selectChange", e.onSelectChange(e)).on("selectEnd", e.onSelectEnd(e)).on("assignTblDims", e.onRefresh(e)).on("keyDown", e.onKeyDown.bind(e))
    };
    n.prototype = {
        create: function() {
            var e = this;
            if (!e.locked) {
                e.remove();
                var n = e.that,
                    i = n.Selection().address();
                if (1 === i.length) {
                    var i = i[0],
                        r = i.r2,
                        o = i.c2,
                        a = n.iMerge,
                        l = a.getRootCellO(r, o, !0),
                        s = n.getCell(l);
                    if (s.length && n._trigger("beforeFillHandle", null, l) !== !1) {
                        var d = s[0],
                            c = d.parentNode.parentNode,
                            u = c.parentNode,
                            h = 10,
                            f = d.offsetLeft + d.offsetWidth - 5,
                            p = d.parentNode.offsetTop + d.offsetHeight - 5,
                            g = Math.min(f + h, c.offsetWidth),
                            f = g - h,
                            v = Math.min(p + h, c.offsetHeight),
                            p = v - h,
                            m = t("<div class='pq-fill-handle'></div>").appendTo(u);
                        m.css({
                            position: "absolute",
                            top: p,
                            left: f,
                            height: h,
                            width: h,
                            background: "#333",
                            cursor: "crosshair",
                            border: "2px solid #fff",
                            zIndex: 1
                        }), e.$wrap = m
                    }
                }
            }
        },
        onSelectChange: function(t) {
            return function() {
                t.remove()
            }
        },
        onSelectEnd: function(t) {
            return function() {
                this.options.fillHandle && (t.create(), t.setDraggable(), t.setDoubleClickable())
            }
        },
        onRefresh: function(t) {
            var e;
            return function() {
                this.options.fillHandle ? (clearTimeout(e), e = setTimeout(function() {
                    t.that.element && (t.create(), t.setDraggable())
                }, 50)) : t.remove()
            }
        },
        remove: function() {
            var t = this.$wrap;
            t && t.remove()
        },
        setDoubleClickable: function() {
            var t = this,
                e = t.$wrap;
            e && e.on("dblclick", t.onDblClick(t.that, t))
        },
        setDraggable: function() {
            var t = this,
                e = t.$wrap,
                n = t.that.$cont;
            e && e.draggable({
                helper: function() {
                    return "<div style='height:10px;width:10px;cursor:crosshair;'></div>"
                },
                appendTo: n,
                start: function() {
                    t.onStart()
                },
                drag: function(e) {
                    t.onDrag(e)
                },
                stop: function() {
                    t.onStop()
                }
            })
        },
        patternDate: function(t) {
            var e = this;
            return function(n) {
                var i = new Date(t);
                return i.setDate(i.getDate() + (n - 1)), e.formatDate(i)
            }
        },
        formatDate: function(t) {
            return t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear()
        },
        patternDate2: function(t, e) {
            var n, i = new Date(t),
                r = new Date(e),
                o = this,
                a = r.getDate() - i.getDate(),
                l = r.getMonth() - i.getMonth(),
                s = r.getFullYear() - i.getFullYear();
            return !l && !s || !a && !l || !s && !a ? function(e) {
                var n = new Date(t);
                return a ? n.setDate(n.getDate() + a * (e - 1)) : l ? n.setMonth(n.getMonth() + l * (e - 1)) : n.setFullYear(n.getFullYear() + s * (e - 1)), o.formatDate(n)
            } : (i = Date.parse(i), n = Date.parse(r) - i, function(t) {
                var e = new Date(i + n * (t - 1));
                return o.formatDate(e)
            })
        },
        getDT: function(t) {
            for (var e, n, i, r = t.length, o = 0; r > o; o++) {
                if (e = t[o], parseFloat(e) == e ? i = "number" : pq.validation.isDate(e) && (i = "date"), n && n != i) return "string";
                n = i
            }
            return i
        },
        pattern: function(t) {
            var e = this.getDT(t);
            if ("string" == e || !e) return !1;
            var n, i, r, o = t.length,
                a = "date" === e;
            return 2 === o ? a ? this.patternDate2(t[0], t[1]) : (n = t[1] - t[0], i = t[0] - n, function(t) {
                return n * t + i
            }) : 3 === o ? (n = (t[2] - 2 * t[1] + t[0]) / 2, i = t[1] - t[0] - 3 * n, r = t[0] - n - i, function(t) {
                return n * t * t + i * t + r
            }) : !1
        },
        autofillVal: function(t, e, n, i) {
            var r, o, a, l, s, d = this.that,
                c = t.r1,
                u = t.c1,
                h = t.r2,
                f = t.c2,
                p = e.r1,
                g = e.c1,
                v = e.r2,
                m = e.c2,
                w = [];
            if (i) {
                for (l = {
                        r1: c,
                        r2: h
                    }, l.c1 = u > g ? g : f + 1, l.c2 = u > g ? u - 1 : m, s = g - u, o = g; m >= o; o++)
                    if (s++, u > o || o > f)
                        for (r = 0, a = c; h >= a; a++) w.push(n[r](s, o)), r++
            } else
                for (l = {
                        c1: u,
                        c2: f
                    }, l.r1 = c > p ? p : h + 1, l.r2 = c > p ? c - 1 : v, s = p - c, o = p; v >= o; o++)
                    if (s++, c > o || o > h)
                        for (r = 0, a = u; f >= a; a++) w.push(n[r](s, o)), r++; return d.Range(l).value(w), !0
        },
        autofill: function(t, e) {
            var n, i, r, o, a, l, s, d, c = this.that,
                u = c.colModel,
                h = c.get_p_data(),
                f = [],
                p = t.r1,
                g = t.c1,
                v = t.r2,
                m = t.c2,
                w = e.c1 != g || e.c2 != m;
            if (w) {
                for (a = p; v >= a; a++) {
                    if (s = {
                            sel: {
                                r: a,
                                c: g
                            },
                            x: !0
                        }, c._trigger("autofillSeries", null, s), !(d = s.series)) return;
                    f.push(d)
                }
                return this.autofillVal(t, e, f, w)
            }
            for (l = g; m >= l; l++) {
                for (n = u[l], i = n.dataType, o = n.dataIndx, r = [], a = p; v >= a; a++) r.push(h[a][o]);
                if (s = {
                        cells: r,
                        sel: {
                            r1: p,
                            c: l,
                            r2: v,
                            r: p
                        }
                    }, c._trigger("autofillSeries", null, s), !(d = s.series || this.pattern(r, i))) return;
                f.push(d)
            }
            return this.autofillVal(t, e, f)
        },
        onKeyDown: function(e) {
            if (!this.oldAF && pq.isCtrl(e)) {
                var n = this,
                    i = n.that.options;
                n.oldAF = i.autofill, i.autofill = !1, t(document.body).one("keyup", function() {
                    i.autofill = n.oldAF, delete n.oldAF
                })
            }
        },
        onStop: function() {
            var t = this,
                e = t.that,
                n = e.options.autofill,
                i = t.sel,
                r = e.Selection().address()[0];
            i.r1 == r.r1 && i.c1 == r.c1 && i.r2 == r.r2 && i.c2 == r.c2 || (t.locked = !1, n && t.autofill(i, r) || e.Range(i).copy({
                dest: r
            }))
        },
        onStart: function() {
            this.locked = !0, this.sel = this.that.Selection().address()[0]
        },
        onDrag: function(e) {
            var n = this,
                i = n.that,
                r = i.options.fillHandle,
                o = "all" == r,
                a = o || "horizontal" == r,
                l = o || "vertical" == r,
                s = e.clientX - 10,
                d = e.clientY,
                c = document.elementFromPoint(s, d),
                u = t(c).closest(".pq-grid-cell");
            if (u.length) {
                var h = i.getCellIndices({
                        $td: u
                    }),
                    f = n.sel,
                    p = f.r1,
                    g = f.c1,
                    v = f.r2,
                    m = f.c2,
                    w = {
                        r1: p,
                        c1: g,
                        r2: v,
                        c2: m
                    },
                    x = function(t, e) {
                        w[t] = e, i.Range(w).select()
                    },
                    y = h.rowIndx,
                    C = h.colIndx;
                o && v >= y && y >= p || a && !l ? C > m ? x("c2", C) : g > C && x("c1", C) : l && (y > v ? x("r2", y) : p > y && x("r1", y))
            }
        },
        onDblClick: function(t, e) {
            return function() {
                var n = t.options,
                    i = n.fillHandle;
                if ("all" == i || "vertical" == i) {
                    for (var r, o = t.Selection().address()[0], a = o.c2, l = o.r2 + 1, s = n.dataModel.data, d = t.getColModel()[a].dataIndx; r = s[l];) {
                        if (null != r[d] && "" !== r[d]) {
                            l--;
                            break
                        }
                        l++
                    }
                    e.onStart(), t.Range({
                        r1: o.r1,
                        c1: o.c1,
                        r2: l,
                        c2: a
                    }).select(), e.onStop()
                }
            }
        }
    }
}(jQuery),
function(t) {
    t(document).on("pqGrid:bootup", function(t, n) {
        new e(n.instance)
    });
    var e = t.paramquery.cScroll = function(t) {
        var e = this;
        e.that = t, e.ns = ".pqgrid-csroll", t.on("create", e.onCreate.bind(e))
    };
    e.prototype = {
        onCreate: function() {
            var e = this,
                n = e.that,
                i = n.iDrop && n.iDrop.isOn();
            t(i ? document : n.$cont).on("mousedown", e.onMouseDown.bind(e))
        },
        onMouseDown: function(e) {
            var n = this,
                i = n.that,
                r = t(e.target),
                o = n.$draggable = r.closest(".ui-draggable"),
                a = n.ns;
            (o.length || r.closest(i.$cont).length) && t(document).on("mousemove" + a, n[o.length ? "onMouseMove" : "process"].bind(n)).on("mouseup" + a, n.onMouseUp.bind(n))
        },
        onMouseMove: function(t) {
            (this.capture || pq.elementFromXY(t).closest(this.that.$cont).length && this.that.iDrop.isOver()) && (this.capture = !0, this.process(t))
        },
        onMouseUp: function() {
            t(document).off(this.ns), this.capture = !1
        },
        process: function(t) {
            var e = this,
                n = e.that,
                i = n.$cont,
                r = i[0].offsetHeight,
                o = i[0].offsetWidth,
                a = i.offset(),
                l = a.top,
                s = a.left,
                d = l + r,
                c = s + o,
                u = t.pageY,
                h = t.pageX,
                f = u - d,
                p = h - c,
                g = l - u,
                v = s - h;
            h > s && c > h && (f > 0 || g > 0) ? f > 0 ? e.scrollV(f, !0) : g > 0 && e.scrollV(g) : u > l && d > u && (p > 0 ? e.scrollH(p, !0) : v > 0 && e.scrollH(v))
        },
        scrollH: function(t, e) {
            this.scroll(t, e, !0)
        },
        scrollV: function(t, e) {
            this.scroll(t, e)
        },
        scroll: function(t, e, n) {
            var i = this.that,
                r = i.iRenderB,
                o = r.getContRight()[0],
                a = o[n ? "scrollWidth" : "scrollHeight"],
                l = o[n ? "scrollLeft" : "scrollTop"],
                s = 1e3 > a ? 1 : 1 + (a - 1e3) / a;
            t = Math.pow(t, s);
            var d = l + (e ? t : -t);
            r[n ? "scrollX" : "scrollY"](d)
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery;
    e.cFormula = function(t) {
        var e = this;
        e.that = t, e.oldF = [], t.one("ready", function() {
            t.on("CMInit", e.onCMInit(e))
        }).on("dataAvailable", function() {
            e.onDA()
        }).on(!0, "change", function(t, n) {
            e.onChange(n)
        })
    }, e.cFormula.prototype = {
        onCMInit: function(t) {
            return function(e, n) {
                t.isFormulaChange(t.oldF, t.formulas()) && t.calcMainData()
            }
        },
        callRow: function(t, e, n) {
            var i = this.that,
                r = 0;
            if (t)
                for (r = 0; n > r; r++) {
                    var o = e[r],
                        a = o[0],
                        l = o[1];
                    t[a.dataIndx] = l.call(i, t, a)
                }
        },
        onDA: function() {
            this.calcMainData()
        },
        isFormulaChange: function(t, e) {
            var n = !1,
                i = 0,
                r = t.length,
                o = e.length;
            if (r == o) {
                for (; r > i; i++)
                    if (t[i][1] != e[i][1]) {
                        n = !0;
                        break
                    }
            } else n = !0;
            return n
        },
        calcMainData: function() {
            var t = this.formulaSave(),
                e = this.that,
                n = t.length;
            if (n) {
                for (var i = e.options, r = i.dataModel.data, o = r.length; o--;) this.callRow(r[o], t, n);
                e._trigger("formulaComputed")
            }
        },
        onChange: function(t) {
            var e = this.formulas(),
                n = e.length,
                i = this,
                r = function(t) {
                    i.callRow(t.rowData, e, n)
                };
            n && (t.addList.forEach(r), t.updateList.forEach(r))
        },
        formulas: function() {
            var t, e, n = this.that,
                i = [],
                r = n.options.formulas || [];
            return r.forEach(function(r) {
                t = n.getColumn({
                    dataIndx: r[0]
                }), t && (e = r[1], e && i.push([t, e]))
            }), i
        },
        formulaSave: function() {
            var t = this.formulas();
            return this.oldF = t, t
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery;
    e.pqGrid.defaults.treeModel = {
        cbId: "pq_tree_cb",
        source: "checkboxTree",
        childstr: "children",
        iconCollapse: ["ui-icon-triangle-1-se", "ui-icon-triangle-1-e"],
        iconFolder: ["ui-icon-folder-open", "ui-icon-folder-collapsed"],
        iconFile: "ui-icon-document",
        id: "id",
        indent: 18,
        parentId: "parentId",
        refreshOnChange: !0
    }, e.pqGrid.prototype.Tree = function() {
        return this.iTree
    }, t(document).on("pqGrid:bootup", function(t, e) {
        var i = e.instance;
        i.iTree = new n(i)
    });
    var n = e.cTree = function(t) {
        this.model = "treeModel", this.that = t, this.fns = {}, this.init(), this.cache = {}, this.di_prev, this.chkRows = []
    };
    n.prototype = t.extend({}, pq.mixin.ChkGrpTree, pq.mixin.GrpTree, {
        addNodes: function(t, e, n) {
            var i, r, o, a, l = this,
                s = l.that,
                d = s.options.dataModel,
                c = d.data,
                u = l.parentId,
                h = l.childstr,
                f = l.id,
                p = {},
                g = [],
                v = 0,
                m = l.cache,
                w = function(t) {
                    if (m[t]) throw "duplicate id";
                    p[t] = 1
                },
                x = [];
            if (e ? (r = e[f], i = c.indexOf(e) + (null == n ? (e[h] || []).length : n) + 1) : i = c.length, t.forEach(function(t) {
                    var e = t[f];
                    if (!p[e] && (g.push(t), w(e), null != r && (t[u] = r), t[h])) {
                        var n = l.getChildrenAll(t);
                        n.forEach(function(t) {
                            w(t[f])
                        }), l.copyArray(g, n)
                    }
                }), o = g.length) {
                for (; o > v; v++) a = g[v], x.push({
                    newRow: a,
                    rowIndx: i++
                });
                s._digestData({
                    addList: x,
                    checkEditable: !1,
                    source: "addNodes"
                }), l.refreshView()
            }
        },
        collapseAll: function(t) {
            this[t ? "expandNodes" : "collapseNodes"](this.that.options.dataModel.data)
        },
        collapseNodes: function(t, e, n) {
            for (var i, r, o = 0, a = this.that, l = t.length, s = [], d = !n; l > o; o++) i = t[o], this.isFolder(i) && this.isCollapsed(i) !== d && s.push(i);
            if (s.length && (r = {
                    close: d,
                    nodes: s
                }, a._trigger("beforeTreeExpand", e, r) !== !1)) {
                for (l = s.length, o = 0; l > o; o++) i = s[o], i.pq_close = d;
                a._trigger("treeExpand", e, r), this.setCascadeInit(!1), this.refreshView()
            }
        },
        deleteNodes: function(t) {
            var e, n, i = this,
                r = i.that,
                o = 0,
                a = {},
                l = i.id,
                s = [];
            if (t) {
                for (e = t.length; e > o; o++) n = t[o], i.eachChild(n, function(t) {
                    var e = t[l];
                    a[e] || (a[e] = 1, s.push({
                        rowData: t
                    }))
                });
                r._digestData({
                    deleteList: s,
                    source: "deleteNodes"
                }), i.refreshView()
            }
        },
        expandAll: function() {
            this.collapseAll(!0)
        },
        expandNodes: function(t, e) {
            this.collapseNodes(t, e, !0)
        },
        expandTo: function(t) {
            var e = [];
            do t.pq_close && e.push(t); while (t = this.getParent(t));
            this.expandNodes(e)
        },
        exportCell: function(t, e) {
            for (var n = "", i = 0; e > i; i++) n += "- ";
            return n + (null == t ? "" : t)
        },
        filter: function(t, e, n, i, r, o) {
            for (var a, l, s, d, c = this.childstr, u = 0, h = t.length; h > u; u++) a = t[u], l = !1, (d = a[c]) && (l = this.filter(d, e, n, i, r, o), l && (s = !0, r.push(a))), l || (n.isMatchRow(a, e, i) ? (s = !0, r.push(a)) : o.push(a));
            return s
        },
        getFormat: function() {
            for (var t, e, n = this, i = n.that.options.dataModel.data, r = "flat", o = 0, a = i.length, l = n.parentId, s = n.childstr; a > o && (t = i[o], null == t[l]); o++)
                if ((e = t[s]) && e.length) return n.getParent(e[0]) == t ? "flat" : "nested";
            return r
        },
        getChildrenAll: function(t, e) {
            for (var n, i = this.childstr, r = t[i] || [], o = r.length, a = 0, l = e || []; o > a; a++) n = r[a], l.push(n), n[i] && this.getChildrenAll(n, l);
            return l
        },
        getLevel: function(t) {
            return t.pq_level
        },
        _groupById: function(t, e, n, i, r) {
            for (var o, a = this, l = a.childstr, s = 0, d = n.length; d > s; s++) {
                var c = n[s],
                    u = c[e];
                c.pq_level = r, t.push(c), (o = i[u]) ? (c[l] = o, a._groupById(t, e, o, i, r + 1)) : delete c[l]
            }
        },
        groupById: function(t) {
            for (var e, n, i, r = this, o = r.id, a = r.parentId, l = {}, s = [], d = 0, c = t.length; c > d; d++) i = t[d], e = i[a], null == e && (e = ""), (n = l[e]) || (n = l[e] = []), n.push(i);
            return r._groupById(s, o, l[""] || [], l, 0), s
        },
        init: function() {
            var t = this,
                e = t.that,
                n = e.options,
                i = n.treeModel,
                r = i.cbId,
                o = t.dataIndx = i.dataIndx;
            t.cbId = r, t.prop = "pq_tree_prop", t.id = i.id, t.parentId = i.parentId, t.childstr = i.childstr, t.onCMInit(), o ? t._init || (t.on("CMInit", t.onCMInit.bind(t)).on("dataAvailable", t.onDataAvailable(t, e, i)).on("dataReadyAfter", t.onDataReadyAfter(t, e, i)).on("beforeCellKeyDown", t.onBeforeCellKeyDown.bind(t)).on("customSort", t.onCustomSortTree.bind(t)).on("customFilter", t.onCustomFilter.bind(t)).on("clearFilter", t.onClearFilter.bind(t)).on("change", t.onChange(t, e, i)).on("cellClick", t.onCellClick.bind(t)).on("refresh refreshRow", t.onRefresh(t, i)).on("valChange", t.onCheckbox(t, i)).on("refreshHeader", t.onRefreshHeader.bind(t)).on("beforeCheck", t.onBeforeCheck.bind(t)), t.setCascadeInit(!0), t._init = !0) : t._init && (this.off(), t._init = !1), t._init && (n.groupModel.on = i.summary)
        },
        initData: function() {
            var t = this,
                e = t.that,
                n = e.options,
                i = n.dataModel;
            i.data = t["flat" == t.getFormat() ? "groupById" : "flatten"](i.data), t.buildCache()
        },
        isCollapsed: function(t) {
            return !!t.pq_close
        },
        isOn: function() {
            return null != this.that.options.treeModel.dataIndx
        },
        moveNodes: function(t, e, n) {
            var i, r, o, a, l, s = this,
                d = s.that,
                c = s.parentId,
                u = s.id,
                h = s.childstr,
                f = d.options.dataModel,
                p = e[h],
                g = p.length,
                v = e[u],
                m = {},
                n = null == n || n >= g ? g : n,
                w = 0;
            if (t.forEach(function(t) {
                    m[t[u]] = 1
                }), o = t.reduce(function(t, e) {
                    return m[e[c]] || t.push(e), t
                }, []), a = o.length) {
                for (d._trigger("beforeMoveNode"); a > w; w++) l = o[w], i = s.getParent(l), r = i[h].indexOf(l), i == e ? n = pq.moveItem(l, e[h], r, n) : (e[h].splice(n++, 0, l), i[h].splice(r, 1)), l[c] = v;
                f.data = s.flatten(s.getRoots()), d.refreshView(), d._trigger("moveNode")
            }
        },
        off: function() {
            var t, e = this.fns,
                n = this.that;
            for (t in e) n.off(t, e[t]);
            this.fns = {}
        },
        on: function(t, e) {
            return this.fns[t] = e, this.that.on(t, e), this
        },
        onCellClick: function(e, n) {
            var i = this;
            if (n.dataIndx == i.dataIndx && t(e.originalEvent.target).hasClass("pq-group-icon"))
                if (pq.isCtrl(e)) {
                    var r = n.rowData;
                    i[r.pq_close ? "expandAll" : "collapseAll"]()
                } else i.toggleNode(n.rowData, e)
        },
        onBeforeCellKeyDown: function(e, n) {
            var i, r, o = this,
                a = o.that,
                l = n.rowData,
                s = n.dataIndx,
                d = e.keyCode,
                c = t.ui.keyCode;
            if (s == o.dataIndx) {
                if (o.isFolder(l) && (r = l.pq_close, d == c.ENTER && !a.isEditable({
                        rowIndx: l.pq_ri,
                        dataIndx: s
                    }) || !r && d == c.LEFT || r && d == c.RIGHT)) return o.toggleNode(l), !1;
                if (d == c.SPACE && (i = a.getCell(n).find("input[type='checkbox']"), i.length)) return i.click(), !1
            }
        },
        onChange: function(t, e, n) {
            return function(i, r) {
                var o = r.source || "",
                    a = r.addList.length,
                    l = r.deleteList.length; - 1 == o.indexOf("checkbox") && ("undo" != o && "redo" != o || !a && !l ? n.summary && n.refreshOnChange && !a && !l ? (t.summaryT(), e.refresh()) : "addNodes" != o && "deleteNodes" != o || t.refreshViewFull() : t.refreshViewFull())
            }
        },
        onClearFilter: function(t, e) {
            return e.data = this.groupById(e.data), !1
        },
        onCustomFilter: function(t, e) {
            var n = this,
                i = n.that,
                r = n.groupById(e.data),
                o = i.iFilterData,
                a = e.filters,
                l = [],
                s = [],
                d = e.mode;
            return n.filter(n.getRoots(r), a, o, d, l, s), e.dataTmp = n.groupById(l), e.dataUF = s, !1
        },
        onDataAvailable: function(t) {
            return function() {
                t.initData()
            }
        },
        onDataReadyAfter: function(t, e, n) {
            return function() {
                n.summary && t.summaryT(t), t.showHideRows(), t.isCascade(n) && t.cascadeInit()
            }
        },
        option: function(e, n) {
            var i, r = this,
                o = r.that,
                a = o.options.treeModel,
                l = a.dataIndx;
            t.extend(a, e), i = a.dataIndx, r.setCellRender(), r.init(), !l && i && r.initData(), n !== !1 && o.refreshView()
        },
        renderCell: function(t, e) {
            return function(n) {
                var i, r, o, a, l, s, d, c = n.rowData,
                    u = t.that,
                    h = e.indent,
                    f = n.column,
                    p = f.renderLabel || e.render,
                    g = e.iconCollapse,
                    v = e.checkbox,
                    m = t.isFolder(c),
                    w = t._iconCls(c, m, e),
                    x = c.pq_level || 0,
                    y = x * h,
                    C = y + 1 * h,
                    b = ["pq-group-title-cell"],
                    I = ["text-indent:", m ? y : C, "px;"],
                    _ = n.formatVal || n.cellData;
                if (p) {
                    var q = u.callFn(p, n);
                    null != q && ("string" != typeof q ? (q.iconCls && (w = q.iconCls), null != q.text && (_ = q.text), l = q.attr, b.push(q.cls), I.push(q.style)) : _ = q)
                }
                return n.Export ? t.exportCell(_, x) : (v && (s = t.renderCB(v, c, e.cbId), s && (d = s[0], s[1] && b.push(s[1]))), m && (o = c.pq_close ? g[1] : g[0], r = "<span class='pq-group-icon ui-icon " + o + "'></span>"), w && (a = "<span class='pq-tree-icon ui-icon " + w + "'></span>"), i = d && (f.useLabel || e.useLabel), {
                    cls: b.join(" "),
                    attr: l,
                    style: I.join(""),
                    text: [r, a, i ? "<label style='width:100%;'>" : "", d, _, i ? "</label>" : ""].join("")
                })
            }
        },
        refreshViewFull: function(t) {
            var e = this,
                n = e.that.options.dataModel;
            n.data = e.groupById(n.data), e.buildCache(), t && e.refreshView()
        },
        _iconCls: function(t, e, n) {
            if (n.icons) {
                var i;
                if (e && (i = n.iconFolder)) return t.pq_close ? i[1] : i[0];
                if (!t.pq_gsummary) return n.iconFile
            }
        },
        setCellRender: function() {
            var t, e, n = this,
                i = n.that,
                r = i.options.treeModel,
                o = i.columns;
            r.summary && i.iGroup.refreshColumns(), (t = n.di_prev) && (e = o[t], e && (e._render = null), n.di_prev = null), (t = r.dataIndx) && (e = o[t], e._render = n.renderCell(n, r), n.di_prev = t)
        },
        _showHideRows: function(t, e, n) {
            for (var i, r, o, a = this, l = e || a.getRoots(), s = a.childstr, d = n || !1, c = l.length, u = 0; c > u; u++) i = l[u], i.pq_hidden = d, (o = i[s]) && (r = d || i.pq_close, a._showHideRows(t, o, r))
        },
        showHideRows: function() {
            var t, e, n = this,
                i = n.that,
                r = 0,
                o = i.get_p_data(),
                a = i.options.treeModel.summary;
            if (n._showHideRows(o), a)
                for (o = i.pdata, t = o.length; t > r; r++) e = o[r], e.pq_gsummary && (e.pq_hidden = n.getParent(e).pq_hidden)
        },
        toggleNode: function(t, e) {
            this[t.pq_close ? "expandNodes" : "collapseNodes"]([t], e)
        }
    })
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e.pqGrid.prototype,
        i = function(t) {
            this.that = t;
            var e = t.options;
            this.options = e, this.selection = [], this.hclass = " pq-state-select " + (e.bootstrap.on ? "" : "ui-state-highlight")
        };
    e.cRows = i, n.SelectRow = function() {
        return this.iRows
    }, i.prototype = {
        _add: function(t, e) {
            var n, i = this.that,
                r = t.rowIndxPage,
                o = !e,
                a = t.rowData,
                l = this.inViewRow(r);
            return !a.pq_hidden && l && (n = i.getRow(t), n.length && (n[o ? "addClass" : "removeClass"](this.hclass), !o && n.removeAttr("tabindex"))), a.pq_rowselect = o, t
        },
        _data: function(t) {
            t = t || {};
            var e = this.that,
                n = t.all,
                i = e.riOffset,
                r = n ? 0 : i,
                o = e.get_p_data(),
                a = n ? o.length : e.pdata.length,
                l = r + a;
            return [o, r, l]
        },
        add: function(t) {
            var e = t.addList = t.rows || [{
                rowIndx: t.rowIndx
            }];
            t.isFirst && this.setFirst(e[0].rowIndx), this.update(t)
        },
        extend: function(t) {
            var e, n, i, r, o, a = t.rowIndx,
                l = [],
                s = this.getFirst();
            if (null != s) {
                if (o = this.isSelected({
                        rowIndx: s
                    }), null == o) return;
                for (s > a ? (s = [a, a = s][0], i = s, r = a - 1) : (i = s + 1, r = a), e = i; r >= e; e++) n = {
                    rowIndx: e
                }, l.push(n);
                this.update(o ? {
                    addList: l
                } : {
                    deleteList: l
                })
            }
        },
        getFirst: function() {
            return this._firstR
        },
        getSelection: function() {
            for (var t, e = this.that, n = e.get_p_data(), i = 0, r = n.length, o = []; r > i; i++) t = n[i], t && t.pq_rowselect && o.push({
                rowIndx: i,
                rowData: t
            });
            return o
        },
        inViewCol: function(t) {
            var e = this.that,
                n = e.options,
                i = e.iRenderB,
                r = n.freezeCols;
            return r > t ? !0 : t >= i.initH && t <= i.finalH
        },
        inViewRow: function(t) {
            var e = this.that,
                n = e.options,
                i = e.iRenderB,
                r = n.freezeRows;
            return r > t ? !0 : t >= i.initV && t <= i.finalV
        },
        isSelected: function(t) {
            var e = t.rowData || this.that.getRowData(t);
            return e ? e.pq_rowselect === !0 : null
        },
        isSelectedAll: function(t) {
            for (var e, n = this._data(t), i = n[0], r = n[1], o = n[2]; o > r; r++)
                if (e = i[r], e && !e.pq_rowselect) return !1;
            return !0
        },
        removeAll: function(t) {
            this.selectAll(t, !0)
        },
        remove: function(t) {
            var e = t.deleteList = t.rows || [{
                rowIndx: t.rowIndx
            }];
            t.isFirst && this.setFirst(e[0].rowIndx), this.update(t)
        },
        replace: function(t) {
            t.deleteList = this.getSelection(), this.add(t)
        },
        selectAll: function(t, e) {
            for (var n, i = this.that, r = [], o = i.riOffset, a = this._data(t), l = a[0], s = a[1], d = a[2]; d > s; s++) n = l[s], n && r.push({
                rowIndx: s,
                rowIndxPage: s - o,
                rowData: n
            });
            this.update(e ? {
                deleteList: r
            } : {
                addList: r
            }, !0)
        },
        setFirst: function(t) {
            this._firstR = t
        },
        toRange: function() {
            for (var t, e, n, i = [], r = this.that, o = r.get_p_data(), a = 0, l = o.length; l > a; a++) t = o[a], t.pq_rowselect ? null != e ? n = a : e = n = a : null != e && (i.push({
                r1: e,
                r2: n
            }), e = n = null);
            return null != e && i.push({
                r1: e,
                r2: n
            }), r.Range(i)
        },
        toggle: function(t) {
            this[this.isSelected(t) ? "remove" : "add"](t)
        },
        toggleAll: function(t) {
            this[this.isSelectedAll(t) ? "removeAll" : "selectAll"](t)
        },
        update: function(t, e) {
            var n = this,
                i = n.that,
                r = {
                    source: t.source
                },
                o = function(t) {
                    return e ? t : i.normalizeList(t)
                },
                a = o(t.addList || []),
                l = o(t.deleteList || []);
            if (a = a.filter(function(t) {
                    return n.isSelected(t) === !1
                }), l = l.filter(n.isSelected.bind(n)), a.length || l.length) {
                if (r.addList = a, r.deleteList = l, i._trigger("beforeRowSelect", null, r) === !1) return;
                r.addList.forEach(function(t) {
                    n._add(t)
                }), r.deleteList.forEach(function(t) {
                    n._add(t, !0)
                }), i._trigger("rowSelect", null, r)
            }
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery;
    t(document).on("pqGrid:bootup", function(t, e) {
        var i = e.instance;
        i.iImport = new n(i)
    }), e.pqGrid.prototype.importWb = function(t) {
        return this.iImport.importWb(t)
    };
    var n = e.cImport = function(t) {
        this.that = t
    };
    n.prototype = {
        fillRows: function(t, e, n) {
            for (var i = t.length; e > i; i++) t.push(n ? {} : [])
        },
        generateCols: function(t, e, n) {
            var i, r, o = pq.toLetter,
                a = [],
                l = 0,
                s = pq.excel.colWidth,
                d = n ? n.cells : [],
                c = [];
            for (d.forEach(function(t, e) {
                    var n = t.indx || e;
                    c[n] = t.value
                }), e = e || [], e.forEach(function(t, e) {
                    var n = t.indx || e;
                    a[n] = {
                        hidden: t.hidden,
                        width: t.width,
                        title: c[n] || ""
                    }
                }), t = Math.max(t, e.length); t > l; l++) i = a[l] || {}, r = {
                title: i.title || o(l),
                width: i.width || s,
                halign: "center"
            }, i.hidden && (r.hidden = !0), a[l] = r;
            return a
        },
        importS: function(t, n, i, r, o) {
            var a, l, s, d, c, u, h, f = t.mergeCells,
                p = this,
                g = [],
                v = this.that,
                m = 0,
                w = t.rows,
                x = t.frozenRows || 0,
                y = w.length,
                C = 0,
                b = v.options.colModel,
                I = 0,
                _ = b && b.length,
                q = e.cFormulas.shiftRC();
            for (null != o && (I = o + 1, u = w[o], w = w.slice(I), x -= I, x = x > 0 ? x : 0), C = 0, y = w.length; y > C; C++) a = w[C], l = a.indx || C, s = {}, l != C && this.fillRows(g, l, !0), a.cells.forEach(function(t, e) {
                d = t.indx || e, c = r && _ && b[d] ? b[d].dataIndx : d, s[c] = t.value, p.copyStyle(s, c, t), t.format && p.copyFormat(s, c, t.format), h = t.formula, h && p.copyFormula(s, c, I ? q(h, 0, -I) : h), d >= m && (m = d + 1)
            }), a.hidden && (s.pq_hidden = !0), g[l] = s;
            t.name && v.option("title", t.name), n && this.fillRows(g, g.length + n, !0), v.option("dataModel.data", g), m += i || 0, v.refreshCM(this.generateCols(m, t.columns, u)), v.option("mergeCells", (f || []).map(function(t) {
                var e = pq.getAddress(t);
                return e.r1 -= I, e.r2 -= I, e
            }).filter(function(t) {
                return t.r1 >= 0
            })), v.option({
                freezeRows: x,
                freezeCols: t.frozenCols
            }), v.refreshDataAndView(), v._trigger("importWb")
        },
        copyFormula: function(t, e, n) {
            var i = t.pq_fn = t.pq_fn || {};
            i[e] = n
        },
        copyFormat: function(t, e, n) {
            var i = t.pq_format = t.pq_format || {};
            n = pq.isDateFormat(n) ? pq.excelToJui(n) : pq.excelToNum(n), i[e] = n
        },
        copyStyle: function(t, e, n) {
            var i, r, o = [];
            (i = n.font) && o.push("font-family:" + i), (i = n.fontSize) && o.push("font-size:" + i + "px"), (i = n.color) && o.push("color:" + i), (i = n.bgColor) && o.push("background:" + i), n.bold && o.push("font-weight:bold"), n.italic && o.push("font-style:italic"), n.underline && o.push("text-decoration:underline"), (i = n.align) && o.push("text-align:" + i), (i = n.valign) && o.push("vertical-align:" + i), n.wrap && o.push("white-space:normal"), (o = o.join(";")) && (r = t.pq_cellattr = t.pq_cellattr || {}, r[e] = {
                style: o
            })
        },
        importWb: function(t) {
            var e = t.workbook,
                n = t.sheet || 0,
                i = e.sheets.filter(function(t, e) {
                    return n == e || n == t.name
                })[0];
            i && this.importS(i, t.extraRows, t.extraCols, t.keepCM, t.headerRowIndx)
        }
    }
}(jQuery),
function(t) {
    pq.excelImport = {
        attr: function() {
            var t = new RegExp('([a-z]+)\\s*=\\s*"([^"]*)"', "gi");
            return function(e) {
                e = e || "", e = e.slice(0, e.indexOf(">"));
                var n = {};
                return e.replace(t, function(t, e, i) {
                    n[e] = i
                }), n
            }
        }(),
        cacheStyles: function() {
            var e, n, i, r = this,
                o = t(t.parseXML(r.getStyleText())),
                a = t.extend(!0, {}, r.preDefFormats),
                l = [],
                s = [""],
                d = ["", ""];
            o.find("numFmts>numFmt").each(function(e, n) {
                var i = t(n),
                    r = i.attr("formatCode");
                a[i.attr("numFmtId")] = r
            }), o.find("fills>fill>patternFill>fgColor[rgb]").each(function(e, n) {
                var i = r.getColor(t(n).attr("rgb"));
                d.push(i)
            }), o.find("fonts>font").each(function(i, o) {
                var a = t(o),
                    l = 1 * a.find("sz").attr("val"),
                    d = a.find("name").attr("val"),
                    c = a.find("color").attr("rgb"),
                    u = {};
                return 0 === i ? (e = l, void(n = d.toUpperCase())) : (a.find("b").length && (u.bold = !0), c && (u.color = r.getColor(c)), d && d.toUpperCase() != n && (u.font = d), l && l != e && (u.fontSize = l), a.find("u").length && (u.underline = !0), a.find("i").length && (u.italic = !0), void s.push(u))
            }), o.find("cellXfs>xf").each(function(e, n) {
                var r, o, c, u, h = t(n),
                    f = 1 * h.attr("numFmtId"),
                    p = 1 * h.attr("fillId"),
                    g = h.children("alignment"),
                    v = 1 * h.attr("fontId"),
                    m = v ? s[v] : {},
                    w = {};
                g.length && (r = g.attr("horizontal"), r && (w.align = r), o = g.attr("vertical"), o && (w.valign = o), c = g.attr("wrapText"), "1" == c && (w.wrap = !0)), f && (i = a[f], /(?=.*m.*)(?=.*d.*)(?=.*y.*)/i.test(i) && (i = i.replace(/(\[.*\]|[^mdy\/\-\s])/gi, "")), w.format = i), p && d[p] && (w.bgColor = d[p]);
                for (u in m) w[u] = m[u];
                l.push(w)
            }), r.getStyle = function(t) {
                return l[t]
            }, o = 0
        },
        getMergeCells: function(t) {
            var e = this,
                n = t.match(/<mergeCell\s+.*?(\/>|<\/mergeCell>)/g) || [];
            return n.map(function(t) {
                return e.attr(t).ref
            })
        },
        getFrozen: function(t) {
            var e = this.match(t, /<pane.*?(\/>|<\/pane>)/, 0),
                n = this.attr(e),
                i = 1 * n.xSplit,
                r = 1 * n.ySplit;
            return {
                r: r || 0,
                c: i || 0
            }
        },
        getFormula: function(e) {
            var n = {},
                i = t.paramquery.cFormulas.shiftRC();
            return function(t, r, o) {
                if ("<f" === t.substr(0, 2)) {
                    var a, l = e.match(t, /^<f.*?>(.*?)<\/f>/, 1),
                        s = e.attr(t);
                    return "shared" == s.t && (l ? n[s.si] = {
                        r: r,
                        c: o,
                        f: l
                    } : (a = n[s.si], l = i(a.f, o - a.c, r - a.r))), l
                }
            }
        },
        getCols: function(t) {
            for (var e = this, n = (t.match(/<dimension\s.*?\/>/) || [])[0], i = e.attr(n || "").ref, r = [], o = t.match(/<col\s.*?\/>/g) || [], a = i ? pq.getAddress(i).c2 + 1 : o.length, l = pq.excel.colRatio, s = 0; a > s; s++)
                for (var d, c = o[s], u = e.attr(c), h = 1 * u.min, f = 1 * u.max, p = 1 * u.hidden, g = 1 * u.width, v = h; f >= v; v++) d = {}, p ? d.hidden = !0 : d.width = 1 * (g * l).toFixed(2), v !== r.length + 1 && (d.indx = v - 1), r.push(d);
            return r
        },
        getColor: function(t) {
            return "#" + t.slice(2)
        },
        getPath: function(t) {
            return this.paths[t]
        },
        getPathSheets: function() {
            return this.pathSheets
        },
        getFileTextFromKey: function(t) {
            return this.getFileText(this.getPath(t))
        },
        getFileText: function(t) {
            return this.files[t.replace(/^\//, "")].asText()
        },
        getSheetText: function(t) {
            t = t || 0;
            var e = this.pathSheets.filter(function(e, n) {
                return e.name === t || n === t
            })[0].path;
            return this.getFileText(e)
        },
        getStyleText: function() {
            return this.getFileTextFromKey("st")
        },
        getSI: function(t) {
            var e, n = [],
                i = pq.unescapeXml,
                r = 1 * this.attr(this.match(t, /<sst.*?>[\s\S]*?<\/sst>/, 0)).uniqueCount;
            if (t.replace(/<si>([\s\S]*?)<\/si>/g, function(t, r) {
                    e = [], r.replace(/<t.*?>([\s\S]*?)<\/t>/g, function(t, n) {
                        e.push(n)
                    }), n.push(i(e.join("")))
                }), r && r !== n.length) throw "si misatch";
            return n
        },
        getWorkBook: function(t, e, n) {
            var i = this,
                r = {};
            e ? r[e] = !0 : "string" == typeof t && (r.base64 = !0), i.files = new JSZip(t, r).files, this.readPaths(), this.cacheStyles();
            var o = this.getPath("ss"),
                a = [],
                l = o ? this.getSI(this.getFileText(o)) : [];
            return i.getPathSheets().forEach(function(t, e) {
                if (!n || n.indexOf(e) > -1 || n.indexOf(t.name) > -1) {
                    var r = i.getFileText(t.path),
                        o = i.match(r, /<sheetData.*?>(.*?)<\/sheetData>/, 1),
                        s = i.getWorkSheet(r, o, l, t.name);
                    a.push(s)
                }
            }), delete i.files, {
                sheets: a
            }
        },
        getWorkSheet: function(t, e, n, i) {
            for (var r, o, a, l, s, d, c, u, h, f, p, g, v, m, w, x, y, C = this, b = [], I = 0, _ = pq.toNumber, q = this.getFormula(C), D = pq.isEmpty, R = pq.formulas, M = pq.isDateFormat, T = C.getMergeCells(t), k = e.match(/<row.*?<\/row>/g) || [], E = 0, S = k.length; S > E; E++) {
                d = {
                    cells: []
                }, w = k[E], v = C.attr(w), y = v.r, x = y ? y - 1 : E, x !== E && (d.indx = x), v.hidden && (d.hidden = !0), c = w.match(/(<c[^<]*?\/>|<c.*?<\/c>)/g) || [];
                for (var P = 0, $ = c.length; $ > P; P++) {
                    if (o = c[P], m = C.attr(o), u = m.t, g = C.match(o, /<c.*?>(.*?)(<\/c>)?$/, 1), s = {}, "inlineStr" == u ? f = g.match(/<t><!\[CDATA\[(.*?)\]\]><\/t>/)[1] : (f = C.match(g, /<v>(.*?)<\/v>/, 1) || void 0, null != f && (f = "s" == u ? n[f] : "str" == u ? pq.unescapeXml(f) : "b" == u ? "1" == f : R.VALUE(f))), p = m.r, p ? (p = p.replace(/\d+/, ""), p = _(p)) : p = P, I = I > p ? I : p, void 0 !== f && (s.value = f), p !== P && (s.indx = p), a = q(g, x, p), a && (s.formula = pq.unescapeXml(a)), h = m.s, h && (h = this.getStyle(h))) {
                        for (r in h) s[r] = h[r];
                        l = s.format, null != f && !a && l && M(l) && (s.value = R.TEXT(f, "m/d/yyyy"))
                    }!D(s) && d.cells.push(s)
                }
                b.push(d)
            }
            var A = {
                    rows: b,
                    name: i
                },
                H = C.getCols(t),
                F = C.getFrozen(t);
            return T.length && (A.mergeCells = T), H.length && (A.columns = H), F.r && (A.frozenRows = F.r), F.c && (A.frozenCols = F.c), A
        },
        Import: function(t, e) {
            var n, i, r, o = this,
                a = t.file,
                l = t.content,
                s = t.url,
                d = function(n, i) {
                    e(o.getWorkBook(n, t.type || i, t.sheets))
                };
            s ? (i = "?" + Math.random(), window.Uint8Array ? (r = new XMLHttpRequest, r.open("GET", s + i, !0), r.responseType = "arraybuffer", r.onload = function(t) {
                200 == this.status && d(r.response)
            }, r.send()) : JSZipUtils.getBinaryContent(s + i, function(t, e) {
                d(e, "binary")
            })) : a ? (n = new FileReader, n.onload = function(t) {
                d(t.target.result)
            }, n.readAsArrayBuffer(a)) : l && d(l)
        },
        match: function(t, e, n) {
            var i = t.match(e);
            return i ? i[n] : ""
        },
        preDefFormats: {
            1: "0",
            2: "0.00",
            3: "#,##0",
            4: "#,##0.00",
            5: "$#,##0_);($#,##0)",
            6: "$#,##0_);[Red]($#,##0)",
            7: "$#,##0.00_);($#,##0.00)",
            8: "$#,##0.00_);[Red]($#,##0.00)",
            9: "0%",
            10: "0.00%",
            11: "0.00E+00",
            12: "# ?/?",
            13: "# ??/??",
            14: "m/d/yyyy",
            15: "d-mmm-yy",
            16: "d-mmm",
            17: "mmm-yy",
            18: "h:mm AM/PM",
            19: "h:mm:ss AM/PM",
            20: "h:mm",
            21: "h:mm:ss",
            22: "m/d/yyyy h:mm",
            37: "#,##0_);(#,##0)",
            38: "#,##0_);[Red](#,##0)",
            39: "#,##0.00_);(#,##0.00)",
            40: "#,##0.00_);[Red](#,##0.00)",
            45: "mm:ss",
            46: "[h]:mm:ss",
            47: "mm:ss.0",
            48: "##0.0E+0",
            49: "@"
        },
        readPaths: function() {
            var e = this.files,
                n = t(t.parseXML(e["[Content_Types].xml"].asText())),
                i = this.paths = {
                    wb: "sheet.main",
                    ws: "worksheet",
                    st: "styles",
                    ss: "sharedStrings"
                };
            for (var r in i) i[r] = n.find('[ContentType$="' + i[r] + '+xml"]').attr("PartName");
            for (r in e)
                if (/workbook.xml.rels$/.test(r)) {
                    i.wbrels = r;
                    break
                }
            var o = t(this.getFileTextFromKey("wbrels")),
                a = t(this.getFileTextFromKey("wb")),
                l = this.pathSheets = [];
            a.find("sheet").each(function(e, i) {
                var r = t(i),
                    a = r.attr("r:id"),
                    s = r.attr("name"),
                    d = o.find('[Id="' + a + '"]').attr("Target"),
                    c = n.find('Override[PartName$="' + d + '"]').attr("PartName");
                l.push({
                    name: s,
                    rId: a,
                    path: c
                })
            })
        }
    }
}(jQuery),
function(t) {
    var e = t.paramquery,
        n = e._pqGrid.prototype;
    n.exportExcel = function(t) {
        return t = t || {}, t.format = "xlsx", this.exportData(t)
    }, n.exportCsv = function(t) {
        return t = t || {}, t.format = "csv", this.exportData(t)
    }, n.exportData = function(t) {
        var e = new i(this, t);
        return e.Export(t)
    };
    var i = e.cExport = function(t, e) {
        this.that = t
    };
    i.prototype = t.extend({
        copyStyle: function(t, e) {
            var n, i, r, o, a, l, s;
            "string" == typeof e && (s = e.split(";"), e = {}, s.forEach(function(t) {
                t && (s = t.split(":"), s[0] && s[1] && (e[s[0].trim()] = s[1].trim()))
            })), (n = e.background) && (t.bgColor = n), (i = e["font-size"]) && (t.fontSize = parseFloat(i)), (o = e.color) && (t.color = o), "normal" == e["white-space"] && (t.wrap = !0), (a = e["text-align"]) && (t.align = a), (l = e["vertical-align"]) && (t.valign = l), "bold" == e["font-weight"] && (t.bold = !0), (r = e["font-family"]) && (t.font = r), "italic" == e["font-style"] && (t.italic = !0), "underline" == e["text-decoration"] && (t.underline = !0)
        },
        getCsvHeader: function(t, e, n, i) {
            for (var r, o, a, l = this, s = [], d = [], c = 0; e > c; c++) {
                for (var u = t[c], h = null, f = 0, p = u.length; p > f; f++) r = n[f], r.hidden || r.copy === !1 || (o = u[f], c > 0 && o == t[c - 1][f] ? s.push("") : h && f > 0 && o == h ? s.push("") : (a = l.getTitle(o, f), a = a ? a.replace(/\"/g, '""') : "", h = o, s.push('"' + a + '"')));
                d.push(s.join(i)), s = []
            }
            return d
        },
        getCSVContent: function(t, e, n, i, r, o, a, l, s, d, c, u, h) {
            var f, p, g, v, m, w, x, y, C, b, I, _ = this,
                q = t.separator || ",",
                D = [];
            for (I = h ? _.getCsvHeader(i, r, e, q) : [], v = 0; a > v; v++)
                if (x = o[v], !x.pq_hidden) {
                    y = l ? v + s : v, C = y - s, w = {
                        rowIndx: y,
                        rowIndxPage: C,
                        rowData: x,
                        Export: !0
                    };
                    for (var m = 0; n > m; m++)
                        if (b = e[m], !b.hidden && b.copy !== !1) {
                            p = null, f = null, d.ismergedCell(y, m) ? (f = d.isRootCell(y, m)) ? (p = d.getRootCellO(y, m), p.Export = !0, g = _.getRenderVal(p, c, u)[0]) : g = "" : (w.colIndx = m, w.column = b, w.dataIndx = b.dataIndx, g = _.getRenderVal(w, c, u)[0]);
                            var R = (null == g ? "" : g) + "";
                            R = R.replace(/\"/g, '""'), D.push('"' + R + '"')
                        }
                    I.push(D.join(q)), D = []
                }
            return "\ufeff" + I.join("\n")
        },
        getExportCM: function(t, e) {
            return e > 1 ? t : t.filter(function(t) {
                return 0 != t.copy
            })
        },
        Export: function(t) {
            if (this.that._trigger("beforeExport", null, t) === !1) return !1;
            var e, n = this,
                i = n.that,
                r = i.options,
                o = r.groupModel,
                a = "remote" == r.pageModel.type,
                l = i.riOffset,
                s = i.iRenderB,
                d = i.iMerge,
                c = i.headerCells,
                u = c.length,
                h = i.colModel,
                f = h.length,
                p = n.getExportCM(h, u),
                g = p.length,
                v = r.treeModel,
                m = o.on && o.dataIndx.length || a || v.dataIndx && v.summary,
                w = m ? i.pdata : r.dataModel.data,
                w = r.summaryData ? w.concat(r.summaryData) : w,
                x = w.length,
                y = t.render,
                C = !t.noheader,
                b = t.format;
            if ("xlsx" == b) {
                var I = n.getWorkbook(p, g, c, u, w, x, a, l, d, y, s, C, t.sheetName);
                if (i._trigger("workbookReady", null, {
                        workbook: I
                    }) === !1) return I;
                if (t.workbook) return I;
                t.workbook = I, e = pq.excel.exportWb(t)
            } else "json" == b ? t.data = n.getJsonContent(t, w) : "csv" == b ? t.data = n.getCSVContent(t, h, f, c, u, w, x, a, l, d, y, s, C) : t.data = n.getHtmlContent(t, h, f, c, u, w, x, a, l, d, y, s, C);
            return e = e || n.postRequest(t), i._trigger("exportData", null, t), e
        },
        getHtmlHeader: function(t, e) {
            for (var n, i, r, o, a, l = this, s = [], d = 0; e > d; d++) {
                var c = t[d],
                    u = null;
                s.push("<tr>");
                for (var h = 0, f = c.length; f > h; h++) n = c[h], i = n.colSpan, !n.hidden && i && n.copy !== !1 && (r = n.rowSpan, d > 0 && n == t[d - 1][h] || u && h > 0 && n == u || (o = l.getTitle(n, h), u = n, a = n.halign || n.align, a = a ? "align=" + a : "", s.push("<th colspan=", i, " rowspan=", r, " ", a, ">", o, "</th>")));
                s.push("</tr>")
            }
            return s.join("")
        },
        getHtmlBody: function(t, e, n, i, r, o, a, l, s) {
            var d, c, u, h, f, p, g, v, m, w, x, y, C, b, I = this,
                _ = [];
            for (d = 0; i > d; d++)
                if (m = n[d], !m.pq_hidden) {
                    for (w = r ? d + o : d, x = w - o, v = {
                            rowIndx: w,
                            rowIndxPage: x,
                            rowData: m,
                            Export: !0
                        }, _.push("<tr>"), c = 0; e > c; c++)
                        if (u = t[c], !u.hidden && u.copy !== !1) {
                            if (h = null, f = null, C = "", a.ismergedCell(w, c)) {
                                if (!(f = a.isRootCell(w, c))) continue;
                                h = a.getRootCellO(w, c), h.Export = !0, p = I.getRenderVal(h, l, s), y = p[0], g = p[1], C = "rowspan=" + f.rowspan + " colspan=" + f.colspan + " "
                            } else v.colIndx = c, v.column = u, v.dataIndx = u.dataIndx, p = I.getRenderVal(v, l, s), y = p[0], g = p[1];
                            b = u.align, C += b ? "align=" + b : "", y = null == y ? "" : y, y = pq.newLine(y), _.push("<td ", C, g ? ' style="' + g + '"' : "", ">", y, "</td>")
                        }
                    _.push("</tr>")
                }
            return _.join("")
        },
        getHtmlContent: function(t, e, n, i, r, o, a, l, s, d, c, u, h) {
            var f = this,
                p = f.that,
                g = t.cssRules || "",
                v = p.element.find(".pq-grid-table"),
                m = v.css("font-family"),
                w = v.css("font-size"),
                x = "table{empty-cells:show;font-family:" + m + ";font-size:" + w + ";border-collapse:collapse;}",
                y = [];
            return y.push("<!DOCTYPE html><html><head>", '<meta charset="utf-8" />', "<title>", t.title ? t.title : "ParamQuery Pro", "</title>", "</head><body>", "<style>", x, "td,th{padding: 5px;border:1px solid #ccc;}", g, "</style>", "<table>"), y.push(h ? f.getHtmlHeader(i, r, e) : ""), y.push(f.getHtmlBody(e, n, o, a, l, s, d, c, u)), y.push("</table></body></html>"), y.join("")
        },
        getJsonContent: function(t, e) {
            function n(t, e) {
                return 0 !== (t + "").indexOf("pq_") ? e : void 0
            }
            return t.nostringify ? e : JSON.stringify(e, t.nopqdata ? n : null, t.nopretty ? null : 2)
        },
        getTitle: function(t, e) {
            var n = t.title;
            return n ? "function" == typeof n && (n = n.call(this.that, {
                colIndx: e,
                column: t,
                dataIndx: t.dataIndx,
                Export: !0
            })) : n = "", n
        },
        getXlsMergeCells: function(t, e, n, i) {
            t = t.concat(n.getMergeCells(e, this.curPage, i));
            for (var r = [], o = pq.toLetter, a = t.length, l = 0; a > l; l++) {
                var s = t[l];
                s = o(s.c1) + (s.r1 + 1) + ":" + o(s.c2) + (s.r2 + 1), r.push(s)
            }
            return r
        },
        getXlsCols: function(t, e) {
            for (var n, i, r, o = [], a = 0, l = pq.excel.colWidth; e > a; a++) i = t[a], r = 1 * (i._width || l).toFixed(2), n = {}, r !== l && (n.width = r), i.hidden && (n.hidden = !0), pq.isEmpty(n) || (o.length !== a && (n.indx = a), o.push(n));
            return o
        },
        getXlsHeader: function(t, e, n) {
            for (var i = this, r = [], o = 0; e > o; o++) {
                for (var a = t[o], l = [], s = 0, d = a.length; d > s; s++) {
                    var c = a[s];
                    if (c.copy !== !1) {
                        var u = c.o_colspan,
                            h = c.rowSpan,
                            f = i.getTitle(c, s);
                        o > 0 && c == t[o - 1][s] ? f = "" : s > 0 && c == t[o][s - 1] ? f = "" : (u > 1 || h > 1) && n.push({
                            r1: o,
                            c1: s,
                            r2: o + h - 1,
                            c2: s + u - 1
                        }), l.push({
                            value: f,
                            bgColor: "#eeeeee"
                        })
                    }
                }
                r.push({
                    cells: l
                })
            }
            return r
        },
        getXlsBody: function(n, i, r, o, a, l, s, d, c, u) {
            var h, f, p, g, v, m, w, x, y, C, b, I, _, q, D, R, M, T, k, E = this,
                S = E.that,
                P = [],
                $ = e.cFormulas.shiftRC(S);
            for (f = 0; o > f; f++) {
                for (I = r[f], b = [], _ = a ? f + l : f, q = _ - l, x = {
                        rowIndx: _,
                        rowIndxPage: q,
                        rowData: I,
                        Export: !0
                    }, p = 0; i > p; p++) w = n[p], D = w.dataIndx, T = I.pq_cellattr, m = I[D], g = m, v = S.getFormula(I, D), h = !1, s.ismergedCell(_, p) && (s.isRootCell(_, p, "o") || (h = !0)), h || v || (x.colIndx = p, x.column = w, x.dataIndx = D, y = E.getRenderVal(x, d, c), g = y[0], C = y[1]), k = E.getCellFormat(I, D) || w.format, M = {}, "string" == typeof k && (pq.isDateFormat(k) ? (g !== m && t.datepicker.formatDate(k, new Date(m)) === g && (g = m), k = pq.juiToExcel(k)) : (g !== m && pq.formatNumber(m, k) === g && (g = m), k = pq.numToExcel(k)), M.format = k), void 0 !== g && (M.value = g), T && (T = T[D]) && (T = T.style) && E.copyStyle(M, T), C && E.copyStyle(M, C), v && (u && (v = $(v, 0, u)), M.formula = v), pq.isEmpty(M) || (M.dataIndx = D, b.length !== p && (M.indx = p), b.push(M));
                R = {}, b.length && (R.cells = b), I.pq_hidden && (R.hidden = !0), pq.isEmpty(R) || (P.length !== f && (R.indx = f), P.push(R))
            }
            return P
        },
        getCellFormat: function(t, e) {
            var n = t.pq_format;
            return n && n[e]
        },
        getWorkbook: function(t, e, n, i, r, o, a, l, s, d, c, u, h) {
            var f, p = this,
                g = p.getXlsCols(t, e),
                v = [],
                m = p.that.options,
                w = m.freezeCols,
                x = u ? i : 0,
                y = x + (m.freezeRows || 0),
                C = u ? p.getXlsHeader(n, i, v) : [],
                b = p.getXlsMergeCells(v, u ? i : 0, s, o),
                I = p.getXlsBody(t, e, r, o, a, l, s, d, c, x),
                _ = {
                    columns: g,
                    rows: C.concat(I)
                };
            return b.length && (_.mergeCells = b), (f = C.length) && (_.headerRows = f), y && (_.frozenRows = y), w && (_.frozenCols = w), (h || (h = m.title)) && (_.name = h), {
                sheets: [_]
            }
        },
        postRequest: function(e) {
            var n, i, r = e.format,
                o = e.url,
                a = e.filename || "pqGrid";
            if (e.zip && "xlsx" != r) {
                var l = new JSZip;
                l.file(a + "." + e.format, e.data), n = l.generate({
                    type: "base64",
                    compression: "DEFLATE"
                }), i = !0, r = "zip"
            } else i = !!e.decodeBase, n = e.data;
            return o && t.ajax({
                url: o,
                type: "POST",
                cache: !1,
                data: {
                    pq_ext: r,
                    pq_data: n,
                    pq_decode: i,
                    pq_filename: a
                },
                success: function(e) {
                    o += (o.indexOf("?") > 0 ? "&" : "?") + "pq_filename=" + e, t(document.body).append("<iframe height='0' width='0' frameborder='0' src=\"" + o + '"></iframe>')
                }
            }), n
        }
    }, pq.mixin.render)
}(jQuery);
var pqEx = pq.excel = {
    _tmpl: {
        rels: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="workbook.xml"/></Relationships>'
    },
    eachRow: function(t, e) {
        for (var n = t.rows, i = 0, r = n.length; r > i; i++) e(n[i], i)
    },
    exportWb: function(t) {
        var e = t.workbook,
            n = this._tmpl,
            i = this,
            r = [],
            o = e.sheets,
            a = o.length,
            l = new JSZip;
        l.file("[Content_Types].xml", this.getContentTypes(a)), o.forEach(function(t, e) {
            var n = i.getCols(t.columns),
                o = i.getFrozen(t.frozenRows, t.frozenCols),
                a = i.getBody(t.rows),
                s = i.getMergeCells(t.mergeCells);
            r.push(t.name), l.file("worksheet" + (e + 1) + ".xml", i.getSheet(o, n, a, s))
        }), l.file("workbook.xml", this.getWBook(r)), l.file("styles.xml", i.getStyle());
        var s = l.folder("_rels");
        return s.file(".rels", n.rels), s.file("workbook.xml.rels", this.getWBookRels(a)), t.url ? (t.data = l.generate({
            type: "base64",
            compression: "DEFLATE"
        }), t.decodeBase = !0, pq.postRequest(t)) : l.generate({
            type: t.type || "blob",
            compression: "DEFLATE"
        })
    },
    eachCell: function(t, e, n) {
        t.forEach(function(t, i) {
            var r, o;
            if (r = t.cells) {
                i = t.indx || i;
                for (var a = 0, l = r.length; l > a; a++) o = r[a], e(o, o.indx || a, i, n)
            } else(r = t.rows) && this.eachCell(r, e, i)
        }, this)
    },
    findIndex: function(t, e) {
        var n = t.findIndex(e),
            i = t[n];
        return i.indx || n
    },
    getArray: function(t) {
        var e = [],
            n = this;
        return this.eachRow(t, function(t) {
            var i = [];
            t.cells.forEach(function(t) {
                i.push(n.getCell(t))
            }), e.push(i)
        }), e
    },
    getBody: function(t) {
        var e, n, i, r, o, a, l, s, d, c, u, h, f, p, g, v, m, w, x, y, C, b, I, _, q, D, R = this,
            M = pq.formulas,
            T = [],
            k = t.length;
        for (e = 0; k > e; e++) {
            for (f = t[e], u = f.cells, _ = u.length, q = f.hidden ? 'hidden="1"' : "", i = (f.indx || e) + 1, o = 'r="' + i + '"', T.push("<row " + q + " " + o + ">"), n = 0; _ > n; n++) c = u[n], h = c.value, r = c.indx || n, a = "", l = "", o = r === n ? "" : 'r="' + pq.toLetter(r) + i + '"', D = c.format, p = c.bgColor, g = c.color, v = c.font, m = c.fontSize, C = c.bold, b = c.italic, I = c.underline, w = c.align, x = c.wrap, y = c.valign, d = c.formula, d = d ? "<f>" + pq.escapeXml(d) + "</f>" : "", null == h ? s = "<v></v>" : h == parseFloat(h) && (h + "").match(/^[0-9,-,\.]*$/g) ? s = "<v>" + h + "</v>" : D && M.isDate(h) ? s = "<v>" + M.VALUE(h) + "</v>" : "boolean" == typeof h ? (s = "<v>" + (h ? "1" : "0") + "</v>", a = 't="b"') : (a = 't="inlineStr"', s = "<is><t><![CDATA[" + h + "]]></t></is>"), (D || p || g || m || w || y || x || C || b || I) && (l = 's="' + R.getStyleIndx(D, p, g, v, m, w, y, x, C, b, I) + '"'), T.push("<c " + a + " " + o + " " + l + ">" + d + s + "</c>");
            T.push("</row>")
        }
        return T.join("")
    },
    getCell: function(t) {
        var e = t.format,
            n = t.value;
        return e ? pq.formulas.TEXT(n, e) : n
    },
    getCSV: function(t) {
        var e = [],
            n = this;
        return this.eachRow(t, function(t) {
            var i = [];
            t.cells.forEach(function(t) {
                i.push(n.getCell(t))
            }), e.push(i.join(","))
        }), e.join("\r\n")
    },
    getColor: function() {
        var t = {},
            e = function(t) {
                return 1 === t.length ? "0" + t : t
            };
        return function(n) {
            var i, r, o = t[n];
            if (o || (/^#[0-9,a,b,c,d,e,f]{6}$/i.test(n) ? r = n.replace("#", "") : (i = n.match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i)) && (r = e((1 * i[1]).toString(16)) + e((1 * i[2]).toString(16)) + e((1 * i[3]).toString(16))), r && 6 === r.length && (o = t[n] = "ff" + r)), o) return o;
            throw "invalid color: " + n
        }
    }(),
    _getCol: function(t, e, n, i, r) {
        if (r) {
            if (r == this.colWidth && !i) return;
            r = 1 * (r / this.colRatio).toFixed(2), r = ' customWidth="1" width="' + r + '"'
        }
        t.push('<col min="', e, '" max="', n, '" hidden="', i, '"', r, "/>")
    },
    getCols: function(t) {
        if (!t || !t.length) return "";
        var e, n, i, r, o, a = [],
            l = 0,
            s = 0,
            d = 0,
            c = t.length;
        for (a.push("<cols>"); c > d; d++) {
            var u = t[d],
                h = u.hidden ? 1 : 0,
                f = u.width,
                p = u.indx;
            l = (p || l) + 1, i === f && r === h && l == s + 1 ? n = l : (o && (this._getCol(a, e, n, r, i), e = null), n = l, null == e && (e = l)), i = f, r = h, s = l, o = !0
        }
        return this._getCol(a, e, n, r, i), a.push("</cols>"), a.join("")
    },
    getContentTypes: function(t) {
        for (var e = [], n = 1; t >= n; n++) e.push('<Override PartName="/worksheet' + n + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>');
        return ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">', '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>', '<Override PartName="/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>', e.join(""), '<Override PartName="/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>', "</Types>"].join("")
    },
    getFillIndx: function(t) {
        var e = this,
            n = e.fills = e.fills || {
                length: 2
            };
        return e.getIndx(n, t)
    },
    getFontIndx: function(t, e, n, i, r, o) {
        var a = this,
            l = a.fonts = a.fonts || {
                length: 1
            };
        return a.getIndx(l, (t || "") + "_" + (e || "") + "_" + (n || "") + "_" + (i || "") + "_" + (r || "") + "_" + (o || ""))
    },
    getFormatIndx: function(t) {
        var e = this,
            n = e.formats = e.formats || {
                length: 164
            };
        return e.numFmtIds[t] || e.getIndx(n, t)
    },
    getFrozen: function(t, e) {
        t = t || 0, e = e || 0;
        var n = pq.toLetter(e) + (t + 1);
        return ['<sheetViews><sheetView workbookViewId="0">', '<pane xSplit="', e, '" ySplit="', t, '" topLeftCell="', n, '" activePane="bottomLeft" state="frozen"/>', "</sheetView></sheetViews>"].join("")
    },
    getIndx: function(t, e) {
        var n = t[e];
        return null == n && (n = t[e] = t.length, t.length++), n
    },
    getItem: function(t, e) {
        var n, i, r = t[e],
            o = 0,
            a = 0,
            l = r ? r.indx : -1;
        if (null == l || e == l) return r;
        if (n = -1 == l ? t.length - 1 : e, n >= 0)
            for (;;) {
                if (a++, a > 20) throw "not found";
                if (i = Math.floor((n + o) / 2), r = t[i], l = r.indx, l == e) return r;
                if (l > e ? n = i : o = i == o ? i + 1 : i, o == n && i == o) break
            }
    },
    getMergeCells: function(t) {
        t = t || [];
        var e = [],
            n = 0,
            i = t.length;
        for (e.push('<mergeCells count="' + i + '">'); i > n; n++) e.push('<mergeCell ref="', t[n], '"/>');
        return e.push("</mergeCells>"), i ? e.join("") : ""
    },
    getWBook: function(t) {
        return ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">', "<bookViews><workbookView /></bookViews><sheets>", t.map(function(t, e) {
            return e++, ['<sheet name="', t ? pq.escapeXml(t) : "sheet" + e, '" sheetId="', e, '" r:id="rId', e, '"/>'].join("")
        }).join(""), "</sheets></workbook>"].join("")
    },
    getWBookRels: function(t) {
        for (var e = [], n = 1; t >= n; n++) e.push('<Relationship Id="rId' + n + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="/worksheet' + n + '.xml"/>');
        return ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">', e.join(""), '<Relationship Id="rId', n, '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="/styles.xml"/>', "</Relationships>"].join("")
    },
    getSheet: function(t, e, n, i) {
        return ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">', t, e, "<sheetData>", n, "</sheetData>", i, "</worksheet>"].join("")
    },
    getStyleIndx: function(t, e, n, i, r, o, a, l, s, d, c) {
        var u = this,
            h = t ? u.getFormatIndx(t) : "",
            f = e ? u.getFillIndx(e) : "",
            p = n || i || r || s || d || c ? u.getFontIndx(n, i, r, s, d, c) : "",
            g = h + "_" + f + "_" + p + "_" + (o || "") + "_" + (a || "") + "_" + (l || ""),
            v = u.styles = u.styles || {
                length: 1
            };
        return u.getIndx(v, g)
    },
    getStyle: function() {
        var t, e, n, i, r, o, a, l, s, d, c, u, h, f, p, g, v, m, w = this.formats,
            x = this.fills,
            y = this.fonts,
            C = this.styles,
            b = [],
            I = [],
            _ = [],
            q = ['<xf numFmtId="0" applyNumberFormat="1"/>'];
        if (w) {
            delete w.length;
            for (m in w) b.push('<numFmt numFmtId="' + w[m] + '" formatCode="' + m + '"/>');
            delete this.formats
        }
        if (x) {
            delete x.length;
            for (m in x) I.push('<fill><patternFill patternType="solid"><fgColor rgb="' + this.getColor(m) + '"/></patternFill></fill>');
            delete this.fills
        }
        if (y) {
            delete y.length;
            for (m in y) a = m.split("_"), t = "<color " + (a[0] ? 'rgb="' + this.getColor(a[0]) + '"' : 'theme="1"') + " />", n = '<name val="' + (a[1] || "Calibri") + '"/>', e = '<sz val="' + (a[2] || 11) + '"/>', i = a[3] ? "<b/>" : "", r = a[4] ? "<i/>" : "", o = a[5] ? "<u/>" : "", _.push("<font>", i, r, o, e, t, n, '<family val="2"/></font>');
            delete this.fonts
        }
        if (C) {
            delete C.length;
            for (m in C) a = m.split("_"), l = a[0], s = a[1], d = a[2], c = a[3], u = a[4], h = a[5], f = s ? ' applyFill="1" fillId="' + s + '" ' : "", g = d ? ' applyFont="1" fontId="' + d + '" ' : "", p = l ? ' applyNumberFormat="1" numFmtId="' + l + '"' : "", c = c ? ' horizontal="' + c + '" ' : "", u = u ? ' vertical="' + u + '" ' : "", h = h ? ' wrapText="1" ' : "", v = c || u || h ? ' applyAlignment="1"><alignment ' + c + u + h + "/></xf>" : "/>", q.push("<xf " + p + f + g + v);
            delete this.styles
        }
        return b = b.join("\n"), q = q.join("\n"), I = I.join("\n"), _ = _.join(""), ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">', "<numFmts>", b, "</numFmts>", "<fonts>", '<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>', _, "</fonts>", '<fills><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>', I, "</fills>", '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>', '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>', "</cellStyleXfs>", "<cellXfs>", q, "</cellXfs>", '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>', '<dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16"/>', "</styleSheet>"].join("")
    },
    importXl: function() {
        var t = pq.excelImport;
        return t.Import.apply(t, arguments)
    },
    SpreadSheet: function(t) {
        var e, n = pqEx.SpreadSheet;
        if (this instanceof n == 0) return new n(t);
        for (e in t) this[e] = t[e]
    }
};
pqEx.colRatio = 8, pqEx.colWidth = 8.43 * pqEx.colRatio, pqEx.numFmtIds = function() {
        var t = pq.excelImport.preDefFormats,
            e = {};
        for (var n in t) e[t[n]] = n;
        return e
    }(), pq.postRequest = function(t) {
        var e, n, i = t.format,
            r = t.url,
            o = t.filename || "pqGrid";
        if (t.zip && "xlsx" != i) {
            var a = new JSZip;
            a.file(o + "." + t.format, t.data), e = a.generate({
                type: "base64",
                compression: "DEFLATE"
            }), n = !0, i = "zip"
        } else n = !!t.decodeBase, e = t.data;
        return r && $.ajax({
            url: r,
            type: "POST",
            cache: !1,
            data: {
                pq_ext: i,
                pq_data: e,
                pq_decode: n,
                pq_filename: o
            },
            success: function(t) {
                r += (r.indexOf("?") > 0 ? "&" : "?") + "pq_filename=" + t, $(document.body).append("<iframe height='0' width='0' frameborder='0' src=\"" + r + '"></iframe>')
            }
        }), e
    }, pqEx.SpreadSheet.prototype = {
        getCell: function(t, e) {
            var n = this.rows || [],
                i = pqEx.getItem(n, t) || {
                    cells: []
                },
                r = pqEx.getItem(i.cells, e);
            return r
        }
    },
    function($) {
        var _pq = $.paramquery;
        _pq.pqGrid.defaults.formulasModel = {
            on: !0
        }, _pq.pqGrid.prototype.getFormula = function(t, e) {
            var n = this.iFormulas.getFnW(t, e);
            return n ? n.fn : void 0
        }, $(document).on("pqGrid:bootup", function(t, e) {
            var n = e.instance,
                i = n.options.formulasModel;
            i.on && (n.iFormulas = new cFormulas(n))
        });
        var cFormulas = _pq.cFormulas = function(t) {
            var e = this;
            e.that = t, e.fn = {}, t.on("dataReadyDone", function() {
                e.onDataReadyDone()
            }).on("columnOrder", function() {
                e.onColumnOrder()
            }).on("beforeValidateDone", function(t, n) {
                e.onBeforeValidateDone(n)
            }).on("autofillSeries", function(t, n) {
                e.onAutofill(n)
            }).on("editorBegin", function(t, n) {
                e.onEditorBegin(n)
            }).on("editorEnd", function() {
                e.onEditorEnd()
            }).on("editorKeyUp editorClick", function(t, n) {
                e.onEditorKeyUp(t, n)
            }).on(!0, "change", function(t, n) {
                e.onChange(n)
            })
        };
        $.extend(cFormulas, {
            deString: function(t, e, n) {
                var i = [];
                return t = t.replace(/"(([^"]|"")+)"/g, function(t, e) {
                    return i.push(e), "#" + (i.length - 1) + "#"
                }), t = e(t), i.forEach(function(e, i) {
                    n && (e = e.replace(/""/g, '\\"')), t = t.replace("#" + i + "#", '"' + e + '"')
                }), t
            },
            selectExp: function(t, e) {
                var n, i, r, o, a = t.slice(0, e).replace(/"[^"]*"/g, "");
                return !/"[^"]+$/.test(a) && (r = t.slice(e), (n = a.match(/.*?([a-z0-9:$]+)$/i)) && ("" === r && (i = []) || (i = r.match(/^([a-z0-9:$]+)?.*/i)))) ? o = (n[1] + (null == i[1] ? "" : i[1])).replace(/\$/g, "").toUpperCase() : void 0
            },
            shiftRC: function(t) {
                var e = cFormulas,
                    n = t ? t.get_p_data().length - 1 : 0,
                    i = t ? t.colModel.length - 1 : 0;
                return function(t, r, o) {
                    return r && (t = e.shiftC(t, r, i)), o && (t = e.shiftR(t, o, n)), t
                }
            },
            shiftR: function(t, e, n) {
                return cFormulas.deString(t, function(t) {
                    return t = t.replace(/(\$?)([A-Z]+)(\$?)([\d]+)/g, function(t, i, r, o, a) {
                        if (o) return t;
                        var l = 1 * a + e - 1;
                        return l = 0 > l ? 0 : n && l > n ? n : l, i + r + (l + 1)
                    }), t.replace(/(\$?)([0-9]+):(\$?)([0-9]+)/g, function(t, i, r, o, a) {
                        var l;
                        return i || (l = 1 * r + e - 1, l = 0 > l ? 0 : n && l > n ? n : l, r = l + 1), o || (l = 1 * a + e - 1, l = 0 > l ? 0 : n && l > n ? n : l, a = l + 1), i + r + ":" + o + a
                    })
                })
            },
            shiftC: function(t, e, n) {
                return cFormulas.deString(t, function(t) {
                    return t = t.replace(/(\$?)([A-Z]+)(\$?)([\d]+)/g, function(t, i, r, o, a) {
                        if (i) return t;
                        var l = pq.toNumber(r) + e;
                        return l = 0 > l ? 0 : n && l > n ? n : l, pq.toLetter(l) + o + a
                    }), t.replace(/(\$?)([A-Z]+):(\$?)([A-Z]+)/g, function(t, i, r, o, a) {
                        var l;
                        return i || (l = pq.toNumber(r) + e, l = 0 > l ? 0 : n && l > n ? n : l, r = pq.toLetter(l)), o || (l = pq.toNumber(a) + e, l = 0 > l ? 0 : n && l > n ? n : l, a = pq.toLetter(l)), i + r + ":" + o + a
                    })
                })
            }
        }), cFormulas.prototype = {
            addRowIndx: function(t) {
                t.forEach(function(t) {
                    var e, n, i = t.newRow,
                        r = i.pq_fn;
                    if (r)
                        for (n in r) e = r[n], e.ri = e.riO = i.pq_ri
                })
            },
            cell: function(t) {
                var e = this.toCell(t),
                    n = e.r,
                    i = e.c;
                return this.valueArr(n, i)[0]
            },
            check: function(t) {
                return cFormulas.deString(t, function(t) {
                    return t = t.split(" ").join(""), t.toUpperCase().replace(/([A-Z]+)([0-9]+)\:([A-Z]+)([0-9]+)/g, function(t, e, n, i, r) {
                        return e = pq.toNumber(e), i = pq.toNumber(i), e > i && (e = [i, i = e][0]), 1 * n > 1 * r && (n = [r, r = n][0]), pq.toLetter(e) + n + ":" + pq.toLetter(i) + r
                    })
                })
            },
            computeAll: function() {
                var t, e = this,
                    n = e.that;
                return e.initObj(), e.eachFormula(function(e) {
                    e.clean = 0, t = !0
                }), t ? (e.eachFormula(function(t, i, r, o, a) {
                    i[r] = e.execIfDirty(t), a && n.isValid({
                        rowIndx: o,
                        rowData: i,
                        dataIndx: r,
                        allowInvalid: !0
                    })
                }), !0) : void 0
            },
            eachFormula: function(t) {
                var e = this,
                    n = !0,
                    i = e.that,
                    r = function(e, i, r) {
                        var o, a;
                        for (o in r) a = r[o], "string" != typeof a && t(a, e, o, i, n)
                    },
                    o = function(t) {
                        t = t || [];
                        for (var e, n, i = t.length; i--;)(e = t[i]) && (n = e.pq_fn) && r(e, i, n)
                    };
                o(i.get_p_data()), n = !1, o(i.options.summaryData)
            },
            execIfDirty: function(t) {
                if (t.clean) {
                    if (.5 == t.clean) return
                } else t.clean = .5, t.val = this.exec(t.fn, t.ri, t.ci), t.clean = 1;
                return t.val
            },
            exec: function(_fn, r, c) {
                var self = this,
                    obj = self.obj,
                    fn = cFormulas.deString(_fn, function(t) {
                        return t = t.replace(/(\$?([A-Z]+)?\$?([0-9]+)?\:\$?([A-Z]+)?\$?([0-9]+)?)/g, function(t, e) {
                            return obj[e] = obj[e] || self.range(e), "obj['" + e + "']"
                        }), t = t.replace(/(?:[^:]|^)(\$?[A-Z]+\$?[0-9]+)(?!:)/g, function(t, e) {
                            obj[e] = obj[e] || self.cell(e);
                            var n = t.charAt(0);
                            return (t === e ? "" : "$" == n ? "" : n) + e
                        }), t = t.replace(/{/g, "[").replace(/}/g, "]").replace(/(?:[^><])(=+)/g, function(t, e) {
                            return t + (1 === e.length ? "=" : "")
                        }).replace(/<>/g, "!=").replace(/&/g, "+")
                    }, !0);
                with(obj.getRange = function() {
                    return {
                        r1: r,
                        c1: c
                    }
                }, obj) {
                    try {
                        var v = eval(fn);
                        "function" == typeof v ? v = "#NAME?" : "string" == typeof v && cFormulas.deString(v, function(t) {
                            t.indexOf("function") >= 0 && (v = "#NAME?")
                        }), v !== v && (v = null)
                    } catch (ex) {
                        v = "string" == typeof ex ? ex : ex.message
                    }
                    return v
                }
            },
            initObj: function() {
                this.obj = $.extend({
                    iFormula: this
                }, pq.formulas)
            },
            onAutofill: function(t) {
                var e = t.sel,
                    n = this,
                    i = n.that,
                    r = e.r,
                    o = e.c,
                    a = t.x,
                    l = i.getRowData({
                        rowIndx: r
                    }),
                    s = i.colModel,
                    d = s.length - 1,
                    c = i.get_p_data().length - 1,
                    u = s[o].dataIndx,
                    h = n.getFnW(l, u);
                h && (t.series = function(t) {
                    return "=" + (a ? cFormulas.shiftC(h.fn, t - 1, d) : cFormulas.shiftR(h.fn, t - 1, c))
                })
            },
            onBeforeValidateDone: function(t) {
                var e = this,
                    n = this.that.colIndxs,
                    i = function(i) {
                        i.forEach(function(i) {
                            var r, o, a, l = i.newRow,
                                s = i.rowData;
                            for (o in l)
                                if (r = l[o], "string" == typeof r && "=" === r[0]) {
                                    t.allowInvalid = !0;
                                    var d = e.check(r),
                                        c = s ? e.getFnW(s, o) : null;
                                    c ? d !== c.fn && (i.oldRow[o] = "=" + c.fn, e.save(s, o, d, i.rowIndx, n[o])) : e.save(s || l, o, d, i.rowIndx, n[o])
                                } else s && (a = e.remove(s, o)) && (i.oldRow[o] = "=" + a.fn)
                        })
                    };
                i(t.addList), i(t.updateList)
            },
            onChange: function(t) {
                this.addRowIndx(t.addList), t.addList.length || t.deleteList.length || this.computeAll() && "edit" === t.source && this.that.refresh({
                    header: !1
                })
            },
            onColumnOrder: function() {
                var t, e, n = this,
                    i = n.that,
                    r = cFormulas.shiftRC(i),
                    o = i.colIndxs;
                n.eachFormula(function(n, i, a) {
                    t = o[a], n.ci != t && (e = t - n.ciO, n.ci = t, n.fn = r(n.fnOrig, e, n.ri - n.riO))
                }), null != t && n.computeAll()
            },
            onEditorBegin: function(t) {
                var e = this.getFnW(t.rowData, t.dataIndx);
                e && t.$editor.val("=" + e.fn)
            },
            onEditorEnd: function() {
                pq.intel.hide()
            },
            onEditorKeyUp: function(t, e) {
                var n = e.$editor,
                    i = n[0],
                    r = i.value,
                    o = pq.intel,
                    a = i.selectionEnd;
                r && 0 === r.indexOf("=") && (o.popup(r, a, n), this.select(r, a))
            },
            onDataReadyDone: function() {
                var t, e = this,
                    n = e.that,
                    i = cFormulas.shiftRC(n),
                    r = n.colIndxs,
                    o = function(n, o, a) {
                        var l, s, d;
                        for (s in a) l = a[s], t = !0, "string" == typeof l ? e.save(n, s, e.check(l), o, r[s]) : l.ri != o && (d = o - l.riO, l.ri = o, l.fn = i(l.fnOrig, l.ci - l.ciO, d))
                    },
                    a = function(t) {
                        t = t || [];
                        for (var e, n, i = t.length; i--;)(e = t[i]) && (n = e.pq_fn) && o(e, i, n)
                    };
                a(n.get_p_data()), a(n.options.summaryData), e.initObj(), t && e.computeAll()
            },
            getFnW: function(t, e) {
                var n;
                return (n = t.pq_fn) ? n[e] : void 0
            },
            remove: function(t, e) {
                var n, i = t.pq_fn;
                return i && (n = i[e]) ? (delete i[e], pq.isEmpty(i) && delete t.pq_fn, n) : void 0
            },
            range: function(t) {
                var e = t.split(":"),
                    n = this.that,
                    i = this.toCell(e[0]),
                    r = i.r,
                    o = i.c,
                    a = this.toCell(e[1]),
                    l = a.r,
                    s = a.c;
                return this.valueArr(null == r ? 0 : r, null == o ? 0 : o, null == l ? n.get_p_data().length - 1 : l, null == s ? n.colModel.length - 1 : s)
            },
            save: function(t, e, n, i, r) {
                var o, a = n.replace(/^=/, ""),
                    l = {
                        clean: 0,
                        fn: a,
                        fnOrig: a,
                        riO: i,
                        ciO: r,
                        ri: i,
                        ci: r
                    };
                return o = t.pq_fn = t.pq_fn || {}, o[e] = l, l
            },
            selectRange: function(t, e) {
                var n, i, r, o, a = cFormulas.selectExp(t, e);
                return a ? (/^([a-z0-9]+):([a-z0-9]+)$/i.test(a) ? (n = a.split(":"), i = this.toCell(n[0]), r = this.toCell(n[1]), o = {
                    r1: i.r,
                    c1: i.c,
                    r2: r.r,
                    c2: r.c
                }) : /^[a-z]+[0-9]+$/i.test(a) && (i = this.toCell(a), o = {
                    r1: i.r,
                    c1: i.c
                }), o) : void 0
            },
            select: function(t, e) {
                var n = this.selectRange(t, e),
                    i = this.that;
                n ? i.Range(n).select() : i.Selection().removeAll()
            },
            toCell: function(t) {
                var e = t.match(/\$?([A-Z]+)?\$?(\d+)?/);
                return {
                    c: e[1] ? pq.toNumber(e[1]) : null,
                    r: e[2] ? e[2] - 1 : null
                }
            },
            valueArr: function(t, e, n, i) {
                var r, o, a, l, s, d, c = this.that,
                    u = c.colModel,
                    h = u.length,
                    f = [],
                    p = [],
                    g = [],
                    v = c.get_p_data(),
                    m = v.length;
                for (n = null == n ? t : n, i = null == i ? e : i, t = 0 > t ? 0 : t, e = 0 > e ? 0 : e, n = n >= m ? m - 1 : n, i = i >= h ? h - 1 : i, r = t; n >= r; r++) {
                    for (a = v[r], o = e; i >= o; o++) l = u[o].dataIndx, d = (s = this.getFnW(a, l)) ? this.execIfDirty(s) : a[l], f.push(d), g.push(d);
                    p.push(g), g = []
                }
                return f.get2Arr = function() {
                    return p
                }, f.getRange = function() {
                    return {
                        r1: t,
                        c1: e,
                        r2: n,
                        c2: i
                    }
                }, f
            }
        }
    }(jQuery),
    function(t) {
        var e = window.pq = window.pq || {};
        e.intel = {
            removeFn: function(t) {
                var e, n = t.length;
                return t = t.replace(/[a-z]*\([^()]*\)/gi, ""), e = t.length, n === e ? t : this.removeFn(t)
            },
            removeStrings: function(t) {
                return t = t.replace(/"[^"]*"/g, ""), t.replace(/"[^"]*$/, "")
            },
            getMatch: function(t, n) {
                var i, r = e.formulas,
                    o = [];
                t = t.toUpperCase();
                for (i in r)
                    if (n) {
                        if (i === t) return [i]
                    } else 0 === i.indexOf(t) && o.push(i);
                return o
            },
            intel: function(t) {
                t = this.removeStrings(t), t = this.removeFn(t);
                var e, n, i, r = /^=(.*[,+\-&*\s(><=])?([a-z]+)((\()[^)]*)?$/i;
                return (e = t.match(r)) && (n = e[2], e[4] && (i = !0)), [n, i]
            },
            movepos: function(t) {
                var e;
                return (e = t.match(/([^a-z].*)/i)) ? t.indexOf(e[1]) + 1 : t.length
            },
            intel3: function(t, e) {
                e < t.length && /=(.*[,+\-&*\s(><=])?[a-z]+$/i.test(t.slice(0, e)) && (e += this.movepos(t.slice(e)));
                var n = t.substr(0, e),
                    i = this.intel(n);
                return i
            },
            item: function(t) {
                var e = this.that.options.strFormulas;
                return e = e ? e[t] : null, "<div>" + (e ? e[0] : t) + "</div>" + (e ? "<div style='font-size:0.9em;color:#888;margin-bottom:5px;'>" + e[1] + "</div>" : "")
            },
            popup: function(e, n, i) {
                var r, o, a, l = i.closest(".pq-grid"),
                    s = t(".pq-intel"),
                    d = l,
                    c = this.intel3(e, n);
                this.that = l.pqGrid("instance"), s.remove(), (r = c[0]) && (o = this.getMatch(r, c[1]), a = o.map(this.item, this).join(""), a && t("<div class='pq-intel' style='width:350px;max-height:300px;overflow:auto;background:#fff;border:1px solid gray;box-shadow: 4px 4px 2px #aaaaaa;padding:5px;'></div>").appendTo(d).html(a).position({
                    my: "center top",
                    at: "center bottom",
                    collision: "flipfit",
                    of: i,
                    within: d
                }))
            },
            hide: function() {
                t(".pq-intel").remove()
            }
        }
    }(jQuery),
    function($) {
        var f = pq.formulas = {
            evalify: function(t, e) {
                var n, i, r = e.match(/([><=]{1,2})?(.*)/),
                    o = r[1] || "=",
                    a = r[2],
                    l = this;
                return /(\*|\?)/.test(a) ? n = a.replace(/\*/g, ".*").replace(/\?/g, "\\S").replace(/\(/g, "\\(").replace(/\)/g, "\\)") : (o = "=" === o ? "==" : "<>" === o ? "!=" : o, i = this.isNumber(a)), t.map(function(t) {
                    return n ? (t = null == t ? "" : t, t = ("<>" === o ? "!" : "") + "/^" + n + '$/i.test("' + t + '")') : i ? t = l.isNumber(t) ? t + o + a : "false" : (t = null == t ? "" : t, t = '"' + (t + "").toUpperCase() + '"' + o + '"' + (a + "").toUpperCase() + '"'), t
                })
            },
            get2Arr: function(t) {
                return t.get2Arr ? t.get2Arr() : t
            },
            isNumber: function(t) {
                return parseFloat(t) == t
            },
            _reduce: function(t, e) {
                var n = (t.length, []),
                    i = e.map(function(t) {
                        return []
                    });
                return t.forEach(function(t, r) {
                    null != t && (t = 1 * t, isNaN(t) || (n.push(t), i.forEach(function(t, n) {
                        t.push(e[n][r])
                    })))
                }), [n, i]
            },
            reduce: function(t) {
                t = this.toArray(t);
                var e = t.shift(),
                    n = t.filter(function(t, e) {
                        return e % 2 == 0
                    }),
                    i = this._reduce(e, n);
                return e = i[0], n = i[1], [e].concat(t.map(function(e, i) {
                    return i % 2 == 0 ? n[i / 2] : t[i]
                }))
            },
            strDate1: "(\\d{1,2})/(\\d{1,2})/(\\d{2,4})",
            strDate2: "(\\d{4})-(\\d{1,2})-(\\d{1,2})",
            strTime: "(\\d{1,2})(:(\\d{1,2}))?(:(\\d{1,2}))?(\\s(AM|PM))?",
            isDate: function(t) {
                return this.reDate.test(t) && Date.parse(t) || t && t.constructor == Date
            },
            toArray: function(t) {
                for (var e = [], n = 0, i = t.length; i > n; n++) e.push(t[n]);
                return e
            },
            valueToDate: function(t) {
                var e = new Date(Date.UTC(1900, 0, 1));
                return e.setUTCDate(e.getUTCDate() + t - 2), e
            },
            varToDate: function(t) {
                var e, n, i, r, o;
                if (this.isNumber(t)) e = this.valueToDate(t);
                else if (t.getTime) e = t;
                else if ("string" == typeof t) {
                    if ((n = t.match(this.reDateTime)) ? n[12] ? (o = 1 * n[13], r = 1 * n[15], i = 1 * n[14]) : (i = 1 * n[2], r = 1 * n[3], o = 1 * n[4]) : (n = t.match(this.reDate2)) ? (o = 1 * n[1], r = 1 * n[3], i = 1 * n[2]) : (n = t.match(this.reDate1)) && (i = 1 * n[1], r = 1 * n[2], o = 1 * n[3]), !n) throw "#N/A date";
                    t = Date.UTC(o, i - 1, r), e = new Date(t)
                }
                return e
            },
            _IFS: function(arg, fn) {
                for (var len = arg.length, i = 0, arr = [], a = 0; len > i; i += 2) arr.push(this.evalify(arg[i], arg[i + 1]));
                for (var condsIndx = arr[0].length, lenArr = len / 2, j; condsIndx--;) {
                    for (j = 0; lenArr > j && eval(arr[j][condsIndx]); j++);
                    a += j === lenArr ? fn(condsIndx) : 0
                }
                return a
            },
            ABS: function(t) {
                return Math.abs(t.map ? t[0] : t)
            },
            ACOS: function(t) {
                return Math.acos(t)
            },
            AND: function() {
                var arr = this.toArray(arguments);
                return eval(arr.join(" && "))
            },
            ASIN: function(t) {
                return Math.asin(t)
            },
            ATAN: function(t) {
                return Math.atan(t)
            },
            _AVERAGE: function(t) {
                var e = 0,
                    n = 0;
                if (t.forEach(function(t) {
                        parseFloat(t) == t && (n += 1 * t, e++)
                    }), e) return n / e;
                throw "#DIV/0!"
            },
            AVERAGE: function() {
                return this._AVERAGE(pq.flatten(arguments))
            },
            AVERAGEIF: function(t, e, n) {
                return this.AVERAGEIFS(n || t, t, e)
            },
            AVERAGEIFS: function() {
                var t = this.reduce(arguments),
                    e = 0,
                    n = t.shift(),
                    i = this._IFS(t, function(t) {
                        return e++, n[t]
                    });
                if (!e) throw "#DIV/0!";
                return i / e
            },
            TRUE: !0,
            FALSE: !1,
            CEILING: function(t) {
                return Math.ceil(t)
            },
            CHAR: function(t) {
                return String.fromCharCode(t)
            },
            CHOOSE: function() {
                var t = pq.flatten(arguments),
                    e = t[0];
                if (e > 0 && e < t.length) return t[e];
                throw "#VALUE!"
            },
            CODE: function(t) {
                return (t + "").charCodeAt(0)
            },
            COLUMN: function(t) {
                return (t || this).getRange().c1 + 1
            },
            COLUMNS: function(t) {
                var e = t.getRange();
                return e.c2 - e.c1 + 1
            },
            CONCATENATE: function() {
                var t = pq.flatten(arguments),
                    e = "";
                return t.forEach(function(t) {
                    e += t
                }), e
            },
            COS: function(t) {
                return Math.cos(t)
            },
            _COUNT: function(t) {
                var e = pq.flatten(t),
                    n = this,
                    i = 0,
                    r = 0,
                    o = 0;
                return e.forEach(function(t) {
                    null == t || "" === t ? i++ : (r++, n.isNumber(t) && o++)
                }), [i, r, o]
            },
            COUNT: function() {
                return this._COUNT(arguments)[2]
            },
            COUNTA: function() {
                return this._COUNT(arguments)[1]
            },
            COUNTBLANK: function() {
                return this._COUNT(arguments)[0]
            },
            COUNTIF: function(t, e) {
                return this.COUNTIFS(t, e)
            },
            COUNTIFS: function() {
                return this._IFS(arguments, function() {
                    return 1
                })
            },
            DATE: function(t, e, n) {
                if (0 > t || t > 9999) throw "#NUM!";
                return 1899 >= t && (t += 1900), this.VALUE(new Date(Date.UTC(t, e - 1, n)))
            },
            DATEVALUE: function(t) {
                return this.DATEDIF("1/1/1900", t, "D") + 2
            },
            DATEDIF: function(t, e, n) {
                var i, r = this.varToDate(e),
                    o = this.varToDate(t),
                    a = r.getTime(),
                    l = o.getTime(),
                    s = (a - l) / 864e5;
                if ("Y" === n) return parseInt(s / 365);
                if ("M" === n) return i = r.getUTCMonth() - o.getUTCMonth() + 12 * (r.getUTCFullYear() - o.getUTCFullYear()), o.getUTCDate() > r.getUTCDate() && i--, i;
                if ("D" === n) return s;
                throw "unit N/A"
            },
            DAY: function(t) {
                return this.varToDate(t).getUTCDate()
            },
            DAYS: function(t, e) {
                return this.DATEDIF(e, t, "D")
            },
            DEGREES: function(t) {
                return 180 / Math.PI * t
            },
            EOMONTH: function(t, e) {
                e = e || 0;
                var n = this.varToDate(t);
                return n.setUTCMonth(n.getUTCMonth() + e + 1), n.setUTCDate(0), this.VALUE(n)
            },
            EXP: function(t) {
                return Math.exp(t)
            },
            FIND: function(t, e, n) {
                return e.indexOf(t, n ? n - 1 : 0) + 1
            },
            FLOOR: function(t, e) {
                return 0 > t * e ? "#NUM!" : parseInt(t / e) * e
            },
            HLOOKUP: function(t, e, n, i) {
                null == i && (i = !0), e = this.get2Arr(e);
                var r = this.MATCH(t, e[0], i ? 1 : 0);
                return this.INDEX(e, n, r)
            },
            HOUR: function(t) {
                if (Date.parse(t)) {
                    var e = new Date(t);
                    return e.getHours()
                }
                return 24 * t
            },
            IF: function(t, e, n) {
                return t ? e : n
            },
            INDEX: function(t, e, n) {
                return t = this.get2Arr(t), e = e || 1, n = n || 1, "function" == typeof t[0].push ? t[e - 1][n - 1] : t[e > 1 ? e - 1 : n - 1]
            },
            INDIRECT: function(t) {
                var e = this.iFormula;
                return e.cell(t.toUpperCase())
            },
            LARGE: function(t, e) {
                return t.sort(), t[t.length - (e || 1)]
            },
            LEFT: function(t, e) {
                return t.substr(0, e || 1)
            },
            LEN: function(t) {
                return t = (t.map ? t : [t]).map(function(t) {
                    return t.length
                }), t.length > 1 ? t : t[0]
            },
            LOOKUP: function(t, e, n) {
                n = n || e;
                var i = this.MATCH(t, e, 1);
                return this.INDEX(n, 1, i)
            },
            LOWER: function(t) {
                return (t + "").toLocaleLowerCase()
            },
            _MAXMIN: function(t, e) {
                var n, i = this;
                return t.forEach(function(t) {
                    null != t && (t = i.VALUE(t), i.isNumber(t) && (t * e > n * e || null == n) && (n = t))
                }), null != n ? n : 0
            },
            MATCH: function(val, arr, type) {
                var isNumber = this.isNumber(val),
                    _isNumber, sign, indx, _val, i = 0,
                    len = arr.length;
                if (null == type && (type = 1), val = isNumber ? val : val.toUpperCase(), 0 === type) {
                    for (arr = this.evalify(arr, val + ""), i = 0; len > i; i++)
                        if (_val = arr[i], eval(_val)) {
                            indx = i + 1;
                            break
                        }
                } else {
                    for (i = 0; len > i; i++)
                        if (_val = arr[i], _isNumber = this.isNumber(_val), _val = arr[i] = _isNumber ? _val : _val ? _val.toUpperCase() : "", val == _val) {
                            indx = i + 1;
                            break
                        }
                    if (!indx) {
                        for (i = 0; len > i; i++)
                            if (_val = arr[i], _isNumber = this.isNumber(_val), type * (val > _val ? -1 : 1) === 1 && isNumber == _isNumber) {
                                indx = i;
                                break
                            }
                        indx = null == indx ? i : indx
                    }
                }
                if (indx) return indx;
                throw "#N/A"
            },
            MAX: function() {
                var t = pq.flatten(arguments);
                return this._MAXMIN(t, 1)
            },
            MEDIAN: function() {
                var t = pq.flatten(arguments).filter(function(t) {
                        return 1 * t == t
                    }).sort(function(t, e) {
                        return e - t
                    }),
                    e = t.length,
                    n = e / 2;
                return n === parseInt(n) ? (t[n - 1] + t[n]) / 2 : t[(e - 1) / 2]
            },
            MID: function(t, e, n) {
                if (1 > e || 0 > n) throw "#VALUE!";
                return t.substr(e - 1, n)
            },
            MIN: function() {
                var t = pq.flatten(arguments);
                return this._MAXMIN(t, -1)
            },
            MODE: function() {
                var t, e, n = pq.flatten(arguments),
                    i = {},
                    r = 0;
                if (n.forEach(function(n) {
                        t = i[n] = i[n] ? i[n] + 1 : 1, t > r && (r = t, e = n)
                    }), 2 > r) throw "#N/A";
                return e
            },
            MONTH: function(t) {
                return this.varToDate(t).getUTCMonth() + 1
            },
            OR: function() {
                var arr = this.toArray(arguments);
                return eval(arr.join(" || "))
            },
            PI: function() {
                return Math.PI
            },
            POWER: function(t, e) {
                return Math.pow(t, e)
            },
            PRODUCT: function() {
                var t = pq.flatten(arguments),
                    e = 1;
                return t.forEach(function(t) {
                    e *= t
                }), e
            },
            PROPER: function(t) {
                return t = t.replace(/(\S+)/g, function(t) {
                    return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
                })
            },
            RADIANS: function(t) {
                return Math.PI / 180 * t
            },
            RAND: function() {
                return Math.random()
            },
            RANK: function(t, e, n) {
                var i = JSON.stringify(e.getRange()),
                    r = this,
                    o = i + "_range";
                e = this[o] || function() {
                    return r[o] = e, e.sort(function(t, e) {
                        return t - e
                    })
                }();
                for (var a = 0, l = e.length; l > a; a++)
                    if (t === e[a]) return n ? a + 1 : l - a
            },
            RATE: function() {},
            REPLACE: function(t, e, n, i) {
                return t += "", t.substr(0, e - 1) + i + t.substr(e + n - 1)
            },
            REPT: function(t, e) {
                for (var n = ""; e--;) n += t;
                return n
            },
            RIGHT: function(t, e) {
                return e = e || 1, t.substr(-1 * e, e)
            },
            _ROUND: function(t, e, n) {
                var i = Math.pow(10, e),
                    r = t * i,
                    o = parseInt(r),
                    a = r - o;
                return n(o, a) / i
            },
            ROUND: function(t, e) {
                return this._ROUND(t, e, function(t, e) {
                    var n = Math.abs(e);
                    return t + (n >= .5 ? n / e : 0)
                })
            },
            ROUNDDOWN: function(t, e) {
                return this._ROUND(t, e, function(t) {
                    return t
                })
            },
            ROUNDUP: function(t, e) {
                return this._ROUND(t, e, function(t, e) {
                    return t + (e ? Math.abs(e) / e : 0)
                })
            },
            ROW: function(t) {
                return (t || this).getRange().r1 + 1
            },
            ROWS: function(t) {
                var e = t.getRange();
                return e.r2 - e.r1 + 1
            },
            SEARCH: function(t, e, n) {
                return t = t.toUpperCase(), e = e.toUpperCase(), e.indexOf(t, n ? n - 1 : 0) + 1
            },
            SIN: function(t) {
                return Math.sin(t)
            },
            SMALL: function(t, e) {
                return t.sort(), t[(e || 1) - 1]
            },
            SQRT: function(t) {
                return Math.sqrt(t)
            },
            _STDEV: function(t) {
                t = pq.flatten(t);
                var e = t.length,
                    n = this._AVERAGE(t),
                    i = 0;
                return t.forEach(function(t) {
                    i += (t - n) * (t - n)
                }), [i, e]
            },
            STDEV: function() {
                var t = this._STDEV(arguments);
                if (1 === t[1]) throw "#DIV/0!";
                return Math.sqrt(t[0] / (t[1] - 1))
            },
            STDEVP: function() {
                var t = this._STDEV(arguments);
                return Math.sqrt(t[0] / t[1])
            },
            SUBSTITUTE: function(t, e, n, i) {
                var r = 0;
                return t.replace(new RegExp(e, "g"), function(t) {
                    return r++, i ? r === i ? n : e : n
                })
            },
            SUM: function() {
                var t = pq.flatten(arguments),
                    e = 0,
                    n = this;
                return t.forEach(function(t) {
                    t = n.VALUE(t), n.isNumber(t) && (e += parseFloat(t))
                }), e
            },
            SUMIF: function(t, e, n) {
                return this.SUMIFS(n || t, t, e)
            },
            SUMIFS: function() {
                var t = this.reduce(arguments),
                    e = t.shift();
                return this._IFS(t, function(t) {
                    return e[t]
                })
            },
            SUMPRODUCT: function() {
                var t = this.toArray(arguments);
                return t = t[0].map(function(e, n) {
                    var i = 1;
                    return t.forEach(function(t) {
                        var e = t[n];
                        i *= parseFloat(e) == e ? e : 0
                    }), i
                }), pq.aggregate.sum(t)
            },
            TAN: function(t) {
                return Math.tan(t)
            },
            TEXT: function(t, e) {
                return this.isNumber(t) && e.indexOf("#") >= 0 ? pq.formatNumber(t, e) : $.datepicker.formatDate(pq.excelToJui(e), this.varToDate(t))
            },
            TIME: function(t, e, n) {
                return (t + e / 60 + n / 3600) / 24
            },
            TIMEVALUE: function(t) {
                var e = t.match(this.reTime);
                if (e && null != e[1] && (null != e[3] || null != e[7])) var n = 1 * e[1],
                    i = 1 * (e[3] || 0),
                    r = 1 * (e[5] || 0),
                    o = (e[7] || "").toUpperCase(),
                    a = n + i / 60 + r / 3600;
                if (a >= 0 && (o && 13 > a || !o && 24 > a)) return "PM" == o && 12 > n ? a += 12 : "AM" == o && 12 == n && (a -= 12), a / 24;
                throw "#VALUE!"
            },
            TODAY: function() {
                var t = new Date;
                return this.VALUE(new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())))
            },
            TRIM: function(t) {
                return t.replace(/^\s+|\s+$/gm, "")
            },
            TRUNC: function(t, e) {
                return e = Math.pow(10, e || 0), ~~(t * e) / e
            },
            UPPER: function(t) {
                return (t + "").toLocaleUpperCase()
            },
            VALUE: function(t) {
                var e, n;
                if (t)
                    if (parseFloat(t) == t) n = parseFloat(t);
                    else if (this.isDate(t)) n = this.DATEVALUE(t);
                else if (e = t.match(this.reDateTime)) {
                    var i = e[1] || e[12],
                        r = t.substr(i.length + 1);
                    n = this.DATEVALUE(i) + this.TIMEVALUE(r)
                } else(e = t.match(this.reTime)) ? n = this.TIMEVALUE(t) : (n = t.replace(/[^0-9\-.]/g, ""), n = n.replace(/(\.[1-9]*)0+$/, "$1").replace(/\.$/, ""));
                else n = 0;
                return n
            },
            VAR: function() {
                var t = this._STDEV(arguments);
                return t[0] / (t[1] - 1)
            },
            VARP: function() {
                var t = this._STDEV(arguments);
                return t[0] / t[1]
            },
            VLOOKUP: function(t, e, n, i) {
                null == i && (i = !0), e = this.get2Arr(e);
                var r = e.map(function(t) {
                        return t[0]
                    }),
                    o = this.MATCH(t, r, i ? 1 : 0);
                return this.INDEX(e, o, n)
            },
            YEAR: function(t) {
                return this.varToDate(t).getUTCFullYear()
            }
        };
        f.reDate1 = new RegExp("^" + f.strDate1 + "$"), f.reDate2 = new RegExp("^" + f.strDate2 + "$"), f.reDate = new RegExp("^" + f.strDate1 + "$|^" + f.strDate2 + "$"), f.reTime = new RegExp("^" + f.strTime + "$", "i"), f.reDateTime = new RegExp("^(" + f.strDate1 + ")\\s" + f.strTime + "$|^(" + f.strDate2 + ")\\s" + f.strTime + "$")
    }(jQuery),
    function(t) {
        pq.Select = function(e, n) {
            if (this instanceof pq.Select == 0) return new pq.Select(e, n);
            var i = n.closest(".pq-grid"),
                r = t("<div/>").appendTo(i);
            pq.grid(r, t.extend({
                width: n[0].offsetWidth,
                scrollModel: {
                    autoFit: !0
                },
                height: "flex",
                autoRow: !1,
                numberCell: {
                    show: !1
                },
                hoverMode: "row",
                fillHandle: "",
                stripeRows: !1,
                showTop: !1,
                showHeader: !1
            }, e));
            pq.makePopup(r[0]), r.position({
                my: "left top",
                at: "left bottom",
                of: n,
                collision: "flipfit",
                within: i
            })
        }
    }(jQuery),
    function(t) {
        var e = function(t) {
            this.options = t.options
        };
        e.prototype = {
            empty: function() {
                for (var t in this) 0 == t.indexOf("_") && delete this[t];
                delete this.options.dataModel.dataPrimary
            },
            getCM: function() {
                return this._cm
            },
            setCM: function(t) {
                this._cm = t
            },
            getCols: function() {
                return this._columns
            },
            setCols: function(t) {
                this._columns = t
            },
            getDMData: function() {
                return this.options.dataModel.dataPrimary
            },
            setDMData: function(t) {
                this.options.dataModel.dataPrimary = t
            },
            getOCM: function() {
                return this._ocm
            },
            setOCM: function(t) {
                this._ocm = t
            }
        }, t(document).on("pqGrid:bootup", function(t, n) {
            var i = n.instance,
                r = i.Group();
            r.primary = new e(i), i.on("beforeFilterDone", r.onBeforeFilterDone.bind(r)).one("CMInit", r.oneCMInit.bind(r))
        });
        var n = {},
            i = {
                clearPivot: function(t) {
                    if (this.isPivot()) {
                        var e = this.that,
                            n = e.options.dataModel,
                            i = this.primary;
                        if (i.getOCM() && e.refreshCM(i.getOCM()), t) {
                            if (!i.getDMData()) throw "!primary.getDMData";
                            n.data = i.getDMData()
                        } else i.getDMData() && (n.data = i.getDMData());
                        return this.primary.empty(), this.setPivot(!1), !0
                    }
                },
                getColsPrimary: function() {
                    return this.primary.getCols() || this.that.columns
                },
                getCMPrimary: function() {
                    return this.primary.getCM() || this.that.colModel
                },
                getOCMPrimary: function() {
                    return this.primary.getOCM() || this.that.options.colModel
                },
                getSumCols: function() {
                    return (n.getSumCols.call(this) || []).map(function(t) {
                        return [t.dataIndx, t.dataType, t.summary, t.summary.type + "(" + t.title + ")", t.width, t.format, t.showifOpen]
                    })
                },
                getVal: function() {
                    return this._pivot ? function(t, e) {
                        return t[e]
                    } : n.getVal.apply(this, arguments)
                },
                groupData: function() {
                    var t, e, i, r = this,
                        o = r.that,
                        a = o.options,
                        l = a.groupModel,
                        s = l.dataIndx,
                        d = l.groupCols,
                        c = r.isPivot(),
                        u = !c && l.pivot,
                        h = d.length;
                    if (u ? (h && (t = s.slice(), l.dataIndx = s = s.concat(d)), r.skipConcat = !0, e = l.titleInFirstCol, i = l.merge, l.titleInFirstCol = !1, l.fixCols = !0, l.merge = !1) : c && h && (t = s.slice(), l.dataIndx.length = l.dataIndx.length - 1, r.setPivot(!1)), n.groupData.call(r), u && (o.pdata = o.pdata.reduce(function(t, e) {
                            return e.pq_gtitle && t.push(e), t
                        }, [])), c && h && (l.dataIndx = t, r.setPivot(!0)), u) {
                        if (h) {
                            e ? (l.titleInFirstCol = !0, l.fixCols = !1) : t.length > 1 && (l.merge = i), r.pivotData(s, t), l.dataIndx = t.slice(0, t.length - 1), l.summaryInTitleRow = "all", r.skipConcat = !1;
                            var f = r.firstCol().dataIndx,
                                p = t[t.length - 1];
                            e && f != p && o.pdata.forEach(function(t) {
                                t[f] = t[p]
                            }), n.groupData.call(r), l.dataIndx = t, r.setPivot(!0)
                        }
                        r.skipConcat = !1
                    }
                    o._trigger("groupData")
                },
                isPivot: function() {
                    return this._pivot
                },
                getSorter: function(t) {
                    var e, n = t.pivotSortFn;
                    return n || (e = pq.getDataType(t), n = "number" == e ? function(t, e) {
                        return 1 * t.sortby > 1 * e.sortby ? 1 : -1
                    } : function(t, e) {
                        return t.sortby > e.sortby ? 1 : -1
                    }), n
                },
                nestedCM: function(e, n) {
                    var i = this,
                        r = n.groupCols,
                        o = n.pivotColsTotal,
                        a = "hideifOpen" == o ? !1 : null,
                        l = [],
                        s = [],
                        d = i.that.columns;
                    return d = r.map(function(t) {
                            var e = d[t];
                            return l.push(i.getSorter(e)), s.push(pq.getDataType(e)), e
                        }),
                        function c(n, i, r) {
                            i = i || 0, r = r || [];
                            var u, h, f, p, g, v, m, w, x = 0,
                                y = [];
                            if (t.isEmptyObject(n))
                                for (; x < e.length; x++) u = e[x], h = r.slice(), h.push(u[0]), f = {
                                    dataIndx: h.join("_"),
                                    dataType: u[1],
                                    summary: u[2],
                                    title: u[3],
                                    width: u[4],
                                    format: u[5],
                                    showifOpen: u[6]
                                }, y.push(f);
                            else {
                                u = d[i], p = s[i];
                                for (g in n) m = "aggr" === g, h = r.slice(), h.push(g), v = c(n[g], i + 1, h), m ? (w = v, w.forEach(function(t) {
                                    t.showifOpen = a, t.type = "aggr"
                                })) : (f = {
                                    showifOpen: !0,
                                    sortby: g,
                                    title: pq.format(u, g, p),
                                    colModel: v
                                }, v.length > 1 && !v.find(function(t) {
                                    return !t.type
                                }).dataIndx && (f.collapsible = {
                                    on: !0,
                                    last: null
                                }), y.push(f));
                                y.sort(l[i]), w && y["before" == o ? "unshift" : "push"].apply(y, w)
                            }
                            return y
                        }
                },
                onBeforeFilterDone: function(t, e) {
                    if (this.isPivot()) {
                        for (var n, i = e.rules, r = this.primary.getCols(), o = 0; o < i.length; o++)
                            if (n = i[o], !r[n.dataIndx]) return !1;
                        this.clearPivot(!0), e.header = !0
                    }
                },
                oneCMInit: function() {
                    this.updateAgg(this.that.options.groupModel.agg)
                },
                option: function(t, e, i, r) {
                    var o = this,
                        a = t.agg;
                    o.isPivot() && o.clearPivot(), a && o.updateAgg(a, o.that.options.groupModel.agg), n.option.call(o, t, e, i, r)
                },
                pivotData: function(e, n) {
                    var i, r, o = this.that,
                        a = this.getSumCols(),
                        l = this.getSumDIs(),
                        s = o.options,
                        d = s.groupModel,
                        c = this.primary,
                        u = o.pdata,
                        h = o.columns;
                    d.titleInFirstCol ? (i = o.colModel[0], r = [i].concat(n.reduce(function(e, n) {
                        return n != i.dataIndx && e.push(t.extend({
                            hidden: !0
                        }, h[n])), e
                    }, []))) : r = n.map(function(t) {
                        return h[t]
                    });
                    var f = this.transformData(u, l, e, n),
                        p = this.nestedCM(a, d)(f),
                        g = {};
                    g.CM = r = r.concat(p), o._trigger("pivotCM", null, g), c.setOCM(s.colModel), c.setCM(o.colModel), c.setCols(o.columns), o.refreshCM(g.CM, {
                        pivot: !0
                    })
                },
                setPivot: function(t) {
                    this._pivot = t
                },
                transformData: function(t, e, n, i) {
                    var r, o, a, l, s = this,
                        d = [],
                        c = this.that,
                        u = this.primary,
                        h = {},
                        f = [],
                        p = c.options,
                        g = p.dataModel,
                        v = p.groupModel,
                        m = v.pivotColsTotal,
                        w = i.length,
                        x = {},
                        y = n.length;
                    return t.forEach(function(t) {
                        var c, u, p = t.pq_level,
                            g = p - w,
                            v = x,
                            C = n[p],
                            b = t[C];
                        if (g >= 0)
                            for (f[g] = b, c = 0; g + 1 > c; c++) u = f[c], v = v[u] = v[u] || {};
                        p === y - 1 ? e.forEach(function(e) {
                            l = f.slice(), l.push(e), a[l.join("_")] = t[e]
                        }) : ((!a || o > p && w > p) && (a = {
                            pq_gid: s.idCount++
                        }, r = !0), w > p && (h[C] = a[C] = b), m && y - 2 >= p && p >= w - 1 && e.forEach(function(e) {
                            l = f.slice(0, g + 1), l.push("aggr"), l.push(e), a[l.join("_")] = t[e]
                        })), o = p, r && (d.push(a), i.forEach(function(t) {
                            void 0 === a[t] && (a[t] = h[t])
                        }), r = !1)
                    }), u.setDMData(g.data), g.data = c.pdata = d, m && this.addAggrInCM(x, v.pivotTotalForSingle), x
                },
                addAggrInCM: function(t, e) {
                    var n, i = 0;
                    for (n in t) i++, this.addAggrInCM(t[n], e);
                    i > (e ? 0 : 1) && (t.aggr = {})
                },
                updateAgg: function(t, e) {
                    var n, i = this.that.columns;
                    if (e)
                        for (n in e) i[n].summary = null;
                    if (t)
                        for (n in t) i[n].summary = {
                            type: t[n]
                        }
                }
            },
            r = t.paramquery.cGroup.prototype;
        for (var o in i) n[o] = r[o], r[o] = i[o]
    }(jQuery),
    function(t) {
        var e = t.paramquery;
        e.pqGrid.defaults.toolPanel = {}, e.pqGrid.prototype.ToolPanel = function() {
            return this.iToolPanel
        }, t(document).on("pqGrid:bootup", function(t, n) {
            var i = n.instance;
            i.iToolPanel = new e.cToolPanel(i)
        }), e.cToolPanel = function(t) {
            var e = this;
            e.that = t, e.clsSort = "pq-sortable", t.one("render", e.init.bind(e))
        }, e.cToolPanel.prototype = {
            getArray: function(t) {
                return t.find(".pq-pivot-col").get().map(function(t) {
                    return t.id
                })
            },
            getInit: function() {
                return this._inited
            },
            getObj: function(t) {
                var e = {};
                return t.find(".pq-pivot-col").each(function(t, n) {
                    e[n.id] = n.getAttribute("type") || "sum"
                }), e
            },
            getSortCancel: function() {
                return this._sortCancel
            },
            _hide: function(t) {
                this.$ele[t ? "hide" : "show"](), this.init(), this.that.refresh({
                    soft: !0
                })
            },
            hide: function() {
                this._hide(!0)
            },
            init: function() {
                var t = this,
                    e = t.$ele = t.that.$toolPanel;
                if (t.isVisible() && !t.getInit()) {
                    var n = t.that,
                        i = n.options,
                        r = i.toolPanel,
                        o = i.groupModel.pivot,
                        a = " pq-pivot-label ",
                        l = " pq-pivot-pane pq-border-1 ",
                        s = t.isHideColPane(),
                        d = r.hidePivotChkBox,
                        c = o ? "checked" : "",
                        u = t.clsSort;
                    e.html(["<div class='pq-pivot-cols-all", l, "'>", "<div class='", u, "' style='", d ? "padding-top:0;" : "", "'></div>", d ? "" : ["<div class='", a, "'>", "<label><input type='checkbox' class='pq-pivot-checkbox' ", c, "/>", i.strTP_pivot, "</label>", "</div>"].join(""), "</div>", "<div class='pq-pivot-rows", l, "' style='display:", r.hideRowPane ? "none" : "", ";'>", "<div deny='denyGroup' class='", u, "'></div>", "<div class='", a, "'><span class='pq-icon'></span>", i.strTP_rowPane, "</div>", "</div>", "<div class='pq-pivot-cols", l, "' style='display:", s ? "none" : "", ";'>", "<div deny='denyPivot' class='", u, "'></div>", "<div class='", a, "'><span class='pq-icon'></span>", i.strTP_colPane, "</div>", "</div>", "<div class='pq-pivot-vals", l, "' style='display:", r.hideAggPane ? "none" : "", ";'>", "<div deny='denyAgg' class='", u, "'></div>", "<div class='", a, "'><span class='pq-icon'></span>", i.strTP_aggPane, "</div>", "</div>"].join("")), t.$pivotChk = e.find(".pq-pivot-checkbox").on("click", t.onPivotChange(t, n)), t.$colsAll = e.find(".pq-pivot-cols-all>." + u), t.$colsPane = e.find(".pq-pivot-cols"), t.$cols = e.find(".pq-pivot-cols>." + u), t.$rows = e.find(".pq-pivot-rows>." + u), t.$aggs = e.find(".pq-pivot-vals>." + u).on("click contextmenu", t.onClick.bind(t)), n.on("refreshFull", t.setHt.bind(t)).on("groupOption", t.onGroupOption.bind(t)), setTimeout(function() {
                        n.element && (n.on("CMInit", t.onCMInit.bind(t)), t.render())
                    }), t.setInit()
                }
            },
            isHideColPane: function() {
                var t = this.that.options;
                return t.toolPanel.hideColPane || !t.groupModel.pivot
            },
            isDeny: function(t, e, n) {
                var i = e.attr("deny"),
                    r = this.that,
                    o = r.iGroup.getColsPrimary(),
                    a = o[n[0].id];
                return a[i]
            },
            isVisible: function() {
                return this.$ele.is(":visible")
            },
            onCMInit: function(t, e) {
                e.pivot || e.flex || e.group || this.that.Group().isPivot() || this.refresh()
            },
            onClick: function(e) {
                var n = t(e.target),
                    i = this,
                    r = i.that;
                if (n.hasClass("pq-pivot-col")) {
                    var o = n[0].id,
                        a = r.iGroup.getColsPrimary()[o],
                        l = r.iGroup.getAggOptions(a.dataType).sort(),
                        s = {
                            dataModel: {
                                data: l.map(function(t) {
                                    return [t]
                                })
                            },
                            cellClick: function(t, e) {
                                var r = e.rowData[0],
                                    o = this;
                                n.attr("type", r), setTimeout(function() {
                                    o.destroy(), i.refreshGrid(), i.refresh()
                                })
                            }
                        };
                    return pq.Select(s, n), !1
                }
            },
            onGroupOption: function(t, e) {
                if ("tp" != e.source) {
                    var n = e.oldGM,
                        i = this.that.options.groupModel;
                    i.groupCols == n.groupCols && i.agg == n.agg && i.dataIndx == n.dataIndx && i.pivot == n.pivot || this.refresh()
                }
            },
            onPivotChange: function(t, e) {
                return function() {
                    var n = !!this.checked,
                        i = {
                            pivot: n
                        };
                    e.Group().option(i, null, "tp"), t.showHideColPane()
                }
            },
            ph: function(t) {
                return "<span style='color:#999;margin:1px;display:inline-block;'>" + t + "</span>"
            },
            refreshGrid: function() {
                var t = this,
                    e = t.that,
                    n = t.getArray(t.$cols),
                    i = t.getObj(t.$aggs),
                    r = t.getArray(t.$rows);
                e.Group().option({
                    groupCols: n,
                    dataIndx: r,
                    agg: i,
                    on: !!r.length
                }, null, "tp"), setTimeout(function() {
                    t.refresh()
                })
            },
            onReceive: function(t, e) {
                return this.getSortCancel() ? this.setSortCancel(!1) : void this.refreshGrid()
            },
            onOver: function(e) {
                return function(n, i) {
                    var r = t(this),
                        o = i.item,
                        a = o.parent(),
                        l = "addClass",
                        s = "removeClass",
                        d = a[0] != r[0] ? e.isDeny(a, r, o) : !1;
                    i.helper.find(".ui-icon")[d ? l : s]("ui-icon-closethick")[d ? s : l]("ui-icon-check")
                }
            },
            onStop: function(e) {
                return function(n, i) {
                    var r = t(this),
                        o = i.item,
                        a = o.parent();
                    r[0] != a[0] && e.isDeny(r, a, o) && (r.sortable("cancel"), e.setSortCancel(!0))
                }
            },
            onTimer: function() {
                var t;
                return function(e, n) {
                    clearTimeout(t);
                    var i = this;
                    t = setTimeout(function() {
                        i.onReceive(e, n)
                    })
                }
            }(),
            refresh: function() {
                this.setHtml(), t(this.panes).sortable("refresh")
            },
            render: function() {
                var e = this,
                    n = "." + e.clsSort,
                    i = e.that;
                i.element && (e.panes = [e.$colsAll, e.$cols, e.$rows, e.$aggs], e.setHtml(), t(e.panes).sortable({
                    appendTo: e.$ele,
                    connectWith: n,
                    containment: e.$ele,
                    cursor: "move",
                    items: "> .pq-pivot-col:not('.pq-deny-drag')",
                    helper: function(t, e) {
                        return e.clone(!0).css({
                            opacity: "0.8"
                        }).prepend("<span class='ui-icon-check ui-icon'></span>")
                    },
                    receive: e.onTimer.bind(e),
                    stop: e.onStop(e),
                    over: e.onOver(e),
                    update: e.onTimer.bind(e),
                    tolerance: "pointer"
                }), i._trigger("tpRender"))
            },
            setHtml: function() {
                var t, e, n = this,
                    i = n.that,
                    r = [],
                    o = [],
                    a = [],
                    l = [],
                    s = n.template,
                    d = n.templateVals,
                    c = {},
                    u = i.options,
                    h = i.iGroup,
                    f = h.getColsPrimary(),
                    p = h.getCMPrimary(),
                    g = u.groupModel,
                    v = g.dataIndx,
                    m = g.groupCols;
                v.concat(m).forEach(function(t) {
                    c[t] = 1
                }), n.$pivotChk[0].checked = g.pivot, n.showHideColPane();
                for (var w = 0, x = p.length; x > w; w++) t = p[w], e = t.dataIndx, t.tpHide || c[e] || (t.summary && t.summary.type ? l.push(d(e, t)) : r.push(s(e, t)));
                v.forEach(function(t) {
                    a.push(s(t, f[t]))
                }), m.forEach(function(t) {
                    o.push(s(t, f[t]))
                }), n.$colsAll.html(r.join("")), n.$rows.html(a.join("") || n.ph(u.strTP_rowPH)), n.$cols.html(o.join("") || n.ph(u.strTP_colPH)), n.$aggs.html(l.join("") || n.ph(u.strTP_aggPH))
            },
            setAttrPanes: function() {
                this.$ele.attr("panes", this.panes.filter(function(t) {
                    return t.is(":visible")
                }).length)
            },
            setHt: function() {
                this.$ele.height(this.$ele.parent()[0].offsetHeight)
            },
            setSortCancel: function(t) {
                this._sortCancel = t
            },
            setInit: function() {
                this._inited = !0
            },
            show: function() {
                this._hide(!1)
            },
            showHideColPane: function() {
                var t = this;
                t.$colsPane.css("display", t.isHideColPane() ? "none" : ""), t.setAttrPanes()
            },
            template: function(t, e) {
                return ["<div id='", t, "' class='pq-pivot-col pq-border-2 ", e.tpCls || "", "'>", e.title, "</div>"].join("")
            },
            templateVals: function(t, e) {
                var n = e.summary.type;
                return ["<div id='", t, "' type='", n, "' class='pq-pivot-col pq-border-2 ", e.tpCls || "", "'>", n, "(", e.title, ")</div>"].join("")
            },
            toggle: function() {
                this._hide(this.isVisible())
            }
        }
    }(jQuery),
    function(t) {
        function e(t) {
            var e = this;
            e.that = t, t.on("headerCellClick", e.onHeadCellClick.bind(e)).on("headerClick", e.onHeadClick.bind(e)).on("destroy", e.onDestroy.bind(e))
        }
        t.paramquery;
        t(document).on("pqGrid:bootup", function(t, n) {
            var i = n.instance;
            i.iHeaderMenu = new e(i), i.HeaderMenu = function() {
                return i.iHeaderMenu
            }
        }), e.prototype = {
            close: function() {
                this.$popup.remove(), this.$popup = null
            },
            popup: function() {
                return this.$popup
            },
            openFilterTab: function() {
                var t = this.$popup.find("a[href='tabs-filter']").closest("li").index();
                return this.$tabs.tabs("option", "active", t), this.filterMenu
            },
            FilterMenu: function() {
                return this.filterMenu
            },
            getCM: function() {
                var t = this.that.options.strSelectAll || "Select All";
                return this.nested ? [{
                    editor: !1,
                    dataIndx: "title",
                    title: t,
                    useLabel: !0,
                    filter: {
                        crules: [{
                            condition: "contain"
                        }]
                    }
                }, {
                    hidden: !0,
                    dataIndx: "visible",
                    dataType: "bool"
                }] : [{
                    type: "checkbox",
                    cbId: "visible",
                    dataIndx: "title",
                    title: t,
                    useLabel: !0,
                    filter: {
                        crules: [{
                            condition: "contain"
                        }]
                    },
                    editor: !1
                }, {
                    dataIndx: "visible",
                    hidden: !0,
                    cb: {
                        header: !0
                    },
                    dataType: "bool"
                }]
            },
            getData: function() {
                var t = 1,
                    e = this,
                    n = e.that,
                    i = n.iRenderHead;
                return n.Columns().reduce(function(n) {
                    var r = this.getColIndx({
                            column: n
                        }),
                        o = !n.hidden,
                        a = n.childCount;
                    return n.menuInHide || n.collapsible ? void 0 : (a && (e.nested = !0), {
                        visible: a ? void 0 : o,
                        title: a ? n.title : i.getTitle(n, r) || n.dataIndx,
                        column: n,
                        id: t++,
                        pq_disable: n.menuInDisable,
                        pq_close: n.menuInClose,
                        colModel: a ? n.colModel : void 0
                    })
                })
            },
            getGridObj: function() {
                var e = this,
                    n = "gridOptions",
                    i = e.that;
                return t.extend({
                    dataModel: {
                        data: e.getData()
                    },
                    colModel: e.getCM(),
                    check: e.onChange.bind(e),
                    treeExpand: e.onTreeExpand.bind(e),
                    treeModel: e.nested ? {
                        dataIndx: "title",
                        childstr: "colModel",
                        checkbox: !0,
                        checkboxHead: !0,
                        cbId: "visible",
                        cascade: !0,
                        useLabel: !0
                    } : void 0
                }, i.options.menuUI[n])
            },
            onChange: function(t, e) {
                if (!e.init) {
                    var n = [],
                        i = [];
                    (e.getCascadeList ? e.getCascadeList() : e.rows).forEach(function(t) {
                        var e = t.rowData,
                            r = e.visible,
                            o = e.column,
                            a = o.dataIndx,
                            l = o.colModel;
                        l && l.length || (r ? n.push(a) : i.push(a))
                    }), this.that.Columns().hide({
                        diShow: n,
                        diHide: i
                    })
                }
            },
            onDestroy: function() {
                var t = this.$popup;
                t && t.remove(), delete this.$popup
            },
            onHeadCellClick: function(e, n) {
                var i = this,
                    r = t(e.originalEvent.target);
                return r.hasClass("pq-filter-icon") ? i.onFilterClick(e, n, r) : r.hasClass("pq-menu-icon") ? i.onMenuClick(e, n, r) : void 0
            },
            onHeadClick: function(t, e) {
                return null == this.that.getColModel().find(function(t) {
                    return !t.hidden
                }) ? this.onMenuClick(t, e) : void 0
            },
            getMenuHtml: function(t) {
                var e = {
                        hideCols: "visible",
                        filter: "filter"
                    },
                    n = t.map(function(t) {
                        return ['<li><a href="#tabs-', t, '"><span class="pq-tab-', e[t], '-icon">&nbsp;</span></a></li>'].join("")
                    }).join(""),
                    i = t.map(function(t) {
                        return '<div id="tabs-' + t + '"></div>'
                    }).join("");
                return ["<div class='pq-head-menu pq-theme'>", "<div class='pq-tabs' style='border-width:0;'>", "<ul>", n, "</ul>", i, "</div>", "</div>"].join("")
            },
            getMenuH: function(e, n) {
                return t.extend({}, e.menuUI, n.menuUI)
            },
            open: function(e, n, i) {
                var r, o, a, l = this,
                    s = l.that;
                n = n || s.getCellHeader({
                    dataIndx: e
                }), null != e ? (a = s.columns[e], r = l.menuH = l.getMenuH(s.options, a), o = r.tabs) : o = ["hideCols"];
                var d = l.$popup = t(l.getMenuHtml(o)).appendTo(document.body),
                    c = this.$tabs = d.find(".pq-tabs");
                if (o.indexOf("hideCols") > -1) {
                    var u = l.$grid = t("<div/>").appendTo(d.find("#tabs-hideCols"));
                    l.grid = pq.grid(u, l.getGridObj())
                }
                return o.indexOf("filter") > -1 && l.appendFilter(d.find("#tabs-filter"), a), pq.makePopup(l.$popup[0]), c.tabs({
                    active: localStorage["pq-menu-tab"] || 1,
                    activate: function(e, n) {
                        localStorage["pq-menu-tab"] = t(this).tabs("option", "active"), t(n.newPanel).find(".pq-grid").pqGrid("refresh")
                    }
                }), d.resizable({
                    handles: "e,w",
                    maxWidth: 600,
                    minWidth: 220
                }), d.position({
                    my: "left top",
                    at: "left bottom",
                    of: i || n
                }), this
            },
            onMenuClick: function(t, e, n) {
                return this.open(e.dataIndx, t, n), !1
            },
            onTreeExpand: function(t, e) {
                e.nodes.forEach(function(t) {
                    t.column.menuInClose = e.close
                })
            },
            appendFilter: function(e, n) {
                var i, r, o = this,
                    a = o.that,
                    l = t("<div class='pq-filter-menu pq-theme'/>").appendTo(e),
                    s = o.$popup || l;
                i = o.filterMenu = new pq.cFilterMenu;
                var d = {
                    filterRow: e.is(document.body),
                    grid: a,
                    column: n,
                    $popup: s,
                    menuH: this.menuH || this.getMenuH(a.options, n)
                };
                return i.init(d), r = i.getHtml(), l.html(r), i.ready(l.children().get()), i.addEvents(), s.on("remove", function() {
                    o.$popup = o.filterMenu = null
                }), l
            },
            onFilterClick: function(e, n, i) {
                var r = this.$popup = this.appendFilter(t(document.body), n.column);
                return pq.makePopup(r[0]), r.position({
                    my: "left top",
                    at: "left bottom",
                    of: i
                }), !1
            }
        }
    }(jQuery),
    function(t) {
        var e = pq.cFilterMenu = function() {};
        e.select = function(t, e) {
            this.that = t, this.di1 = "selected", this.grid = null, this.column = e
        }, e.select.prototype = {
            change: function(t) {
                this.onChange(t).call(this.grid)
            },
            create: function(e, n, i) {
                var r = this,
                    o = r.that,
                    a = r.getGridObj(n, i),
                    l = function(t) {
                        var e = n[t];
                        e && e.call(o, s), o._trigger(t, null, s)
                    },
                    s = t.extend({
                        obj: a,
                        column: r.column
                    }, n);
                return l("selectGridObj"), s.grid = r.grid = pq.grid(e, a), l("selectGridCreated"), r.grid
            },
            getCM: function(e, n, i, r, o, a) {
                var l = e.dataIndx,
                    s = t.extend({
                        filter: {
                            crules: [{
                                condition: "contain"
                            }]
                        },
                        align: "left",
                        format: a.format || e.format,
                        deFormat: e.deFormat,
                        title: e.pq_title || e.title,
                        dataType: e.dataType,
                        dataIndx: l,
                        editor: !1,
                        useLabel: !0,
                        renderLabel: this.getRenderLbl(r, l, this.that.options.strBlanks)
                    }, i ? {} : {
                        type: "checkbox",
                        cbId: n
                    });
                return i ? [s, {
                    dataIndx: n,
                    dataType: "bool",
                    hidden: !0
                }, {
                    dataIndx: i,
                    hidden: !0
                }] : [s, {
                    dataIndx: n,
                    dataType: "bool",
                    hidden: !0,
                    cb: {
                        header: !o,
                        maxCheck: o
                    }
                }]
            },
            getData: function(e, n) {
                var i = this.column,
                    r = this.that,
                    o = {},
                    a = this.di1,
                    l = i.dataIndx,
                    s = e.maxCheck,
                    d = pq.filter.getVal(n)[0],
                    c = pq.filter.getOptions(i, e, r, !0);
                return t.isArray(d) ? s && (d = d.slice(0, s)) : d = 1 == s ? [d] : [], d.forEach(function(t) {
                    o[t] = !0
                }), d.length ? c.forEach(function(t) {
                    t[a] = o[t[l]]
                }) : c.forEach(function(t) {
                    t[a] = !s
                }), c
            },
            getGridObj: function(e, n) {
                var i = this,
                    r = i.column,
                    o = i.that.options,
                    a = r.filter,
                    l = "gridOptions",
                    s = e.groupIndx,
                    d = e.maxCheck,
                    c = i.di1,
                    u = i.getData(e, a),
                    h = u && u.length && null != u[0].pq_label ? "pq_label" : e.labelIndx;
                return i.filterUI = e, t.extend({
                    colModel: i.getCM(r, c, s, h, d, e),
                    check: i.onChange(!n),
                    filterModel: "bool" === r.dataType ? {} : void 0,
                    groupModel: s ? {
                        on: !0,
                        dataIndx: s ? [s] : [],
                        titleInFirstCol: !0,
                        fixCols: !1,
                        indent: 18,
                        checkbox: !0,
                        select: !1,
                        checkboxHead: !d,
                        cascade: !d,
                        maxCheck: d,
                        cbId: c
                    } : {},
                    dataModel: {
                        data: u
                    }
                }, o.menuUI[l], o.filterModel[l], e[l])
            },
            getRenderLbl: function(t, e, n) {
                return t === e && (t = void 0),
                    function(i) {
                        var r = i.rowData,
                            o = r[t];
                        return o || "" !== r[e] ? o : n
                    }
            },
            onChange: function(t) {
                var e = this,
                    n = e.filterUI,
                    i = n.maxCheck,
                    r = n.condition;
                return function() {
                    if (t) {
                        var n = !1,
                            o = e.column,
                            a = o.dataIndx,
                            l = e.di1,
                            s = e.that,
                            d = this.getData().filter(function(t) {
                                var e = t[l];
                                return e || (n = !0), e
                            }).map(function(t) {
                                return t[a]
                            });
                        n ? s.filter({
                            oper: "add",
                            rule: {
                                dataIndx: a,
                                condition: r,
                                value: 1 === i ? d[0] : d
                            }
                        }) : s.filter({
                            rule: {
                                dataIndx: a,
                                condition: r,
                                value: []
                            }
                        }), e.refreshRowFilter()
                    }
                }
            },
            refreshRowFilter: function() {
                this.that.iRenderHead.postRenderCell(this.column)
            }
        }, e.prototype = {
            addEvents: function() {
                var t = this;
                t.$sel0.on("change", t.onSel1Change.bind(t)), t.$sel1.on("change", t.onSel2Change.bind(t)), t.$filter_mode.on("change", t.onModeChange.bind(t)), t.$clear.button().on("click", t.clear.bind(t)), t.$ok.button().on("click", t.ok.bind(t))
            },
            addEventsInput: function() {
                var t = this;
                t.$inp && (t.$inp.filter("[type='checkbox']").off("click").on("click", t.onInput.bind(t)), t.$inp.filter("[type='text']").off("keyup").on("keyup", t.onInput.bind(t)))
            },
            clear: function() {
                var t = this.that,
                    e = this.column,
                    n = this.cond0,
                    i = this.getType(n),
                    r = e.dataIndx;
                t.filter({
                    rule: {
                        dataIndx: r,
                        condition: i ? n : void 0
                    },
                    oper: "remove"
                }), this.refreshRowFilter(), this.ready()
            },
            close: function() {
                this.$popup.remove()
            },
            filterByCond: function(t) {
                var e = this,
                    n = e.that,
                    i = e.column,
                    r = i.dataIndx,
                    o = e.cond0,
                    a = "" === o,
                    l = e.cond1,
                    s = e.filterRow;
                if (e.showHide(o, l), !s) var d = e.getModeVal(),
                    c = e.getType(o),
                    u = e.getVal(0),
                    h = u[0],
                    f = u[1],
                    p = e.getVal(1),
                    g = p[0],
                    v = p[1],
                    m = e.$gridR;
                "select" == c ? (t && n.filter({
                    oper: "add",
                    rule: {
                        dataIndx: r,
                        condition: o,
                        value: []
                    }
                }), s || e.iRange.create(m, e.filterUI[0], e.btnOk)) : t && n.filter({
                    oper: a ? "remove" : "add",
                    rule: {
                        dataIndx: r,
                        mode: d,
                        crules: [{
                            condition: o,
                            value: h,
                            value2: f
                        }, {
                            condition: l,
                            value: g,
                            value2: v
                        }]
                    }
                })
            },
            getBtnOk: function() {
                return this.$ok
            },
            getInp: function(t) {
                return this["$inp" + t]
            },
            getSel: function(t) {
                return this["$sel" + t]
            },
            getBtnClear: function() {
                return this.$clear
            },
            getHtmlInput: function(t) {
                var e = this.column.dataIndx,
                    n = this.filterUI[2 > t ? 0 : 1],
                    i = "checkbox",
                    r = n.type == i ? i : "text",
                    o = n.cls || "",
                    a = n.style || "",
                    l = n.attr || "",
                    s = ["name='", e, "' class='", o, "' style='width:100%;", a, "display:none;' ", l].join("");
                return "<input type='" + r + "' " + s + " />"
            },
            getHtml: function() {
                var t = this,
                    e = t.column,
                    n = e.filter,
                    i = t.menuH,
                    r = n.crules || [],
                    o = r[0] || n,
                    a = r[1] || {},
                    l = t.that.options,
                    s = t.cond0 = o.condition,
                    d = t.cond1 = a.condition,
                    c = t.filterRow;
                t.readFilterUI();
                var u = function(e, n) {
                        return ["<div style='margin:0 auto 4px;'>", t.getHtmlInput(e), "</div>", "<div style='margin:0 auto 4px;'>", t.getHtmlInput(n), "</div>"].join("")
                    },
                    h = pq.filter.getConditionsCol(this.column, t.filterUI[0]);
                return ["<div style='padding:4px;'>", "<div style='margin:0 auto 4px;'>", l.strCondition, " <select>", this.getOptionStr(h, s), "</select></div>", c ? "" : ["<div>", u(0, 1), "<div data-rel='grid' style='display:none;'></div>", i.singleFilter ? "" : ["<div class='filter_mode_div' style='text-align:center;display:none;margin:4px 0 4px;'>", "<label><input type='radio' name='pq_filter_mode' value='AND'/>AND</label>&nbsp;", "<label><input type='radio' name='pq_filter_mode' value='OR'/>OR</label>", "</div>", "<div style='margin:0 auto 4px;'><select>", this.getOptionStr(h, d, !0), "</select></div>", u(2, 3)].join(""), "</div>"].join(""), "<div style='margin:4px 0 0;'>", i.buttons.map(function(t) {
                    return "<button data-rel='" + t + "' type='button' style='width:calc(50% - 4px);margin:2px;' >" + (l["str" + pq.cap1(t)] || t) + "</button>"
                }).join(""), "</div>", "</div>"].join("")
            },
            getMode: function(t) {
                var e = this.$filter_mode;
                return t >= 0 ? e[t] : e
            },
            getModeVal: function() {
                return this.$filter_mode.filter(":checked").val()
            },
            getOptionStr: function(t, e, n) {
                var i, r = [""].concat(t),
                    o = this,
                    a = o.that.options.strConditions || {};
                return n && (r = r.filter(function(t) {
                    return "select" != o.getType(t)
                })), i = r.map(function(t) {
                    var n = e == t ? "selected" : "";
                    return '<option value="' + t + '" ' + n + ">" + (a[t] || t) + "</option>"
                }).join("")
            },
            getType: function(t) {
                return pq.filter.getType(t, this.column)
            },
            getVal: function(t) {
                var e, n, i = this.column,
                    r = this["cond" + t],
                    o = this["$inp" + (t ? "2" : "0")],
                    a = o[0],
                    l = this["$inp" + (t ? "3" : "1")];
                if (o.is("[type='checkbox']")) {
                    var s = a.indeterminate;
                    e = a.checked ? !0 : s ? null : !1
                } else o.is(":visible") && (e = pq.deFormat(i, o.val(), r)), l.is(":visible") && (n = pq.deFormat(i, l.val(), r));
                return [e, n]
            },
            init: function(t) {
                var e = this.column = t.column;
                e.filter = e.filter || {}, this.that = t.grid, this.menuH = t.menuH, this.$popup = t.$popup, this.filterRow = t.filterRow
            },
            initControls: function() {
                var e = this.filterUI[0],
                    n = this.that,
                    i = {
                        column: this.column,
                        headMenu: !0
                    };
                i.$editor = t([this.$inp0[0], this.$inp1[0]]), i.condition = this.cond0, i.type = e.type, i.filterUI = e, e.init.find(function(t) {
                    return t.call(n, i)
                }), e = this.filterUI[1], i.$editor = t([this.$inp2[0], this.$inp3[0]]), i.condition = this.cond1, i.type = e.type, i.filterUI = e, e.init.find(function(t) {
                    return t.call(n, i)
                })
            },
            isInputHidden: function(t) {
                return "select" != t && t ? void 0 : !0
            },
            ok: function() {
                var t = this.cond0;
                "select" != this.getType(t) || this.filterRow ? t && this.filterByCond(!0) : this.iRange.change(!0), this.close(), this.refreshRowFilter()
            },
            onModeChange: function() {
                this.filterByCond(!this.btnOk)
            },
            onInput: function(e) {
                var n = t(e.target),
                    i = !this.btnOk;
                n.is(":checkbox") && n.pqval({
                    incr: !0
                }), this.filterByCond(i), i && this.refreshRowFilter()
            },
            onSel1Change: function() {
                var t = !this.btnOk;
                this.cond0 = this.getSel(0).val(), this.readFilterUI(), this.filterRow || (this.$inp0.replaceWith(this.getHtmlInput(0)), this.$inp1.replaceWith(this.getHtmlInput(1)), this.refreshInputVarsAndEvents(), this.initControls()), this.filterByCond(t), this.refreshRowFilter()
            },
            onSel2Change: function() {
                this.cond1 = this.getSel(1).val(), this.readFilterUI(), this.$inp2.replaceWith(this.getHtmlInput(2)), this.$inp3.replaceWith(this.getHtmlInput(3)), this.refreshInputVarsAndEvents(), this.initControls(), this.filterByCond(!this.btnOk)
            },
            ready: function(e) {
                this.node = e = e || this.node;
                var n, i, r, o = t(e),
                    a = this,
                    l = a.that,
                    s = a.column,
                    d = s.filter,
                    c = d.crules || [],
                    u = c[0] || d,
                    h = c[1] || {},
                    f = a.cond0 = u.condition,
                    p = a.cond1 = h.condition,
                    g = a.readFilterUI();
                a.iRange = new pq.cFilterMenu.select(l, s), n = a.getType(f), i = a.getType(p), r = a.$select = o.find("select"), a.$sel0 = t(r[0]).val(f), a.$sel1 = t(r[1]).val(p), a.$filter_mode = o.find('[name="pq_filter_mode"]'), a.$clear = o.find("[data-rel='clear']"), a.$ok = o.find("[data-rel='ok']"), a.btnOk = a.$ok.length, a.filterRow || (a.refreshInputVarsAndEvents(), a.$gridR = o.find("[data-rel='grid']"), a.$filter_mode.filter("[value=" + d.mode + "]").attr("checked", "checked"), a.$filter_mode_div = o.find(".filter_mode_div"), a.showHide(f, p), "select" == n ? a.iRange.create(a.$gridR, g[0], a.btnOk) : a.readyInput(0, n, u), a.readyInput(1, i, h), a.initControls())
            },
            readyInput: function(t, e, n) {
                var i = this.column,
                    r = this["cond" + t],
                    o = this["$inp" + (t ? "2" : "0")],
                    a = this["$inp" + (t ? "3" : "1")];
                o.is(":checkbox") && o.pqval({
                    val: n.value
                }), o.val(pq.formatEx(i, n.value, r)), "textbox2" == e && a.val(pq.formatEx(i, n.value2, r))
            },
            readFilterUI: function() {
                var t = this.filterUI = [],
                    e = this.that,
                    n = {
                        column: this.column,
                        condition: this.cond0,
                        indx: 0,
                        headMenu: !0
                    };
                return t[0] = pq.filter.getFilterUI(n, e), n.condition = this.cond1, n.indx = 1, t[1] = pq.filter.getFilterUI(n, e), t
            },
            refreshInputVarsAndEvents: function() {
                var e = this,
                    n = e.column,
                    i = e.$inp = t(this.node).find("input[name='" + n.dataIndx + "']"),
                    r = i[0],
                    o = i[1],
                    a = i[2],
                    l = i[3];
                e.$inp0 = t(r), e.$inp1 = t(o), e.$inp2 = t(a), e.$inp3 = t(l), e.addEventsInput()
            },
            refreshRowFilter: function() {
                this.that.refreshHeaderFilter({
                    dataIndx: this.column.dataIndx
                })
            },
            SelectGrid: function() {
                return this.$gridR.pqGrid("instance")
            },
            showHide: function(t, e) {
                if (!this.filterRow) {
                    var n, i = this,
                        r = i.$filter_mode_div,
                        o = i.$sel1,
                        a = i.getType(t),
                        l = i.$inp;
                    "select" === a ? (i.$gridR.show(), i.$gridR.hasClass("pq-grid") && i.$gridR.pqGrid("destroy"), l.hide(), r.hide(), o.hide()) : (i.$gridR.hide(), t ? (i.$inp0[i.isInputHidden(a) ? "hide" : "show"](), i.$inp1["textbox2" === a ? "show" : "hide"](), r.show(), o.show(), e ? (n = i.getType(e), i.$inp2[i.isInputHidden(n) ? "hide" : "show"](), i.$inp3["textbox2" === n ? "show" : "hide"]()) : (i.$inp2.hide(), i.$inp3.hide())) : (l.hide(), r.hide(), o.hide()))
                }
            },
            updateConditions: function() {
                var t = this.column.filter;
                t.crules = t.crules || [{}], t.crules[0].condition = this.cond0, this.cond1 && (t.crules[1] = t.crules[1] || {}, t.crules[1].condition = this.cond1)
            }
        }
    }(jQuery),
    function(t) {
        var e = t.paramquery;
        t(document).on("pqGrid:bootup", function(t, n) {
            var i = n.instance;
            new e.cEditor(i)
        }), e.cEditor = function(t) {
            var e = this;
            e.that = t, t.on("editorBeginDone", function(t, n) {
                n.$td[0].edited = !0, e.fixWidth(n), setTimeout(function() {
                    document.body.contains(n.$editor[0]) && e.fixWidth(n)
                })
            }).on("editorEnd", function(t, n) {
                n.$td[0].edited = !1, cancelAnimationFrame(e.id)
            }).on("editorKeyDown", function(t, n) {
                e.id = requestAnimationFrame(function() {
                    e.fixWidth(n)
                })
            })
        }, e.cEditor.prototype = {
            escape: function(t) {
                return t = t.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/</g, "&lt;"), t.replace(/(\n)$/, "$1A")
            },
            fixWidth: function(e) {
                var n, i = this,
                    r = i.that,
                    o = e.$td,
                    a = o[0],
                    l = a.offsetWidth,
                    s = a.offsetHeight,
                    d = r.widget(),
                    c = e.$editor,
                    u = c[0].type;
                if ("text" == u || "textarea" == u) {
                    var h = i.escape(c.val()),
                        f = d.width(),
                        p = t("<span style='position:absolute;top:0;left:0;visibilty:hidden;'><pre>" + h + "</pre></span>").appendTo(d),
                        g = parseInt(p.width()) + 25;
                    if (p.remove(), g = g > f ? f : g > l ? g : l, "textarea" == u) {
                        var v = c.clone().appendTo(d),
                            m = v[0];
                        v.css({
                            height: 18,
                            width: g,
                            position: "absolute",
                            left: 0,
                            top: 0,
                            overflow: "hidden"
                        }), n = m.scrollHeight + 5, v.remove(), c.css({
                            height: n,
                            width: g,
                            resize: "none",
                            overflow: "hidden"
                        })
                    }
                } else g = l, n = s;
                c.css("width", g + "px"), i.position(c, d, o)
            },
            position: function(t, e, n) {
                t.closest(".pq-editor-outer").css("border-width", "0").position({
                    my: "left center",
                    at: "left center",
                    of: n,
                    collision: "fit",
                    within: e
                })
            }
        }
    }(jQuery),
    function(t) {
        var e = window.pq,
            n = e.cVirtual = function() {
                this.diffH = 0, this.diffV = 0
            };
        n.setSBDim = function() {
            var e = t("<div style='max-width:100px;height:100px;position:fixed;left:0;top:0;overflow:auto;visibility:hidden;'><div style='width:200px;height:100px;'></div></div>").appendTo(document.body),
                n = e[0];
            this.SBDIM = n.offsetHeight - n.clientHeight, e.remove()
        }, n.prototype = {
            assignTblDims: function(t) {
                var e, n = this,
                    i = n.isBody(),
                    r = !0,
                    o = n.getTopSafe(this[t ? "cols" : "rows"], t, r),
                    a = n.maxHt;
                o > a ? (n[t ? "ratioH" : "ratioV"] = o / a, n[t ? "virtualWd" : "virtualHt"] = o, o = a) : (o = o || (n.isHead() ? 0 : 1), n[t ? "ratioH" : "ratioV"] = 1);
                var l = n.$tbl_right[0],
                    s = n[t ? "$tbl_tr" : "$tbl_left"],
                    d = s.length ? s[0] : {
                        style: {}
                    },
                    c = t ? "width" : "height";
                l.style[c] = o + "px", d.style[c] = o + "px", e = i ? "Tbl" : n.isHead() ? "TblHead" : "TblSum", !i && t && n.$spacer.css("left", o), n.dims[t ? "wd" + e : "ht" + e] = o, i && n.triggerTblDims(100)
            },
            calInitFinal: function(t, e, n) {
                var i, r, o, a = this[n ? "cols" : "rows"],
                    l = this[n ? "freezeCols" : "freezeRows"],
                    s = this[n ? "leftArr" : "topArr"],
                    d = this.getTopSafe(l, n);
                if (n && (d -= this.numColWd), t += d, e += d, a > l && s[l] < t) {
                    for (var c, u = 30, h = a; u--;)
                        if (c = Math.floor((l + h) / 2), s[c] >= t) h = c;
                        else {
                            if (l == c) {
                                o = !0;
                                break
                            }
                            l = c
                        }
                    if (!o) throw "ri not found"
                }
                for (; a >= l; l++)
                    if (s[l] > t) {
                        i = l ? l - 1 : l;
                        break
                    }
                for (; a >= l; l++)
                    if (s[l] > e) {
                        r = l - 1;
                        break
                    }
                return null == i && null == r && a && t > s[a - 1] ? [null, null] : (null == i && (i = 0), null == r && (r = a - 1), [i, r])
            },
            calInitFinalSuper: function() {
                var t = this,
                    e = this.dims || {},
                    n = t.calcTopBottom(),
                    i = n[0],
                    r = n[1],
                    o = n[2],
                    a = t.calcTopBottom(!0),
                    l = a[0],
                    s = a[1],
                    d = t.calInitFinal(i, r),
                    c = d[0],
                    u = d[1],
                    h = t.calInitFinal(l, s, !0),
                    f = h[0],
                    p = h[1];
                return this.isBody() && (e.bottom = r, e.top = i, e.left = l, e.right = s), o = o || a[2], [c, f, u, p, o]
            },
            calcTopBottom: function(t) {
                var e, i, r = this,
                    o = r.isBody(),
                    a = r.dims,
                    l = r.$cright[0];
                if (t) var s = l.scrollLeft,
                    d = r.sleft,
                    c = a.wdCont,
                    u = r.wdContLeft,
                    h = r.ratioH;
                else s = l.scrollTop, d = r.stop, c = r.htCont, u = r.htContTop, h = r.ratioV;
                if (s = 0 > s ? 0 : s, 1 == h) return i = s + c - u, i >= 0 || (i = 0), [s, i];
                var f, p, g, v = n.maxHt,
                    m = r[t ? "virtualWd" : "virtualHt"],
                    w = t ? a.wdContClient : a.htContClient,
                    x = t ? "diffH" : "diffV",
                    y = r[x],
                    C = c - w;
                if (s + w >= v ? (i = m - u + C, e = i - c + u) : (0 == s ? e = 0 : (f = null == d || Math.abs(s - d) > c ? h : 1, e = s * f + (1 == f && y ? y : 0)), i = e + c - u), p = e - s, p != y && (g = !0, r[x] = p, o && r.triggerTblDims(3e3)), r[t ? "sleft" : "stop"] = s, !(s >= 0)) throw "stop NaN";
                if (!(i >= 0 && e >= 0)) throw "top bottom NaN";
                return [e, i, g]
            },
            getHtDetail: function(t, e) {
                var n = t.pq_detail;
                return n && n.show ? n.height || e : 0
            },
            getTop: function(t, e) {
                var n = this.topArr[t],
                    i = e ? 0 : this.diffV;
                if (i && (n -= t > this.freezeRows ? i : 0, 0 > n && (n = 0)), n >= 0) return n;
                throw n
            },
            getTopSafe: function(t, e, n) {
                var i = e ? this.cols : this.rows;
                return this[e ? "getLeft" : "getTop"](t > i ? i : t, n)
            },
            getLeft: function(t, e) {
                var n = this.numColWd,
                    i = -1 == t ? 0 : this.leftArr[t] + n,
                    r = e ? 0 : this.diffH;
                if (r && (i -= t > this.freezeCols ? r : 0, 0 > i && (i = 0)), i >= 0) return i;
                throw i
            },
            getHeightR: function(t, e) {
                e = e || 1;
                var n = this.topArr,
                    i = n[t + e] - n[t];
                if (i >= 0) return i;
                throw i
            },
            getHeightCell: function(t, e) {
                e = e || 1;
                var n, i, r = this.topArr,
                    o = this.rowHtDetail;
                if (n = o ? this.getHtDetail(this.data[t + e - 1], o) : 0, i = r[t + e] - r[t] - n, i >= 0) return i;
                throw i
            },
            getHeightCellM: function(t, e) {
                return this.getTopSafe(t + e) - this.getTop(t)
            },
            getHeightCellDirty: function(t, e) {
                return this.setTopArr(t, null, t + e), this.getHeightCellM(t, e)
            },
            getWidthCell: function(t) {
                if (-1 == t) return this.numColWd;
                var e = this.colwdArr[t];
                if (e >= 0) return e;
                throw e
            },
            getWidthCellM: function(t, e) {
                return this.getTopSafe(t + e, !0) - this.getLeft(t)
            },
            initRowHtArr: function() {
                var t, e = this.rowHt,
                    n = this.data,
                    i = n.length,
                    r = this.rowHtDetail,
                    o = this.rowhtArr = [],
                    a = (this.topArr = [], 0);
                if (r)
                    for (; i > a; a++) t = n[a], o[a] = t.pq_hidden ? 0 : t.pq_ht || e + this.getHtDetail(t, r);
                else
                    for (; i > a; a++) t = n[a], o[a] = t.pq_hidden ? 0 : t.pq_ht || e
            },
            initRowHtArrDetailSuper: function(t) {
                var e, n = this.rowhtArr,
                    i = this.data;
                t.forEach(function(t) {
                    e = t[0], n[e] = i[e].pq_ht = n[e] + t[1]
                }), this.setTopArr(), this.assignTblDims()
            },
            initRowHtArrSuper: function() {
                this.initRowHtArr(), this.setTopArr(), this.assignTblDims()
            },
            refreshRowHtArr: function(t, e) {
                var n = this.data[t],
                    i = this.rowHtDetail,
                    r = this.rowHt;
                this.rowhtArr[t] = n.pq_hidden ? 0 : r + this.getHtDetail(n, i), e && (this.setTopArr(t), this.assignTblDims())
            },
            setTopArr: function(t, e, n) {
                var i, r, o, a, l, s = t || 0,
                    d = this;
                for (e ? (r = d.cols, a = d.colwdArr, l = d.leftArr) : (r = d.rows, a = d.rowhtArr, l = d.topArr), o = n && r > n ? n : r - 1, i = s ? l[s] : 0; o >= s; s++) l[s] = i, i += a[s];
                l[s] = i, l.length = r + 1
            },
            triggerTblDims: function(t) {
                var e = this;
                e.setTimer(function() {
                    e.that._trigger("assignTblDims")
                }, "assignTblDims", t)
            }
        }
    }(jQuery),
    function(t) {
        var e = 1533910;
        t(function() {
            var n = t("<div style='position:relative;'></div>").appendTo(document.body),
                i = t("<div style='position:absolute;left:0;'></div>").appendTo(n)[0],
                r = 1e9,
                o = pq.cVirtual;
            i.style.top = r + "px";
            var a = i.offsetTop - 50;
            e = 1e4 >= a ? e : a, e > 16554378 && (e = 16554378), o.maxHt = e, n.remove(), o.setSBDim(), t(window).on("resize", o.setSBDim.bind(o))
        })
    }(jQuery),
    function(t) {
        var e = window.pq = window.pq || {};
        e.cRender = function() {
            this.data = []
        }, e.cRender.prototype = t.extend({}, {
            _m: function() {},
            autoHeight: function(t) {
                var e = this,
                    n = e.that,
                    i = e.isBody(),
                    r = t.hChanged,
                    o = e.freezeRows,
                    a = !1,
                    l = e.initV,
                    s = e.finalV;
                e.rows && (i && n._trigger("beforeAutoRowHeight"), a = e.setRowHtArr(l, s, r), a = e.setRowHtArr(0, o - 1, r) || a, a ? (e.setTopArr(o ? 0 : l), e.assignTblDims(), e.setPanes(), e.setCellDims(!0), i && (t.source = "autoRow", e.refresh(t), n._trigger("autoRowHeight"))) : e.setCellDims(!0))
            },
            autoWidth: function(t) {
                var e = this,
                    n = e.freezeCols,
                    i = e.initH,
                    r = e.finalH;
                null == t ? (e.setColWdArr(i, r), e.setColWdArr(0, n - 1)) : e.setColWdArr(t, t)
            },
            _each: function(t, e, n, i, r, o) {
                for (var a, l = this, s = l.jump, d = 0; n >= d; d++) d = s(e, o, d), a = i[d], a[r] || t.call(l, a, d)
            },
            eachV: function(t) {
                var e = this;
                e._each(t, e.initV, e.finalV, e.data, "pq_hidden", e.freezeRows)
            },
            eachH: function(t) {
                var e = this;
                e._each(t, e.initH, e.finalH, e.colModel, "hidden", e.freezeCols)
            },
            generateCell: function(t, e, n, i, r, o) {
                var a, l, s, d, c, u, h, f, p = this.iMerge,
                    g = [],
                    v = this.riOffset,
                    m = t + v,
                    w = [this.cellCls];
                if (this._m() && (f = p.ismergedCell(m, e))) {
                    if (!f.o_rc) return t == this._initV || e == this._initH ? (c = this.getCellRegion(t, e), d = p.getRootCell(m, e), l = d.v_ri - v, s = d.v_ci, 0 > l ? "" : (u = this.getCellRegion(l, s), this.mcLaid[l + "," + s + (u == c ? "" : "," + c)] = !0, "")) : "";
                    d = p.getClsStyle(m, e), d.style && g.push(d.style), d.cls && w.push(d.cls), m = f.o_ri, t = m - v, n = this.data[t], e = f.o_ci, i = this.colModel[e], o = this.getHeightCellM(t, f.o_rc), a = this.getWidthCellM(e, f.o_cc), w.push("pq-merge-cell")
                } else if (n.pq_hidden || i.hidden) return "";
                if (h = this.getCellId(t, e, r), this.getById(h)) return "";
                var x = o || this.getHeightCell(t),
                    y = a || this.colwdArr[e],
                    C = this.getLeft(e);
                return g.push("left:" + C + "px;width:" + y + "px;height:" + x + "px;"), this.renderCell({
                    style: g,
                    cls: w,
                    attr: ["role='gridcell' id='" + h + "'"],
                    rowData: n,
                    rowIndxPage: t,
                    rowIndx: m,
                    colIndx: e,
                    column: i
                })
            },
            generateRow: function(t, e) {
                var n = "pq-grid-row",
                    i = "top:" + this.getTop(t) + "px;height:" + this.getHeightR(t) + "px;width:100%;",
                    r = this.getRowId(t, e),
                    o = "role='row' id='" + r + "'",
                    a = this.getRowClsStyleAttr(t);
                return n += " " + a[0], i += a[1], o += " " + a[2], "<div class='" + n + "' " + o + " style='" + i + "'>"
            },
            getById: function(t) {
                return document.getElementById(t)
            },
            getCell: function(t, e, n) {
                var i, r, o = this.riOffset,
                    a = t + o;
                return n || (i = this.iMerge, i.ismergedCell(a, e) && (r = i.getRootCell(a, e), this.isHead() && (t = r.o_ri, e = r.o_ci), n = this.getCellRegion(r.v_ri - o, r.v_ci))), this.getById(this.getCellId(t, e, n))
            },
            getCellIndx: function(t) {
                var e = t.id.split("-");
                return e[3] == "u" + this.uuid ? [1 * e[4], 1 * e[5], e[6]] : void 0
            },
            getCellId: function(t, e, n) {
                return t >= this.data.length ? "" : (n = n || this.getCellRegion(t, e), this.cellPrefix + t + "-" + e + "-" + n)
            },
            getCellCont: function(t, e) {
                return this["$c" + this.getCellRegion(t, e)]
            },
            getCellCoords: function(t, e) {
                var n = this,
                    i = n.maxHt,
                    r = n.getTop(t),
                    o = n.getHeightCell(t),
                    a = r + o,
                    a = a > i ? i : a,
                    r = a - o,
                    l = n.getLeft(e),
                    s = n.getWidthCell(e),
                    d = l + s,
                    d = d > i ? i : d,
                    l = d - s;
                return [l, r, d, a]
            },
            getCellRegion: function(t, e) {
                var n = this.freezeCols,
                    i = this.freezeRows;
                return i > t ? n > e ? "lt" : "tr" : n > e ? "left" : "right"
            },
            getCellXY: function(t, e) {
                var n = this.maxHt,
                    i = Math.min(this.getLeft(e), n),
                    r = Math.min(this.getTop(t), n);
                return [i, r]
            },
            getContRight: function() {
                return this.$cright
            },
            getMergeCells: function() {
                return this._m() ? this.$tbl.children().children(".pq-merge-cell") : t()
            },
            getRow: function(t, e) {
                return this.getById(this.getRowId(t, e))
            },
            getAllCells: function() {
                return this.$ele.children().children().children().children().children(this.isHead() ? ".pq-grid-col" : ".pq-grid-cell")
            },
            get$Col: function(t, e) {
                var n = ["right", "left", "lt", "rt"].map(function(e) {
                    return "[id$=-" + t + "-" + e + "]"
                }).join(",");
                return (e || this.getAllCells()).filter(n)
            },
            get$Row: function(t) {
                return this.$ele.find("[id^=" + this.getRowId(t, "") + "]")
            },
            getRowClsStyleAttr: function(t) {
                var e = this.that,
                    n = [],
                    i = e.options,
                    r = i.rowInit,
                    o = this.data[t],
                    a = o.pq_rowcls,
                    l = o.pq_rowattr,
                    s = "",
                    d = "",
                    c = t + this.riOffset;
                if (r) {
                    var u = r.call(e, {
                        rowData: o,
                        rowIndxPage: t,
                        rowIndx: c
                    });
                    u && (u.cls && n.push(u.cls), s += u.attr ? " " + u.attr : "", d += u.style ? u.style : "")
                }
                if (i.stripeRows && this.stripeArr[t] && n.push("pq-striped"), o.pq_rowselect && n.push(e.iRows.hclass), a && n.push(a), l) {
                    var h = e.stringifyAttr(l);
                    for (var f in h) {
                        var p = h[f];
                        s += " " + f + '="' + p + '"'
                    }
                }
                return [n.join(" "), d, s]
            },
            getRowId: function(t, e) {
                if (null == e) throw "getRowId region.";
                return this.rowPrefix + t + "-" + e
            },
            getRowIndx: function(t) {
                var e = t.id.split("-");
                return [1 * e[4], e[5]]
            },
            getTable: function(t, e) {
                return this["$tbl_" + this.getCellRegion(t, e)]
            },
            getTblCls: function(t) {
                var e = this.isBody() ? [] : ["pq-grid-summary-table"];
                return t.rowBorders && e.push("pq-td-border-top"), t.columnBorders && e.push("pq-td-border-right"), t.wrap || e.push("pq-no-wrap"), e.join(" ")
            },
            getFlexWidth: function() {
                return this._flexWidth
            },
            preInit: function(t) {
                var e = this,
                    n = e.isBody(),
                    i = e.isHead(),
                    r = e.that,
                    o = r.options,
                    a = (o.freezeCols || 0, i ? 0 : o.freezeRows, "pq-table " + e.getTblCls(o)),
                    l = ["pq-cont-inner ", "pq-cont-right", "pq-cont-left", "pq-cont-lt", "pq-cont-tr"];
                t.empty(), t[0].innerHTML = ['<div class="pq-grid-cont">', n ? '<div class="pq-grid-norows">' + o.strNoRows + "</div>" : "", '<div class="', l[0] + l[1], '"><div class="pq-table-right ' + a + '"></div>', n ? "" : '<div class="pq-r-spacer" style="position:absolute;top:0;height:10px;"></div>', "</div>", '<div class="' + l[0] + l[2] + '"><div class="pq-table-left ' + a + '"></div></div>', '<div class="' + l[0] + l[4] + '"><div class="pq-table-tr ' + a + '"></div></div>', '<div class="' + l[0] + l[3] + '"><div class="pq-table-lt ' + a + '"></div></div>', "</div>"].join(""), e.$cright = t.find("." + l[1]).on("scroll", e.onNativeScroll(e)), n || (e.$spacer = t.find(".pq-r-spacer")), e.$cleft = t.find("." + l[2]).on("scroll", e.onScrollL), e.$clt = t.find("." + l[3]).on("scroll", e.onScrollLT), e.$ctr = t.find("." + l[4]).on("scroll", e.onScrollT), e.$tbl = t.find(".pq-table").on("scroll", e.onScrollLT), e.$tbl_right = t.find(".pq-table-right"), e.$tbl_left = t.find(".pq-table-left"), e.$tbl_lt = t.find(".pq-table-lt"), e.$tbl_tr = t.find(".pq-table-tr"), n && e.$cleft.add(e.$ctr).on("mousewheel DOMMouseScroll", e.onMouseWheel(e))
            },
            isBody: function() {},
            isHead: function() {},
            isSum: function() {},
            jump: function(t, e, n) {
                return t > n && n >= e && (n = t), n
            },
            hasMergeCls: function(t) {
                return t && t.className.indexOf("pq-merge-cell") >= 0
            },
            initRefreshTimer: function(t) {
                var e = this;
                e.setTimer(e.onRefreshTimer(e, t), "refresh")
            },
            initStripeArr: function() {
                for (var t, e = this.rows, n = 0, i = this.stripeArr = [], r = this.data; e > n; n++) r[n].pq_hidden || (t = i[n] = !t)
            },
            isRenderedRow: function(t) {
                return !!this.getRow(t)
            },
            onScrollLT: function() {
                this.scrollTop = this.scrollLeft = 0
            },
            onScrollT: function() {
                this.scrollTop = 0
            },
            onScrollL: function() {
                this.scrollLeft = 0
            },
            refresh: function(t) {
                t = t || {};
                var e = this,
                    n = e.that,
                    i = e.isBody(),
                    r = e.isHead(),
                    o = (null == t.timer ? !0 : t.timer, e.mcLaid = {}),
                    a = e.freezeCols,
                    l = e.numColWd,
                    s = !(!a && !l),
                    d = e.freezeRows,
                    c = e.calInitFinalSuper(),
                    u = c[0],
                    h = c[1],
                    f = c[2],
                    p = c[3],
                    g = c[4],
                    v = e.initV,
                    m = e.finalV,
                    w = e.initH,
                    x = e.finalH;
                i && n.blurEditor({
                    force: !0
                }), e._initV = u, e._finalV = f, e._initH = h, e._finalH = p, i && n._trigger("beforeTableView", null, {
                    initV: u,
                    finalV: f,
                    pageData: e.data
                }), g || (null != m && f >= v && m >= u && (u > v ? (e.removeView(v, u - 1, w, x), s && e.removeView(v, u - 1, l ? -1 : 0, a - 1)) : v > u && (e.renderView(u, v - 1, h, p), s && e.renderView(u, v - 1, 0, a - 1)), m > f ? (e.removeView(f + 1, m, w, x), s && e.removeView(f + 1, m, l ? -1 : 0, a - 1)) : f > m && (e.renderView(m + 1, f, h, p), s && e.renderView(m + 1, f, 0, a - 1)), v = u, m = f), null != x && p > w && x > h && (h > w ? (e.removeView(v, m, w, h - 1), d && e.removeView(0, d - 1, w, h - 1)) : w > h && (e.renderView(v, m, h, w - 1), d && e.renderView(0, d - 1, h, w - 1)), x > p ? (e.removeView(v, m, p + 1, x), d && e.removeView(0, d - 1, p + 1, x)) : p > x && (e.renderView(v, m, x + 1, p), d && e.renderView(0, d - 1, x + 1, p)), w = h, x = p)), g || f !== m || u !== v || h !== w || p !== x ? (i && n._trigger("beforeViewEmpty", null, {
                    region: "right"
                }), e.$tbl_right.empty(), e.renderView(u, f, h, p), !s || f === m && u === v || (e.$tbl_left.empty(), e.renderView(u, f, 0, a - 1)), d && (h === w && p === x || (n._trigger("beforeViewEmpty", null, {
                    region: "tr"
                }), e.$tbl_tr.empty(), e.renderView(0, d - 1, h, p)), s && null == m && (e.$tbl_lt.empty(), e.renderView(0, d - 1, 0, a - 1)))) : e.removeMergeCells();
                for (var y in o) {
                    var c = y.split(","),
                        C = 1 * c[0],
                        b = 1 * c[1],
                        I = c[2];
                    e.renderView(C, C, b, b, I)
                }
                var _ = h != e.initH || p != e.finalH,
                    q = _ && null != e.initH;
                (f != e.finalV || u != e.initV || _) && (e.initV = u, e.finalV = f, e.initH = h, e.finalH = p, i ? n._trigger("refresh", null, {
                    source: t.source,
                    hChanged: q
                }) : n._trigger(r ? "refreshHeader" : "refreshSum", null, {
                    hChanged: q
                }))
            },
            refreshAllCells: function(t) {
                var e = this;
                e.initH = e.initV = e.finalH = e.finalV = null, e.refresh(t)
            },
            refreshCell: function(e, n, i, r) {
                var o, a = this,
                    l = a.isBody() && a._m() ? a.iMerge.getRootCellV(e + a.riOffset, n) : 0,
                    s = e,
                    d = n,
                    c = function(l, s) {
                        l && (o = !0, l.id = "", t(l).replaceWith(a.generateCell(e, n, i, r, s)))
                    };
                return l ? (e = l.rowIndxPage, n = l.colIndx, i = l.rowData, r = l.column, ["lt", "tr", "left", "right"].forEach(function(t) {
                    c(a.getCell(s, d, t), t)
                })) : c(a.getCell(e, n)), o
            },
            removeMergeCells: function() {
                for (var e, n, i, r, o, a, l, s, d, c, u = this, h = u.iMerge, f = u.riOffset, p = (u.freezeCols, u.freezeRows, u.getMergeCells()), g = u._initH, v = u._finalH, m = u._initV, w = u._finalV, x = 0, y = p.length; y > x; x++) s = p[x], n = u.getCellIndx(s), n && (i = n[0], r = n[1], d = n[2], e = h.getRootCell(i + f, r), o = i + e.o_rc - 1, a = r + e.o_cc - 1, l = !1, i > w || r > v ? l = !0 : "right" == d ? (m > o || g > a) && (l = !0) : "left" == d ? m > o && (l = !0) : "tr" == d && g > a && (l = !0), c = s.parentNode, l && t(s).remove(), c.children.length || c.parentNode.removeChild(c))
            },
            removeView: function(e, n, i, r) {
                var o, a, l, s, d = this.getCellRegion(e, i);
                for (a = e; n >= a; a++)
                    if (o = this.getRow(a, d)) {
                        for (l = i; r >= l; l++) s = this.getCell(a, l, d), s && (this.hasMergeCls(s) || t(s).remove());
                        o.children.length || o.parentNode.removeChild(o)
                    }
            },
            renderNumCell: function(t, e, n) {
                var i = this,
                    r = i.getHeightR(t),
                    o = i.isHead(),
                    a = i.getCellId(t, -1, n),
                    l = "position:absolute;left:0;top:0;width:" + e + "px;height:" + r + "px;";
                return "<div id='" + a + "' style='" + l + "' role='gridcell' class='pq-grid-number-cell '>" + (i.isBody() ? t + 1 + i.riOffset : o && t == i.data.length - 1 ? i.numberCell.title || "" : "") + "</div>"
            },
            renderRow: function(e, n, i, r, o, a) {
                var l, s, d, c, u = this.getRow(i, a),
                    h = this.numColWd,
                    f = [],
                    p = this.getHeightCell(i),
                    g = this.colModel;
                for (!u && e.push(this.generateRow(i, a)), 0 != r || !h || "left" != a && "lt" != a || (c = this.renderNumCell(i, h, a), f.push(c)), d = r; o >= d; d++) s = g[d], s.hidden || (c = this.generateCell(i, d, n, s, a, p), f.push(c));
                l = f.join(""), u ? t(u).append(l) : e.push(l, "</div>")
            },
            renderView: function(t, e, n, i, r) {
                if (null != n && null != i) {
                    r = r || this.getCellRegion(t, Math.min(n, i));
                    for (var o, a = [], l = this.data, s = this["$tbl_" + r], d = t; e >= d; d++) o = l[d], o && !o.pq_hidden && this.renderRow(a, o, d, n, i, r);
                    s.append(a.join(""))
                }
            },
            scrollX: function(t, e) {
                var n = this.$cright[0];
                return t >= 0 ? void this.scrollXY(t, n.scrollTop, e) : n.scrollLeft
            },
            setCellDims: function(t) {
                var e, n, i = this,
                    r = i.iMerge,
                    o = i._m(),
                    a = i.colModel,
                    l = i.numColWd,
                    s = i.jump,
                    d = i.setRowDims(),
                    c = i.riOffset,
                    u = i.initH,
                    h = i.finalH,
                    f = i.freezeCols;
                i.eachV(function(p, g) {
                    var v, m = i.get$Row(g),
                        w = i.getHeightR(g),
                        x = i.getTop(g),
                        y = i.getHeightCell(g);
                    d(m, w, x);
                    for (var C = l ? -1 : 0; h >= C; C++) C = s(u, f, C), (0 > C || !a[C].hidden) && (o && (e = r.ismergedCell(g + c, C)) || (v = i.getCell(g, C), v && (n = v.style, n.height = (-1 == C ? w : y) + "px", t || (n.width = i.getWidthCell(C) + "px", n.left = i.getLeft(C) + "px"))))
                });
                for (var p = i.getMergeCells(), g = 0, v = p.length; v > g; g++) {
                    var m = p[g],
                        w = i.getCellIndx(m);
                    if (w) {
                        var x = w[0],
                            y = w[1],
                            e = r.getRootCell(x + c, y),
                            C = e.v_ri - c,
                            b = i.get$Row(C),
                            I = i.getHeightR(C),
                            _ = i.getHeightCellM(x, e.o_rc),
                            q = i.getTop(C);
                        d(b, I, q), n = m.style, n.height = _ + "px", t || (n.width = i.getWidthCellM(y, e.o_cc) + "px", n.left = i.getLeft(y) + "px")
                    }
                }
            },
            setRowDims: function() {
                var t = this.isBody() && this.that.Anim().isActive();
                return function(e, n, i) {
                    var r = {
                        height: n,
                        width: "100%"
                    };
                    t || (r.top = i), e.css(r)
                }
            },
            setColWdArr: function(e, n) {
                var i, r, o, a, l, s, d, c, u = n,
                    h = this,
                    f = h.jump,
                    p = h.colModel,
                    g = h.data,
                    v = h.freezeRows,
                    m = this.maxHt + "px",
                    w = h.iMerge,
                    x = h.initV,
                    y = h.isBody(),
                    C = h.isSum(),
                    b = y || C,
                    I = h.isHead() ? h.that.headerCells.length - 1 : h.finalV;
                if (I >= 0)
                    for (; u >= e; u--)
                        if (r = p[u], !r.hidden && -1 == (r.width + "").indexOf("%") && (s = b ? r.width : r._minWidth)) {
                            for (i = 0; I >= i; i++)
                                if (i = f(x, v, i), a = g[i], a && !a.pq_hidden) {
                                    if (d = !0, c = w.ismergedCell(i, u)) {
                                        if (1 == c) continue;
                                        if (c = w.getRootCell(i, u), c.v_rc > 1 || c.v_cc > 1) {
                                            if (c.v_cc > 1) continue;
                                            d = !1
                                        }
                                        o = h.getCell(c.o_ri, c.o_ci)
                                    } else o = h.getCell(i, u);
                                    if (o.parentNode.style.width = m, d) {
                                        o.style.width = "auto";
                                        var _ = t(o).find(".pq-menu-icon,.pq-menu-filter-icon");
                                        if (_.length) {
                                            _.css({
                                                position: "static",
                                                "float": "left",
                                                width: 20
                                            });
                                            var q = t(o).find(".pq-td-div");
                                            q.css("width", "auto")
                                        }
                                    }
                                    l = o.offsetWidth + 1, d && _.length && (_.css({
                                        position: "",
                                        "float": "",
                                        width: ""
                                    }), q.css("width", "")), s = Math.max(l, s)
                                }
                            if (!(s > 0)) throw "wd NaN";
                            r.width = h.colwdArr[u] = s, r._resized = !0
                        }
            },
            setRowHtArr: function(t, e, n) {
                for (var i, r, o, a, l, s, d, c, u, h, f, p = e, g = this, v = g.jump, m = g.riOffset, w = g.rowhtArr, x = g.data, y = g.colModel, C = g._m(), b = g.diffV, I = g.freezeCols, _ = g.rowHt, q = g.iMerge, D = g.rowHtDetail, R = g.initH, M = g.finalH; p >= t; p--)
                    if (l = x[p], l && !l.pq_hidden) {
                        for (f = D ? g.getHtDetail(l, D) : 0, c = n ? w[p] - f : _, i = 0; M >= i; i++)
                            if (r = i, i = v(R, I, i), !y[i].hidden) {
                                if (u = C && q.ismergedCell(p + m, i)) {
                                    if (1 == u || b) continue;
                                    u = q.getRootCell(p + m, i), s = g.getCell(u.o_ri - m, u.o_ci)
                                } else s = g.getCell(p, i);
                                s.style.height = "auto", d = s.offsetHeight, u && (h = u.o_rc - (u.v_ri - u.o_ri) - 1, d -= u.v_rc > 1 ? g.getHeightCellDirty(u.v_ri + 1, h) : 0), c = Math.max(d, c)
                            }
                        a = c + f, w[p] != a && (w[p] = l.pq_ht = a, o = !0)
                    }
                return o
            },
            setTimer: function(t) {
                var e = {};
                return function(n, i, r) {
                    i = t + i, clearTimeout(e[i]);
                    var o = this;
                    e[i] = setTimeout(function() {
                        o.that.element && n.call(o)
                    }, r || 300)
                }
            }
        }, new e.cVirtual)
    }(jQuery),
    function(t) {
        pq.cRenderBody = function(t, e) {
            var n = this,
                i = n.uuid = t.uuid,
                r = t.options,
                o = n.$ele = e.$b,
                a = n.$sum = e.$sum,
                l = n.$h = e.$h,
                s = r.postRenderInterval;
            n.that = t, n.setTimer = n.setTimer(i), n.cellPrefix = "pq-body-cell-u" + i + "-", n.rowPrefix = "pq-body-row-u" + i + "-", n.cellCls = "pq-grid-cell", n.iMerge = t.iMerge, n.rowHt = r.rowHt || 27, n.rowHtDetail = r.detailModel.height, n.iRenderHead = t.iRenderHead = new pq.cRenderHead(t, l), n.iRenderSum = t.iRenderSum = new pq.cRenderSum(t, a), t.on("headHtChanged", n.onHeadHtChanged(n)), null != s && t.on("refresh refreshRow refreshCell refreshColumn", function() {
                0 > s ? n.postRenderAll() : n.setTimer(n.postRenderAll, "postRender", s)
            }), n.preInit(o), t.on("refresh softRefresh", n.onRefresh.bind(n))
        }, pq.cRenderBody.prototype = t.extend({}, new t.paramquery.cGenerateView, new pq.cRender, {
            setHtCont: function(t) {
                this.dims.htCont = t, this.$ele.css("height", t)
            },
            flex: function(t) {
                var e = this,
                    n = e.that;
                0 != n._trigger("beforeFlex", null, {
                    colIndx: t
                }) && (e.iRenderHead.autoWidth(t), e.iRenderSum.autoWidth(t), e.autoWidth(t), n.refreshCM(null, {
                    flex: !0
                }), n.refresh({
                    source: "flex",
                    soft: !0
                }))
            },
            init: function(t) {
                t = t || {};
                var e, n = this,
                    i = n.that,
                    r = t.soft,
                    o = !r,
                    a = t.source,
                    l = n.iRenderHead,
                    s = n.iRenderSum,
                    d = i.options,
                    c = d.scrollModel,
                    u = (n.freezeCols = d.freezeCols || 0, n.freezeRows = d.freezeRows, n.numberCell = d.numberCell),
                    h = n.colModel = i.colModel,
                    f = (n.width = d.width, n.height = d.height, n.$ele);
                o && (n.dims = i.dims, n.autoFit = c.autoFit, n.pauseTO = c.timeout, e = i.pdata || [], f.find(".pq-grid-norows").css("display", e.length ? "none" : ""), n.data = e, n.maxHt = pq.cVirtual.maxHt, n.riOffset = i.riOffset, n.cols = h.length, n.rows = e.length, i._mergeCells && (n._m = function() {
                    return !0
                }), n.autoRow = d.autoRow, n.initRowHtArrSuper(), d.stripeRows && n.initStripeArr()), n.refreshColumnWidths(), n.numColWd = l.numColWd = s.numColWd = u.show ? u.outerWidth : 0, n.initColWdArrSuper(), s.init(t), t.header ? l.init(t) : n.setPanes(), s.initPost(t), t.header && l.initPost(t), n.$cright[0].scrollTop > n.getTop(n.rows) || (o ? n.refreshAllCells({
                    source: a
                }) : r && (n.setCellDims(), n.refresh({
                    source: a
                }), i._trigger("softRefresh")))
            },
            initColWdArr: function() {
                for (var t, e = this.colModel, n = e.length, i = (this.leftArr = this.iRenderHead.leftArr = this.iRenderSum.leftArr = [], 0), r = this.colwdArr = this.iRenderHead.colwdArr = this.iRenderSum.colwdArr = []; n > i; i++) t = e[i], r[i] = t.hidden ? 0 : t.outerWidth
            },
            initColWdArrSuper: function() {
                this.initColWdArr(), this.setTopArr(0, !0), this.assignTblDims(!0)
            },
            inViewport: function(t, e, n) {
                n = n || this.getCell(t, e);
                var i = this.dims,
                    r = i.left - 2,
                    o = i.right - (i.wdCont - i.wdContClient) + 2,
                    a = i.top - 2,
                    l = i.bottom - (i.htCont - i.htContClient) + 2,
                    s = this.getCellRegion(t, e),
                    d = (this.initH, this.finalH, this.initV, this.finalV, n.parentNode),
                    c = n.offsetLeft - i.wdContLeft,
                    u = d.offsetTop - i.htContTop,
                    h = c + n.offsetWidth,
                    f = u + n.offsetHeight;
                return "right" == s ? c > r && o > h && u > a && l > f : "tr" == s ? c > r && o > h : "left" == s ? u > a && l > f : !0
            },
            isBody: function() {
                return !0
            },
            onHeadHtChanged: function(t) {
                return function(e, n) {
                    t.setPanes()
                }
            },
            onMouseWheel: function(t) {
                var e;
                return function(t) {
                    var n = this;
                    n.style["pointer-events"] = "none", clearTimeout(e), e = setTimeout(function() {
                        n.style["pointer-events"] = ""
                    }, 300)
                }
            },
            onNativeScroll: function(t) {
                return function() {
                    var e = t.$cright[0],
                        n = t.that,
                        i = e.scrollLeft,
                        r = e.scrollTop;
                    t.iRenderSum.setScrollLeft(i), t.iRenderHead.setScrollLeft(i), t.$cleft[0].scrollTop = r, t.$ctr[0].scrollLeft = i, t.refresh(), n._trigger("scroll"), t.setTimer(function() {
                        n._trigger("scrollStop")
                    }, "scrollStop", t.pauseTO)
                }
            },
            onRefresh: function(t, e) {
                "autoRow" != e.source && this.initRefreshTimer(e.hChanged)
            },
            onRefreshTimer: function(t, e) {
                return function() {
                    var n = t.$cright[0];
                    t.autoRow && t.autoHeight({
                        hChanged: e
                    }), n.scrollTop = n.scrollTop, n.scrollLeft = n.scrollLeft
                }
            },
            pageDown: function(t, e) {
                var n, i = this,
                    r = i.topArr,
                    o = r[t],
                    a = t,
                    l = i.dims,
                    s = this.$cright[0].scrollTop,
                    d = 95 * (l.htContClient - l.htContTop) / 100,
                    c = o + d,
                    u = t,
                    h = r.length - 1;
                i.scrollY(s + d, function() {
                    for (u = t < i.initV ? i.initV : t; h >= u; u++)
                        if (n = r[u], n > o && (o = n, a = u - 1), n > c) {
                            a = u - 1;
                            break
                        }
                    e(a)
                })
            },
            pageUp: function(t, e) {
                for (var n, i = this, r = i.topArr, o = r[t], a = this.$cright[0].scrollTop, l = i.dims, s = 80 * (l.htContClient - l.htContTop) / 100, d = o - s, c = t, u = t; u >= 0; u--)
                    if (n = r[u], o > n && (o = n, c = u), d > n) {
                        c = u;
                        break
                    }
                i.scrollY(a - s, function() {
                    e(c)
                })
            },
            postRenderAll: function() {
                var t, e, n, i = this,
                    r = i.that,
                    o = i.riOffset,
                    a = i.iMerge,
                    l = i.data;
                i.colModel;
                i.eachH(function(l, s) {
                    (n = l.postRender) && i.eachV(function(l, d) {
                        e = a.getRootCellO(d + o, s, !0), t = i.getCell(e.rowIndxPage, e.colIndx), t && !t._postRender && (e.cell = t, r.callFn(n, e), t._postRender = !0)
                    })
                }), (n = i.numberCell.postRender) && i.eachV(function(t, e) {
                    var a = i.getCell(e, -1),
                        s = e + o,
                        d = {
                            rowIndxPage: e,
                            colIndx: -1,
                            rowIndx: s,
                            rowData: l[s]
                        };
                    a && !a._postRender && (d.cell = a, r.callFn(n, d), a._postRender = !0)
                })
            },
            refreshRow: function(t) {
                var e, n, i = this,
                    r = i.initH,
                    o = i.finalH,
                    a = i.freezeCols,
                    l = i.get$Row(t),
                    s = [];
                l.each(function(t, e) {
                    var n = i.getRowIndx(e);
                    s.push(n[1])
                }), i.that._trigger("beforeViewEmpty", null, {
                    rowIndxPage: t
                }), l.remove(), s.forEach(function(l) {
                    "left" == l || "lt" == l ? (e = 0, n = a - 1) : (e = r, n = o), i.renderView(t, t, e, n, l)
                })
            },
            _scrollRow: function(t, e) {
                var n, i = this,
                    r = i.dims,
                    o = r[e ? "wdContClient" : "htContClient"],
                    a = e ? "scrollLeft" : "scrollTop",
                    l = i.$cright[0],
                    s = i[e ? "colModel" : "data"].length,
                    d = i[e ? "freezeCols" : "freezeRows"],
                    c = l[a],
                    u = r[e ? "wdContLeft" : "htContTop"];
                if (d > t || t > s - 1) return c;
                var h = i.getTopSafe(t, e),
                    f = i[e ? "getWidthCell" : "getHeightR"](t);
                return null != h ? (h + f + 1 > c + o ? n = h + f + 1 - o : c + u > h && (n = h - u, n = 0 > n ? 0 : n), n >= 0 ? n : c) : void 0
            },
            scrollColumn: function(t, e) {
                var n = this._scrollRow(t, !0);
                this.scrollX(n, e)
            },
            scrollRow: function(t, e) {
                var n = this._scrollRow(t);
                this.scrollY(n, e)
            },
            scrollCell: function(t, e, n) {
                var i = this._scrollRow(t),
                    r = this._scrollRow(e, !0);
                this.scrollXY(r, i, n)
            },
            scrollY: function(t, e) {
                var n = this.$cright[0];
                return null == t ? n.scrollTop : (t = t >= 0 ? t : 0, void this.scrollXY(n.scrollLeft, t, e))
            },
            scrollXY: function(t, e, n) {
                var i, r, o = this.$cright[0],
                    a = this.that,
                    l = o.scrollLeft,
                    s = o.scrollTop;
                return t >= 0 ? (o.scrollLeft = t, o.scrollTop = e, i = o.scrollLeft, r = o.scrollTop, n && (i == l && r == s ? n() : a.one("scroll", function() {
                    i == l ? n() : a.one("scrollHead", n)
                })), void 0) : [l, s]
            },
            getSBHt: function(t) {
                var e = this.dims,
                    n = this.that.options,
                    i = pq.cVirtual.SBDIM;
                return this.autoFit ? 0 : ("flex" != this.width || n.maxWidth) && t > e.wdCenter + i ? i : 0
            },
            getSBWd: function() {
                var t = this.dims;
                return t.htCenter ? pq.cVirtual.SBDIM : 0
            },
            setPanes: function() {
                var t, e, n, i = this,
                    r = i.that,
                    o = r.options,
                    a = i.autoFit,
                    l = i.dims,
                    s = l.htCenter - l.htHead - l.htSum,
                    d = l.wdCenter,
                    c = i.$ele,
                    u = i.freezeCols,
                    h = i.freezeRows,
                    f = i.$cright,
                    p = f[0],
                    g = i.$cleft,
                    v = i.$clt,
                    m = i.$ctr,
                    w = i.getLeft(u),
                    x = pq.cVirtual.SBDIM,
                    y = l.wdTbl,
                    C = Math.max(l.htTbl, 30) + i.getSBHt(y),
                    b = i.getTopSafe(h);
                m.css("display", h ? "" : "none"), g.css("display", w ? "" : "none"), v.css("display", w && h ? "" : "none"), f.css("overflow-y", ""), "flex" == i.height ? (s > 0 && C > s ? C = Math.min(C, s) : f.css("overflow-y", "hidden"), i.setHtCont(C)) : i.setHtCont(s), a && i.getSBWd() && f.css("overflow-y", "scroll"), f.css("overflow-x", a ? "hidden" : ""), "flex" == i.width ? (y = parseInt(c[0].style.height) >= l.htTbl - 1 ? y : y + x, o.maxWidth && y > d ? y = Math.min(y, d) : f.css("overflow-x", "hidden"), i._flexWidth = y, c.width(i._flexWidth)) : c.css("width", ""), i.htCont = l.htCont = f.height(), i.wdCont = l.wdCont = f.width(), l.htContClient = n = p.clientHeight, l.wdContClient = t = p.clientWidth, w > t && (f.css("overflow-x", "hidden"), w = t), g.css("width", w), v.css("width", w), m.width(t), g.height(n), e = p.offsetWidth, i.iRenderHead.setWidth(e, t), i.iRenderSum.setWidth(e, t), b > n && (f.css("overflow-y", "hidden"), b = n), v.css("height", b), m.css("height", b), i.wdContLeft = l.wdContLeft = g.width(), i.htContTop = l.htContTop = m.height()
            }
        }, new pq.cVirtual)
    }(jQuery),
    function(t) {
        function e(t) {
            this.that = t
        }
        t.paramquery.cMergeHead = e, e.prototype = {
            getRootCell: function(t, e) {
                for (var n = this.that, i = n.headerCells, r = i[t][e], o = r.rowSpan, a = r.leftPos; t && i[t - 1][a] == r;) t--;
                return {
                    v_ri: t,
                    o_ri: t,
                    v_ci: n.getNextVisibleCI(a),
                    o_ci: a,
                    v_rc: o,
                    o_rc: o,
                    v_cc: r.colSpan,
                    o_cc: r.o_colspan
                }
            },
            ismergedCell: function(t, e) {
                var n, i, r, o, a = this.that,
                    l = a.headerCells,
                    s = l[t],
                    d = s ? s[e] : "";
                if (d)
                    if (n = d.leftPos, 0 != t && l[t - 1][e] === d || (o = a.getNextVisibleCI(n)) != e) {
                        if (d.colSpan) return !0
                    } else if (i = d.rowSpan, r = d.colSpan, i && r && (i > 1 || r > 1)) return {
                    o_ri: t,
                    o_ci: n,
                    v_rc: i,
                    o_rc: i,
                    v_cc: r,
                    o_cc: d.o_colspan
                }
            },
            getClsStyle: function() {
                return {}
            }
        }
    }(jQuery),
    function(t) {
        pq.cRenderHS = t.extend({}, new pq.cRender, {
            init: function(t) {
                t = t || {};
                var e, n = this,
                    i = n.that,
                    r = i.options,
                    o = (n.freezeCols = r.freezeCols || 0, n.numberCell = r.numberCell, n.colModel = i.colModel),
                    a = n.isHead(),
                    l = n.isSum(),
                    s = a ? r.autoRowHead : r.autoRowSum,
                    d = (n.width = r.width, n.height = "flex", i.headerCells);
                n.freezeRows = 0;
                n.dims = i.dims, a ? e = n.data = r.showHeader ? r.filterModel.header ? d.concat([
                    []
                ]) : d : [] : l && (e = n.data = r.summaryData || []), n.maxHt = pq.cVirtual.maxHt, n.riOffset = 0, n.cols = o.length, n.rows = e.length, a ? d.length > 1 && (n._m = function() {
                    return !0
                }) : r.stripeRows && n.initStripeArr(), n.autoRow = null == s ? r.autoRow : s, n.initRowHtArrSuper(), n.assignTblDims(!0), n.setPanes()
            },
            initPost: function(t) {
                t = t || {};
                var e = this;
                e.autoRow;
                e.data.length && (t.soft ? (e.setCellDims(), e.refresh()) : e.refreshAllCells())
            },
            onNativeScroll: function(t) {
                return function() {
                    t.refresh(), t.isHead() && t.that._trigger("scrollHead")
                }
            },
            onRefresh: function(t, e) {
                this.initRefreshTimer(e.hChanged)
            },
            refreshHS: function() {
                this.init(), this.initPost()
            },
            setPanes: function() {
                var t = this,
                    e = t.that,
                    n = t.dims,
                    i = t.$ele,
                    r = t.freezeCols,
                    o = t.$cright,
                    a = o[0],
                    l = t.$cleft,
                    s = t.getLeft(r),
                    d = t.isHead(),
                    c = t.isSum(),
                    u = t.getTopSafe(t.rows);
                t.data.length;
                l.css("display", s ? "" : "none"), i.height(u), d ? (n.htHead = u, e._trigger("headHtChanged")) : c && (n.htSum = u, e._trigger("headHtChanged")), t.htCont = o.height(), t.wdCont = o.width(), l.css("width", s), l.height(a.clientHeight), t.wdContLeft = l.width(), t.htContTop = 0
            },
            setScrollLeft: function(t) {
                var e = this.$cright;
                e && this.scrollLeft !== t && (this.scrollLeft = e[0].scrollLeft = t)
            },
            setWidth: function(t, e) {
                this.$ele[0].style.width = t + "px", this.$spacer.width(t - e)
            }
        })
    }(jQuery),
    function(t) {
        var e = t.paramquery,
            n = pq.cRenderHead = function(t, n) {
                this.that = t;
                var i = t.options,
                    r = this,
                    o = r.uuid = t.uuid;
                r.iMerge = new e.cMergeHead(t), r.$ele = n, r.height = "flex", r.scrollTop = 0, r.rowHt = i.rowHtHead || 28, r.cellCls = "pq-grid-col", r.setTimer = r.setTimer(o), r.cellPrefix = "pq-head-cell-u" + o + "-", r.rowPrefix = "pq-head-row-u" + o + "-", r.preInit(n), n.on("click", function(t) {
                    return r.onHeaderClick(t)
                }), t.on("headerKeyDown", r.onHeaderKeyDown.bind(r)).on("refreshHeader softRefresh", r.onRefresh.bind(r))
            };
        n.prototype = t.extend({}, pq.cRenderHS, new e.cHeader, new e.cHeaderSearch, {
            getRowClsStyleAttr: function(t) {
                var e = this.that.headerCells.length,
                    n = "";
                return e == t ? n = "pq-grid-header-search-row" : t == e - 1 && (n = "pq-grid-title-row"), [n, "", ""]
            },
            getTblCls: function(t) {
                var e = "pq-grid-header-table";
                return t.hwrap ? e : e + " pq-no-wrap"
            },
            isHead: function() {
                return !0
            },
            onRefreshTimer: function(t, e) {
                return function() {
                    var n = t.$cright[0];
                    t.autoRow && t.autoHeight({
                        timer: !1,
                        hChanged: e
                    }), n.scrollTop = 0, n.scrollLeft = n.scrollLeft, t.onCreateHeader(), t.refreshResizeColumn(), t.refreshHeaderSortIcons(), t.that._trigger("refreshHeadAsync")
                }
            },
            _resizeId: function(t) {
                return "pq-resize-div-" + this.uuid + "-" + t
            },
            _resizeCls: function() {
                return "pq-resize-div-" + this.uuid
            },
            _resizeDiv: function(t) {
                return this.getById(this._resizeId(t))
            },
            refreshResizeColumn: function() {
                var t, e, n, i, r, o = this.initH,
                    a = this.colModel,
                    l = this._resizeCls(),
                    s = this.finalH,
                    d = this.numberCell,
                    c = this.freezeCols,
                    u = [],
                    h = [],
                    f = d.show ? -1 : 0;
                for (this.$ele.find("." + l).remove(); s >= f; f++) {
                    if (f >= o) e = h;
                    else {
                        if (!(c > f)) continue;
                        e = u
                    }
                    t = f >= 0 ? a[f] : d, t.hidden || t.resizable === !1 || this._resizeDiv(f) || (n = this.getLeft(f + 1), i = n - 5, r = this._resizeId(f), e.push("<div id='", r, "' pq-col-indx='", f, "' style='left:", i, "px;'", " class='pq-grid-col-resize-handle " + l + "'>&nbsp;</div>"))
                }
                u.length && this.$cleft.append(u.join("")), h.length && this.$cright.append(h.join(""))
            },
            renderCell: function(t) {
                var e, n = t.rowData,
                    i = t.rowIndx,
                    r = t.colIndx,
                    o = t.attr,
                    a = t.cls,
                    l = t.style,
                    s = n[r];
                return s ? this.createHeaderCell(i, r, s, o, a, l) : (e = this.renderFilterCell(t.column, r, a), "<div " + o + " class='" + a.join(" ") + "' style='" + l.join("") + "'>" + e + "</div>")
            }
        })
    }(jQuery),
    function(t) {
        var e = t.paramquery,
            n = pq.cRenderSum = function(t, e) {
                var n = t.options,
                    i = this,
                    r = i.uuid = t.uuid;
                i.that = t, i.iMerge = {
                    ismergedCell: function() {}
                }, i.$ele = e, i.height = "flex", i.scrollTop = 0, i.rowHt = n.rowHtSum || 27, i.cellCls = "pq-grid-cell", i.setTimer = i.setTimer(r), i.cellPrefix = "pq-sum-cell-u" + r + "-", i.rowPrefix = "pq-sum-row-u" + r + "-", i.preInit(e), t.on("refreshSum softRefresh", i.onRefresh.bind(i))
            };
        n.prototype = t.extend({}, new e.cGenerateView, pq.cRenderHS, {
            isSum: function() {
                return !0
            },
            onRefreshTimer: function(t, e) {
                return function() {
                    var n = t.$cright[0];
                    t.autoRow && t.autoHeight({
                        timer: !1,
                        hChanged: e
                    }), n.scrollTop = 0, n.scrollLeft = n.scrollLeft
                }
            }
        })
    }(jQuery);