! function(a) {
	var b, c = {
		_breaker: {},
		_start: null,
		each: function() {
			var a, b = function(b, d) {
				return b === c._breaker || Boolean(d) && c.elapsed() > a
			};
			return function(d, e, f) {
				var g, h;
				if (h = c.type(d), 1 === arguments.length) a = arguments[0];
				else if (f = c.extend({
						timeout: !1
					}, f), "object" === h && d.hasOwnProperty) {
					for (g in d)
						if (d.hasOwnProperty(g) && b(e(d[g], g), f.timeout)) break
				} else if (d)
					for (g = 0, h = d.length; g < h && !b(e(d[g], g), f.timeout); g++);
			}
		}(),
		extend: function(a) {
			var b, c, d, e, f = arguments.length;
			for (a = a || {}, c = 1; c < f; c++)
				if (e = arguments[c], void 0 !== e && null !== e)
					for (d in e) b = e[d], a !== b && void 0 !== b && (a[d] = b);
			return a
		},
		noop: function() {},
		type: function() {
			var a = function(a, b) {
				try {
					return ("function" == typeof window[b] || "object" == typeof window[b]) && a instanceof window[b]
				} catch (c) {}
				return !1
			};
			return function(b) {
				return null === b ? "null" : void 0 === b ? "undefined" : a(b, "HTMLElement") || "object" == typeof b && 1 === b.nodeType && "string" == typeof b.nodeName ? "element" : b == b.window ? "window" : a(b, "HTMLDocument") || "object" == typeof b && ("defaultView" in b || "parentWindow" in b) ? "document" : Object.prototype.toString.call(b).slice(8, -1).toLowerCase()
			}
		}()
	};
	c.extend(c, {
		addClass: function(a, b) {
			c.hasClass(a, b) || (a.className = (a.className ? a.className + " " : "") + b)
		},
		all: function(a, b) {
			var d = "array" === c.type(a) ? [] : {};
			return c.each(a, function(a, e) {
				b(a, e) && ("array" === c.type(d) ? d.push(a) : d[e] = a)
			}), d
		},
		ancestors: function(a) {
			for (var b = [a];
				(a = a.parentNode) && 1 === a.nodeType;) b.push(a);
			return b
		},
		apiCallback: function(a, b) {
			return function(d) {
				"string" === c.type(d) && (d = {
					response: [d]
				}), a.apply(b, d.response.concat(d.data))
			}
		},
		attributes: function(a, b) {
			var d;
			b = b || {};
			for (d in b) "function" === c.type(a.setAttribute) ? a.setAttribute(d, b[d]) : a["class" === d ? "className" : d] = b[d]
		},
		attrValues: function(a, b, c) {
			return (b = a[b]) && b.split ? b.split(c || " ") : []
		},
		batchable: function(a, b) {
			b = b || c.noop;
			var d = function() {
					return c.extend({
						batch: !0,
						timeout: 100
					}, b())
				},
				e = c.traits.cors && c.traits.json,
				f = [],
				g = null,
				h = function() {
					null !== g && (clearTimeout(g), g = null), 1 === f.length ? a.apply(null, f[0].arguments) : 1 < f.length && a.apply(null, f), f = []
				},
				i = function() {
					f.push({
						arguments: c.toArray(arguments),
						batch: !0
					}), e && d().batch ? null === g && (g = setTimeout(c.entryPoint(c.bind(function() {
						h()
					}, this)), d().timeout)) : h()
				};
			return c.extend(i, {
				flush: h,
				now: a
			}), i
		},
		batchArgs: function(a, b) {
			return c.map(a, function(a) {
				return void 0 === b ? a.arguments : a.arguments[b]
			})
		},
		batchCallType: function(a) {
			var b;
			return c.reduce(null, a, function(a, c) {
				return b = c[0], null !== a && b !== a ? "batch" : b
			})
		},
		batched: function(a) {
			if (a = c.toArray(a), "array" === c.type(a)) return c.all(a, function(a) {
				return "object" === c.type(a) && a.batch && "array" === c.type(a.arguments)
			}).length === a.length
		},
		bind: function(a, b) {
			return function() {
				return a.apply(b, arguments)
			}
		},
		cache: function() {
			var a = {},
				b = "vglnk_" + (new Date).getTime(),
				c = 0;
			return function(d, e, f) {
				if (d) {
					var g = d[b];
					if (g || void 0 !== f) return g || (g = ++c), a[g] || (d[b] = g, a[g] = {}), void 0 !== f && (a[g][e] = f), "string" == typeof e ? a[g][e] : a[g]
				}
			}
		}(),
		canonicalizeHostname: function(a) {
			"string" == typeof a && (a = c.createA(a));
			try {
				return a.hostname ? a.hostname.toString().toLowerCase().replace(/^www\./, "").replace(/:.*$/, "") : ""
			} catch (b) {
				return ""
			}
		},
		clone: function(a) {
			return c.extend({}, a)
		},
		commonParams: function(a, b) {
			var d;
			return b = b || {}, d = {
				drKey: b.key ? null : b.dr_key,
				key: b.key,
				libId: b.library_id,
				subId: b.sub_id
			}, ("click" === a || "ping" === a) && c.extend(d, {
				cuid: b.cuid,
				loc: location.href,
				v: 1
			}, d), d
		},
		contains: function(a, b, d) {
			return Boolean(c.find(a, function(a) {
				return a === b
			}, d))
		},
		context: function(a) {
			if ("element" === c.type(a) && (a = a.ownerDocument), "document" === c.type(a) && (a = a.defaultView || a.parentWindow), "window" === c.type(a)) return a
		},
		contextIsAncestor: function(a, b) {
			for (var c = a.self; c.parent && c.parent !== c;)
				if (c = c.parent, c === b) return !0;
			return !1
		},
		cors: function(a, b, d) {
			var e;
			e = new window.XMLHttpRequest, e.onreadystatechange = function() {
				if (4 === e.readyState && 200 === e.status) {
					var a, b = c.noop,
						f = [];
					d ? d(e.responseText) : "string" === c.type(e.responseText) && (a = e.responseText.match(/^\s*(?:\/\*\*\/)?([^(\s]+)\s*\((.*)\);?\s*$/)) && (b = a[1].replace(/(^\s+|\s+$)/g, ""), f = c.fromJSON("[" + a[2] + "]"), window[b].apply(window, f))
				}
			};
			try {
				return e.open("POST", a), e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), e.withCredentials = !0, e.send(b), !0
			} catch (f) {
				return !1
			}
		},
		createA: function(a, b) {
			return c.createEl("a", {
				href: a,
				target: b
			})
		},
		createEl: function(a, b, d, e) {
			return a = (e || document).createElement(a), c.attributes(a, b), c.css(a, d), a
		},
		css: function(a, b) {
			var c;
			b = b || {};
			for (c in b) try {
				a.style[c] = b[c]
			} catch (d) {}
			return a
		},
		destructing: function(a) {
			return function(a) {
				var b, c = !1;
				return function() {
					return c || (b = a.apply(null, arguments), c = !0), b
				}
			}(a)
		},
		elapsed: function(a) {
			return (a = a || this._start) ? (new Date).getTime() - a.getTime() : 0
		},
		entryPoint: function(a) {
			return c.exceptionLogger(function() {
				var b;
				return c._start = new Date, c.observer.pause(), b = a.apply(this, arguments), c.observer.resume(), b
			})
		},
		escapeRegExp: function() {
			var a;
			return function(b) {
				return a = a || /([.*+?^${}()|[\]\\])/g, b.replace(a, "\\$1")
			}
		}(),
		eventLink: function(a) {
			var b, c = a.target || a.srcElement;
			do {
				try {
					b = c.nodeType
				} catch (d) {
					break
				}
				if (1 === b && (a = c.tagName.toUpperCase(), "A" === a || "AREA" === a)) return c;
				c = c.parentNode
			} while (c)
		},
		every: function(a, b) {
			return Boolean(!c.some(a, function(a) {
				return !b(a)
			}))
		},
		exceptionLogger: function() {
			var a = !1,
				b = c.noop;
			return function(c, d) {
				return void 0 === d ? function() {
					if (!a) return c.apply(this, arguments);
					try {
						return c.apply(this, arguments)
					} catch (d) {
						b(d)
					}
				} : (a = d, void(b = c))
			}
		}(),
		find: function(a, b, d) {
			var e;
			return c.each(a, function(a, d) {
				if (b(a, d)) return e = a, c._breaker
			}, d), e
		},
		generateNodeFilter: function() {
			var a = function(a, c) {
					var d, e;
					for (c = "," + c.join(",") + ",", d = 0, e = a.length; d < e; d++)
						if (b(a[d], c)) return !0;
					return !1
				},
				b = function(a, b) {
					return -1 !== b.indexOf("," + a + ",")
				};
			return function(d) {
				return d = c.extend({
						custom: null,
						classes: [],
						rels: [],
						selectors: [],
						tags: []
					}, d), d.tags.length && (d.tags = "," + d.tags.join(",").toLowerCase() + ","), c.isArray(d.selectors) && (d.selectors = d.selectors.join(",")),
					function(e, f) {
						f = c.extend({
							ancestors: !0,
							self: !0
						}, f);
						var g = function(e, f) {
							var g;
							if (g = !(d.tags && d.tags.length && b(e.nodeName.toLowerCase(), d.tags))) {
								if ((g = d.classes) && (g = d.classes.length)) {
									g = d.classes;
									var h = c.attrValues(e, "className");
									g = a(g, h)
								}(g = !g) && ((g = d.rels) && (g = d.rels.length) && (g = d.rels, h = c.attrValues(e, "rel"), g = b(e.nodeName.toLowerCase(), ",a,") && a(g, h)), g = !(g || d.selectors && d.selectors.length && c.matches(e, d.selectors) || "function" === c.type(d.custom) && d.custom(e, f)))
							}
							return g
						};
						if (f.self && !g(e, !0)) return !1;
						if (f.ancestors)
							for (; e.parentNode;)
								if (e = e.parentNode, 1 === e.nodeType && !g(e, !1)) return !1;
						return !0
					}
			}
		}(),
		fromJSON: function(a) {
			if (c.traits.json) try {
				return window.JSON.parse(a)
			} catch (b) {}
		},
		fromQuery: function(a) {
			"?" === a.substr(0, 1) && (a = a.substr(1)), a = a.split("&");
			var b = {};
			return c.each(a, function(a) {
				a = a.split("="), b[decodeURIComponent(a[0])] = decodeURIComponent(a[1])
			}), b
		},
		geometry: function() {
			var a, b, d = arguments.length,
				e = 1 / 0,
				f = 1 / 0,
				g = -(1 / 0),
				h = -(1 / 0);
			for (a = 0; a < d; a++) b = c.position(arguments[a]), e = Math.min(e, b.x), f = Math.min(f, b.y), g = Math.max(g, b.x + arguments[a].offsetWidth), h = Math.max(h, b.y + arguments[a].offsetHeight);
			return {
				x: e,
				y: f,
				w: g - e,
				h: h - f,
				x1: e,
				y1: f,
				x2: g,
				y2: h
			}
		},
		getActualHref: function(a) {
			return c.cache(a, "href") || a.href
		},
		hasAttrValue: function(a, b, d, e) {
			return !!b && c.contains(c.attrValues(a, b, e), d)
		},
		hasClass: function(a, b) {
			return c.hasAttrValue(a, "className", b)
		},
		hasRel: function(a, b) {
			return c.hasAttrValue(a, "rel", b)
		},
		isArray: function(a) {
			return "array" === c.type(a)
		},
		isDefaultPrevented: function(a) {
			return a.isDefaultPrevented && a.isDefaultPrevented() || !1 === a.returnValue || !0 === a.defaultPrevented
		},
		isInDom: function(a) {
			return Boolean(a && a.offsetParent)
		},
		isVisible: function(a) {
			return Boolean(a.offsetHeight || a.offsetWidth || !a.getClientRects || a.getClientRects().length)
		},
		jsonp: function(a) {
			var b = document.getElementsByTagName("script")[0];
			a = c.createEl("script", {
				type: "text/javascript",
				src: a
			}), b.parentNode.insertBefore(a, b)
		},
		links: function() {
			var a = ["http:", "https:"],
				b = function(b, d) {
					return c.all(b, function(b) {
						return b.href && (!d.filter_by_scheme || c.contains(a, b.protocol)) && (!d.filter_homepages || "/" !== b.pathname) && (!d.filter_internal || b.hostname !== c.context(b).location.hostname)
					})
				};
			return function(a, d, e) {
				return e = c.extend({
					filter_homepages: !0,
					filter_internal: !0,
					filter_by_scheme: !0
				}, e), d = c.map(d.split(","), function(a) {
					return a + " a[href]"
				}).join(","), b(c.withScope(a, d, {
					ancestors: !1,
					consolidate: !0
				}), e)
			}
		}(),
		map: function(a, b, d) {
			return c.reduce([], a, function(a, c, d) {
				return a.push(b(c, d)), a
			}, d)
		},
		matches: function(a, b) {
			if ("element" !== c.type(a)) return !1;
			try {
				return this.Sizzle.matchesSelector(a, b)
			} catch (d) {
				return !0
			}
		},
		mergeable: function(a) {
			var b = function() {
				return c.extend({
					batchable: !0,
					batchFn: c.noop,
					nonBatchFn: c.noop,
					timeout: 100
				}, a())
			};
			return c.batchable(function() {
				c.batched(arguments) && b().batchable ? c.each(c.batchArgs(arguments), function(a) {
					b().batchFn.apply(this, a)
				}) : b().nonBatchFn.apply(this, arguments)
			}, function() {
				return {
					batch: !0,
					timeout: b().timeout
				}
			})
		},
		mergeParams: function(a) {
			var b, d, e, f = arguments.length,
				g = function(d, e) {
					b = a[e], a.hasOwnProperty(e) && c.isArray(d) && c.isArray(b) ? a[e] = c.unique(b.concat(d)) : a[e] = d
				};
			for (d = 1; d < f; d++) e = arguments[d], c.each(e, g);
			return c.prune(a)
		},
		nodesOfType: function(a) {
			var b = c.toArray(arguments).slice(1);
			return c.all(a, function(a) {
				return c.contains(b, a.nodeType)
			})
		},
		on: function() {
			var a;
			return function(b, d, e) {
				var f, g, h;
				if (1 === arguments.length) a = b;
				else {
					if (2 === arguments.length) {
						if (!a) return;
						e = d, d = b, b = a
					} else f = c.toArray(arguments).slice(3, arguments.length);
					try {
						g = b["on" + d]
					} catch (i) {}
					"function" == typeof g && (b["on" + d] = c.bind(function(a) {
						a = a || window.event;
						var d = g.apply(b, arguments);
						this.exceptionLogger(function() {
							return a ? (void 0 !== d && !1 !== a.returnValue && (a.returnValue = d), c.isDefaultPrevented(a) && "function" === c.type(a.preventDefault) && a.preventDefault(), a.returnValue) : d
						})()
					}, this)), h = c.entryPoint(function() {
						if (a.enabled()) return e.apply(null, c.toArray(arguments).concat(f || []))
					}), b.addEventListener ? b.addEventListener(d, h, !1) : b.attachEvent && b.attachEvent("on" + d, h)
				}
			}
		}(),
		packageArgs: function() {
			return c.toArray(arguments)
		},
		position: function(a, b) {
			var d, e = 0,
				f = 0,
				g = 0,
				h = 0;
			if (b = b || document, !c.isInDom(a)) return !1;
			d = a;
			do e += d.offsetLeft, f += d.offsetTop, d = d.offsetParent; while (d);
			d = a;
			do g += d.scrollLeft, h += d.scrollTop, d = d.parentNode; while (d && d !== b.body);
			return {
				x: e - g,
				y: f - h
			}
		},
		preventDefault: function(a) {
			return a.preventDefault && a.preventDefault(), a.returnValue = !1
		},
		prune: function(a) {
			return c.each(a, function(b, c) {
				(null === b || void 0 === b) && delete a[c]
			}), a
		},
		ready: function() {
			var a, b, d, e, f, g = !1,
				h = [],
				i = !1;
			return document.addEventListener ? d = function() {
					document.removeEventListener("DOMContentLoaded", d, !1), f()
				} : document.attachEvent && (e = function() {
					"complete" === document.readyState && (document.detachEvent("onreadystatechange", e), f())
				}), a = function() {
					if (!g) {
						if (g = !0, "interactive" === document.readyState || "complete" === document.readyState) return f();
						if (document.addEventListener) document.addEventListener("DOMContentLoaded", d, !1);
						else if (document.attachEvent) {
							document.attachEvent("onreadystatechange", e);
							var a = !1;
							try {
								a = null === window.frameElement
							} catch (h) {}
							document.documentElement.doScroll && a && b()
						}
						c.on(window, "load", f)
					}
				}, b = function() {
					if (!i) {
						try {
							document.documentElement.doScroll("left")
						} catch (a) {
							return void setTimeout(c.entryPoint(b), 1)
						}
						f()
					}
				}, f = function() {
					if (!i) {
						if (!document.body) return setTimeout(c.entryPoint(f), 13);
						i = !0, h && (c.each(h, function(a) {
							a()
						}), h = null)
					}
				},
				function(b) {
					a(), i ? b() : h.push(b)
				}
		}(),
		reduce: function(a, b, d, e) {
			return c.each(b, function(b, c) {
				a = d(a, b, c)
			}, e), a
		},
		reformatKeys: function(a) {
			var b, d, e = function(a) {
				return "_" + a.toLowerCase()
			};
			for (b in a) d = b.replace(/([A-Z])/g, e), "object" === c.type(a[b]) && (a[b] = c.reformatKeys(a[b])), d !== b && (a[d] = a[b], delete a[b]);
			return a
		},
		removeClass: function(a, b) {
			if (c.hasClass(a, b)) {
				var d, e, f = c.attrValues(a, "className");
				for (d = 0, e = f.length; d < e; d++) f[d] === b && delete f[d];
				a.className = f.join(" ")
			}
		},
		request: function(a, b, d) {
			var e, f, g, h = c.uniqid("vglnk_"),
				i = c.toArray(arguments).slice(3, arguments.length),
				j = function(a, b, d) {
					var e = {},
						f = !!b.length,
						g = !0 === d || !1 === d;
					return (f || g) && (a = c.createA(a), f && (e.search = "?" + b), g && (b = a.protocol || c.context(a).location.protocol || "http:", e.protocol = b.replace(/s?:$/, function() {
						return d ? "s:" : ":"
					})), a = c.extend(a, e).href), a
				};
			return f = function(a, b) {
				var d = {},
					e = c.commonParams();
				return d[b] = {}, c.each(a, function(a, c) {
					c in e ? d[c] = a : d[b][c] = a
				}), d[b] = c.toJSON(d[b]), c.prune(d)
			}, d = c.extend({
				fn: c.noop,
				json_payload: null,
				jsonp: !0,
				"return": !1,
				ssl: null,
				timeout: null
			}, d), "string" == typeof d.fn ? (e = window[d.fn], h = d.fn) : "function" == typeof d.fn && (e = d.fn), "function" === c.type(e) && (g = c.entryPoint(c.destructing(function() {
				var a, f;
				d.json_payload && (f = d.json_payload, a = c.fromJSON(b[f]), b = c.extend(b, a), delete b[f]), e({
					response: c.toArray(arguments),
					data: i,
					args: b
				}), window[h] && (window[h] = void 0)
			})), null !== d.timeout && setTimeout(g, d.timeout)), d.json_payload && c.traits.cors && (b = f(b, d.json_payload)), !0 === d.jsonp && (window[h] = g, b = c.extend({
				format: "jsonp",
				jsonp: h
			}, b)), f = c.toQuery(b), d["return"] ? j(a, f, d.ssl) : !!(c.traits.json && c.traits.cors && c.cors(j(a, "", d.ssl), f, d.jsonp ? null : g)) || c.jsonp(j(a, f, d.ssl))
		},
		select: function() {
			try {
				return this.Sizzle.apply(this.Sizzle, arguments)
			} catch (a) {
				return []
			}
		},
		some: function(a, b) {
			return Boolean(c.find(a, function(a) {
				return b(a)
			}))
		},
		stopPropagation: function(a) {
			a && a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0
		},
		time: function() {
			return (new Date).getTime()
		},
		toArray: function(a) {
			if (a && void 0 !== a.length) try {
				return Array.prototype.slice.call(a, 0)
			} catch (b) {
				var c, d, e = [];
				for (c = 0, d = a.length; c < d; c++) e[c] = a[c];
				return e
			}
		},
		toJSON: function(a) {
			if (c.traits.json) try {
				return window.JSON.stringify(a)
			} catch (b) {}
		},
		toQuery: function(a) {
			var b = "";
			return c.each(c.prune(a), function(a, c) {
				b += "&" + encodeURIComponent(c) + "=" + encodeURIComponent(a)
			}), b.substr(1)
		},
		updateUrl: function(a, b) {
			return c.extend(c.createA(a), b).href
		},
		uniqid: function() {
			var a = 0;
			return function(b) {
				return (b || "") + (new Date).getTime() + a++
			}
		}(),
		unique: function(a) {
			return c.reduce([], a, function(a, b) {
				return c.contains(a, b) || a.push(b), a
			})
		},
		unlink: function(a) {
			var b, c = document.createDocumentFragment();
			if (a.parentNode) {
				for (; null !== (b = a.firstChild);) c.appendChild(b);
				a.parentNode.insertBefore(c, a), a.parentNode.removeChild(a)
			}
		},
		withScope: function() {
			var a = function(a, b, d) {
				return d.self && c.contains(b, a, {
					timeout: !0
				}) ? a : d.ancestors ? c.find(c.ancestors(a).slice(0), function(a) {
					return c.contains(b, a, {
						timeout: !0
					})
				}, {
					timeout: !0
				}) : void 0
			};
			return function(b, d, e) {
				var f, g = c.select(d);
				return e = c.extend({
					ancestors: !0,
					consolidate: !1,
					descendants: !0,
					self: !0
				}, e), e.descendants && (f = c.map(g, function(a) {
					return [a, c.ancestors(a)]
				}, {
					timeout: !0
				})), b = c.all(c.map(b, function(b) {
					var d, h = [];
					return (d = a(b, g, e)) ? h.push(d) : 1 === b.nodeType && e.descendants && c.each(f, function(a) {
						var d = a[0];
						c.contains(a[1], b, {
							timeout: !0
						}) && h.push(d)
					}, {
						timeout: !0
					}), [b, h]
				}, {
					timeout: !0
				}), function(a) {
					return 0 < a[1].length
				}, {
					timeout: !0
				}), e.consolidate ? c.unique(c.reduce([], b, function(a, b) {
					return a.concat(b[1])
				}, {
					timeout: !0
				})) : b
			}
		}()
	});
	var d = function() {
		var a = c.find(c.toArray(arguments), function(a) {
			return "function" === c.type(a)
		});
		a && (c.Sizzle = a())
	};
	d.amd = !0,
		function(a) {
			function b(a, b, c, d) {
				var e, f, g, h, i;
				if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], !a || "string" != typeof a) return c;
				if (1 !== (h = b.nodeType) && 9 !== h) return [];
				if (I && !d) {
					if (e = ma.exec(a))
						if (g = e[1]) {
							if (9 === h) {
								if (!(f = b.getElementById(g)) || !f.parentNode) return c;
								if (f.id === g) return c.push(f), c
							} else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g) return c.push(f), c
						} else {
							if (e[2]) return _.apply(c, b.getElementsByTagName(a)), c;
							if ((g = e[3]) && v.getElementsByClassName && b.getElementsByClassName) return _.apply(c, b.getElementsByClassName(g)), c
						}
					if (v.qsa && (!J || !J.test(a))) {
						if (f = e = N, g = b, i = 9 === h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
							for (h = z(a), (e = b.getAttribute("id")) ? f = e.replace(oa, "\\$&") : b.setAttribute("id", f), f = "[id='" + f + "'] ", g = h.length; g--;) h[g] = f + n(h[g]);
							g = na.test(a) && l(b.parentNode) || b, i = h.join(",")
						}
						if (i) try {
							return _.apply(c, g.querySelectorAll(i)), c
						} catch (j) {} finally {
							e || b.removeAttribute("id")
						}
					}
				}
				return B(a.replace(ca, "$1"), b, c, d)
			}

			function c() {
				function a(c, d) {
					return b.push(c + " ") > w.cacheLength && delete a[b.shift()], a[c + " "] = d
				}
				var b = [];
				return a
			}

			function e(a) {
				return a[N] = !0, a
			}

			function f(a) {
				var b = G.createElement("div");
				try {
					return !!a(b)
				} catch (c) {
					return !1
				} finally {
					b.parentNode && b.parentNode.removeChild(b)
				}
			}

			function g(a, b) {
				for (var c = a.split("|"), d = a.length; d--;) w.attrHandle[c[d]] = b
			}

			function h(a, b) {
				var c = b && a,
					d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || W) - (~a.sourceIndex || W);
				if (d) return d;
				if (c)
					for (; c = c.nextSibling;)
						if (c === b) return -1;
				return a ? 1 : -1
			}

			function i(a) {
				return function(b) {
					return "input" === b.nodeName.toLowerCase() && b.type === a
				}
			}

			function j(a) {
				return function(b) {
					var c = b.nodeName.toLowerCase();
					return ("input" === c || "button" === c) && b.type === a
				}
			}

			function k(a) {
				return e(function(b) {
					return b = +b, e(function(c, d) {
						for (var e, f = a([], c.length, b), g = f.length; g--;) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
					})
				})
			}

			function l(a) {
				return a && typeof a.getElementsByTagName !== V && a
			}

			function m() {}

			function n(a) {
				for (var b = 0, c = a.length, d = ""; b < c; b++) d += a[b].value;
				return d
			}

			function o(a, b, c) {
				var d = b.dir,
					e = c && "parentNode" === d,
					f = Q++;
				return b.first ? function(b, c, f) {
					for (; b = b[d];)
						if (1 === b.nodeType || e) return a(b, c, f)
				} : function(b, c, g) {
					var h, i, j = [P, f];
					if (g) {
						for (; b = b[d];)
							if ((1 === b.nodeType || e) && a(b, c, g)) return !0
					} else
						for (; b = b[d];)
							if (1 === b.nodeType || e) {
								if (i = b[N] || (b[N] = {}), (h = i[d]) && h[0] === P && h[1] === f) return j[2] = h[2];
								if (i[d] = j, j[2] = a(b, c, g)) return !0
							}
				}
			}

			function p(a) {
				return 1 < a.length ? function(b, c, d) {
					for (var e = a.length; e--;)
						if (!a[e](b, c, d)) return !1;
					return !0
				} : a[0]
			}

			function q(a, b, c, d, e) {
				for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++)(f = a[h]) && (c && !c(f, d, e) || (g.push(f), j && b.push(h)));
				return g
			}

			function r(a, c, d, f, g, h) {
				return f && !f[N] && (f = r(f)), g && !g[N] && (g = r(g, h)), e(function(e, h, i, j) {
					var k, l, m, n = [],
						o = [],
						p = h.length;
					if (!(m = e)) {
						m = c || "*";
						for (var r = i.nodeType ? [i] : i, s = [], t = 0, u = r.length; t < u; t++) b(m, r[t], s);
						m = s
					}
					if (m = !a || !e && c ? m : q(m, n, a, i, j), r = d ? g || (e ? a : p || f) ? [] : h : m, d && d(m, r, i, j), f)
						for (k = q(r, o), f(k, [], i, j), i = k.length; i--;)(l = k[i]) && (r[o[i]] = !(m[o[i]] = l));
					if (e) {
						if (g || a) {
							if (g) {
								for (k = [], i = r.length; i--;)(l = r[i]) && k.push(m[i] = l);
								g(null, r = [], k, j)
							}
							for (i = r.length; i--;)(l = r[i]) && -1 < (k = g ? ba.call(e, l) : n[i]) && (e[k] = !(h[k] = l))
						}
					} else r = q(r === h ? r.splice(p, r.length) : r), g ? g(null, h, r, j) : _.apply(h, r)
				})
			}

			function s(a) {
				var b, c, d, e = a.length,
					f = w.relative[a[0].type];
				c = f || w.relative[" "];
				for (var g = f ? 1 : 0, h = o(function(a) {
						return a === b
					}, c, !0), i = o(function(a) {
						return -1 < ba.call(b, a)
					}, c, !0), j = [function(a, c, d) {
						return !f && (d || c !== C) || ((b = c).nodeType ? h(a, c, d) : i(a, c, d))
					}]; g < e; g++)
					if (c = w.relative[a[g].type]) j = [o(p(j), c)];
					else {
						if (c = w.filter[a[g].type].apply(null, a[g].matches), c[N]) {
							for (d = ++g; d < e && !w.relative[a[d].type]; d++);
							return r(1 < g && p(j), 1 < g && n(a.slice(0, g - 1).concat({
								value: " " === a[g - 2].type ? "*" : ""
							})).replace(ca, "$1"), c, g < d && s(a.slice(g, d)), d < e && s(a = a.slice(d)), d < e && n(a))
						}
						j.push(c)
					}
				return p(j)
			}

			function t(a, c) {
				var d = 0 < c.length,
					f = 0 < a.length,
					g = function(e, g, h, i, j) {
						var k, l, m, n = 0,
							o = "0",
							p = e && [],
							r = [],
							s = C,
							t = e || f && w.find.TAG("*", j),
							u = P += null == s ? 1 : Math.random() || .1,
							v = t.length;
						for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
							if (f && k) {
								for (l = 0; m = a[l++];)
									if (m(k, g, h)) {
										i.push(k);
										break
									}
								j && (P = u)
							}
							d && ((k = !m && k) && n--, e && p.push(k))
						}
						if (n += o, d && o !== n) {
							for (l = 0; m = c[l++];) m(p, r, g, h);
							if (e) {
								if (0 < n)
									for (; o--;) !p[o] && !r[o] && (r[o] = Z.call(i));
								r = q(r)
							}
							_.apply(i, r), j && !e && 0 < r.length && 1 < n + c.length && b.uniqueSort(i)
						}
						return j && (P = u, C = s), p
					};
				return d ? e(g) : g
			}
			var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + -new Date,
				O = a.document,
				P = 0,
				Q = 0,
				R = c(),
				S = c(),
				T = c(),
				U = function(a, b) {
					return a === b && (E = !0), 0
				},
				V = "undefined",
				W = -2147483648,
				X = {}.hasOwnProperty,
				Y = [],
				Z = Y.pop,
				$ = Y.push,
				_ = Y.push,
				aa = Y.slice,
				ba = Y.indexOf || function(a) {
					for (var b = 0, c = this.length; b < c; b++)
						if (this[b] === a) return b;
					return -1
				},
				ca = /^[\x20\t\r\n\f]+|((?:^|[^\\])(?:\\.)*)[\x20\t\r\n\f]+$/g,
				da = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,
				ea = /^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/,
				fa = /=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,
				ga = RegExp(":((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+))|)[\\x20\\t\\r\\n\\f]*\\])*)|.*)\\)|)"),
				ha = /^(?:\\.|[\w-]|[^\x00-\xa0])+$/,
				ia = {
					ID: /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,
					CLASS: /^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,
					TAG: /^((?:\\.|[\w-]|[^\x00-\xa0])+|[*])/,
					ATTR: RegExp("^\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+))|)[\\x20\\t\\r\\n\\f]*\\]"),
					PSEUDO: RegExp("^:((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+))|)[\\x20\\t\\r\\n\\f]*\\])*)|.*)\\)|)"),
					CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)", "i"),
					bool: RegExp("^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i"),
					needsContext: RegExp("^[\\x20\\t\\r\\n\\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)", "i")
				},
				ja = /^(?:input|select|textarea|button)$/i,
				ka = /^h\d$/i,
				la = /^[^{]+\{\s*\[native \w/,
				ma = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
				na = /[+~]/,
				oa = /'|\\/g,
				pa = /\\([\da-f]{1,6}[\x20\t\r\n\f]?|([\x20\t\r\n\f])|.)/gi,
				qa = function(a, b, c) {
					return a = "0x" + b - 65536, a !== a || c ? b : 0 > a ? String.fromCharCode(a + 65536) : String.fromCharCode(a >> 10 | 55296, 1023 & a | 56320)
				};
			try {
				_.apply(Y = aa.call(O.childNodes), O.childNodes), Y[O.childNodes.length].nodeType
			} catch (ra) {
				_ = {
					apply: Y.length ? function(a, b) {
						$.apply(a, aa.call(b))
					} : function(a, b) {
						for (var c = a.length, d = 0; a[c++] = b[d++];);
						a.length = c - 1
					}
				}
			}
			v = b.support = {}, y = b.isXML = function(a) {
				return !!(a = a && (a.ownerDocument || a).documentElement) && "HTML" !== a.nodeName
			}, F = b.setDocument = function(a) {
				var b = a ? a.ownerDocument || a : O;
				return a = b.defaultView, b !== G && 9 === b.nodeType && b.documentElement ? (G = b, H = b.documentElement, I = !y(b), a && a !== a.top && (a.addEventListener ? a.addEventListener("unload", function() {
					F()
				}, !1) : a.attachEvent && a.attachEvent("onunload", function() {
					F()
				})), v.attributes = f(function(a) {
					return a.className = "i", !a.getAttribute("className")
				}), v.getElementsByTagName = f(function(a) {
					return a.appendChild(b.createComment("")), !a.getElementsByTagName("*").length
				}), v.getElementsByClassName = la.test(b.getElementsByClassName) && f(function(a) {
					return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
				}), v.getById = f(function(a) {
					return H.appendChild(a).id = N, !b.getElementsByName || !b.getElementsByName(N).length
				}), v.getById ? (w.find.ID = function(a, b) {
					if (typeof b.getElementById !== V && I) {
						var c = b.getElementById(a);
						return c && c.parentNode ? [c] : []
					}
				}, w.filter.ID = function(a) {
					var b = a.replace(pa, qa);
					return function(a) {
						return a.getAttribute("id") === b
					}
				}) : (delete w.find.ID, w.filter.ID = function(a) {
					var b = a.replace(pa, qa);
					return function(a) {
						return (a = typeof a.getAttributeNode !== V && a.getAttributeNode("id")) && a.value === b
					}
				}), w.find.TAG = v.getElementsByTagName ? function(a, b) {
					if (typeof b.getElementsByTagName !== V) return b.getElementsByTagName(a)
				} : function(a, b) {
					var c, d = [],
						e = 0,
						f = b.getElementsByTagName(a);
					if ("*" === a) {
						for (; c = f[e++];) 1 === c.nodeType && d.push(c);
						return d
					}
					return f
				}, w.find.CLASS = v.getElementsByClassName && function(a, b) {
					if (typeof b.getElementsByClassName !== V && I) return b.getElementsByClassName(a)
				}, K = [], J = [], (v.qsa = la.test(b.querySelectorAll)) && (f(function(a) {
					a.innerHTML = "<select msallowclip=''><option selected=''></option></select>", a.querySelectorAll("[msallowclip^='']").length && J.push("[*^$]=[\\x20\\t\\r\\n\\f]*(?:''|\"\")"), a.querySelectorAll("[selected]").length || J.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)"), a.querySelectorAll(":checked").length || J.push(":checked")
				}), f(function(a) {
					var c = b.createElement("input");
					c.setAttribute("type", "hidden"), a.appendChild(c).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name[\\x20\\t\\r\\n\\f]*[*^$|!~]?="), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
				})), (v.matchesSelector = la.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && f(function(a) {
					v.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", ":((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+))|)[\\x20\\t\\r\\n\\f]*\\])*)|.*)\\)|)")
				}), J = J.length && RegExp(J.join("|")), K = K.length && RegExp(K.join("|")), M = (a = la.test(H.compareDocumentPosition)) || la.test(H.contains) ? function(a, b) {
					var c = 9 === a.nodeType ? a.documentElement : a,
						d = b && b.parentNode;
					return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
				} : function(a, b) {
					if (b)
						for (; b = b.parentNode;)
							if (b === a) return !0;
					return !1
				}, U = a ? function(a, c) {
					if (a === c) return E = !0, 0;
					var d = !a.compareDocumentPosition - !c.compareDocumentPosition;
					return d ? d : (d = (a.ownerDocument || a) === (c.ownerDocument || c) ? a.compareDocumentPosition(c) : 1, 1 & d || !v.sortDetached && c.compareDocumentPosition(a) === d ? a === b || a.ownerDocument === O && M(O, a) ? -1 : c === b || c.ownerDocument === O && M(O, c) ? 1 : D ? ba.call(D, a) - ba.call(D, c) : 0 : 4 & d ? -1 : 1)
				} : function(a, c) {
					if (a === c) return E = !0, 0;
					var d, e = 0;
					d = a.parentNode;
					var f = c.parentNode,
						g = [a],
						i = [c];
					if (!d || !f) return a === b ? -1 : c === b ? 1 : d ? -1 : f ? 1 : D ? ba.call(D, a) - ba.call(D, c) : 0;
					if (d === f) return h(a, c);
					for (d = a; d = d.parentNode;) g.unshift(d);
					for (d = c; d = d.parentNode;) i.unshift(d);
					for (; g[e] === i[e];) e++;
					return e ? h(g[e], i[e]) : g[e] === O ? -1 : i[e] === O ? 1 : 0
				}, b) : G
			}, b.matches = function(a, c) {
				return b(a, null, null, c)
			}, b.matchesSelector = function(a, c) {
				if ((a.ownerDocument || a) !== G && F(a), c = c.replace(fa, "='$1']"), v.matchesSelector && I && (!K || !K.test(c)) && (!J || !J.test(c))) try {
					var d = L.call(a, c);
					if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
				} catch (e) {}
				return 0 < b(c, G, null, [a]).length
			}, b.contains = function(a, b) {
				return (a.ownerDocument || a) !== G && F(a), M(a, b)
			}, b.attr = function(a, b) {
				(a.ownerDocument || a) !== G && F(a);
				var c = w.attrHandle[b.toLowerCase()],
					c = c && X.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
				return void 0 !== c ? c : v.attributes || !I ? a.getAttribute(b) : (c = a.getAttributeNode(b)) && c.specified ? c.value : null
			}, b.error = function(a) {
				throw Error("Syntax error, unrecognized expression: " + a)
			}, b.uniqueSort = function(a) {
				var b, c = [],
					d = 0,
					e = 0;
				if (E = !v.detectDuplicates, D = !v.sortStable && a.slice(0), a.sort(U), E) {
					for (; b = a[e++];) b === a[e] && (d = c.push(e));
					for (; d--;) a.splice(c[d], 1)
				}
				return D = null, a
			}, x = b.getText = function(a) {
				var b, c = "",
					d = 0;
				if (b = a.nodeType) {
					if (1 === b || 9 === b || 11 === b) {
						if ("string" == typeof a.textContent) return a.textContent;
						for (a = a.firstChild; a; a = a.nextSibling) c += x(a)
					} else if (3 === b || 4 === b) return a.nodeValue
				} else
					for (; b = a[d++];) c += x(b);
				return c
			}, w = b.selectors = {
				cacheLength: 50,
				createPseudo: e,
				match: ia,
				attrHandle: {},
				find: {},
				relative: {
					">": {
						dir: "parentNode",
						first: !0
					},
					" ": {
						dir: "parentNode"
					},
					"+": {
						dir: "previousSibling",
						first: !0
					},
					"~": {
						dir: "previousSibling"
					}
				},
				preFilter: {
					ATTR: function(a) {
						return a[1] = a[1].replace(pa, qa), a[3] = (a[3] || a[4] || a[5] || "").replace(pa, qa), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
					},
					CHILD: function(a) {
						return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
					},
					PSEUDO: function(a) {
						var b, c = !a[6] && a[2];
						return ia.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && ga.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
					}
				},
				filter: {
					TAG: function(a) {
						var b = a.replace(pa, qa).toLowerCase();
						return "*" === a ? function() {
							return !0
						} : function(a) {
							return a.nodeName && a.nodeName.toLowerCase() === b
						}
					},
					CLASS: function(a) {
						var b = R[a + " "];
						return b || (b = RegExp("(^|[\\x20\\t\\r\\n\\f])" + a + "([\\x20\\t\\r\\n\\f]|$)")) && R(a, function(a) {
							return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== V && a.getAttribute("class") || "")
						})
					},
					ATTR: function(a, c, d) {
						return function(e) {
							return e = b.attr(e, a), null == e ? "!=" === c : !c || (e += "", "=" === c ? e === d : "!=" === c ? e !== d : "^=" === c ? d && 0 === e.indexOf(d) : "*=" === c ? d && -1 < e.indexOf(d) : "$=" === c ? d && e.slice(-d.length) === d : "~=" === c ? -1 < (" " + e + " ").indexOf(d) : "|=" === c && (e === d || e.slice(0, d.length + 1) === d + "-"))
						}
					},
					CHILD: function(a, b, c, d, e) {
						var f = "nth" !== a.slice(0, 3),
							g = "last" !== a.slice(-4),
							h = "of-type" === b;
						return 1 === d && 0 === e ? function(a) {
							return !!a.parentNode
						} : function(b, c, i) {
							var j, k, l, m, n;
							c = f !== g ? "nextSibling" : "previousSibling";
							var o = b.parentNode,
								p = h && b.nodeName.toLowerCase();
							if (i = !i && !h, o) {
								if (f) {
									for (; c;) {
										for (k = b; k = k[c];)
											if (h ? k.nodeName.toLowerCase() === p : 1 === k.nodeType) return !1;
										n = c = "only" === a && !n && "nextSibling"
									}
									return !0
								}
								if (n = [g ? o.firstChild : o.lastChild], g && i) {
									for (i = o[N] || (o[N] = {}), j = i[a] || [], m = j[0] === P && j[1], l = j[0] === P && j[2], k = m && o.childNodes[m]; k = ++m && k && k[c] || (l = m = 0) || n.pop();)
										if (1 === k.nodeType && ++l && k === b) {
											i[a] = [P, m, l];
											break
										}
								} else if (i && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P) l = j[1];
								else
									for (;
										(k = ++m && k && k[c] || (l = m = 0) || n.pop()) && ((h ? k.nodeName.toLowerCase() !== p : 1 !== k.nodeType) || !++l || (i && ((k[N] || (k[N] = {}))[a] = [P, l]), k !== b)););
								return l -= e, l === d || 0 === l % d && 0 <= l / d
							}
						}
					},
					PSEUDO: function(a, c) {
						var d, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
						return f[N] ? f(c) : 1 < f.length ? (d = [a, a, "", c], w.setFilters.hasOwnProperty(a.toLowerCase()) ? e(function(a, b) {
							for (var d, e = f(a, c), g = e.length; g--;) d = ba.call(a, e[g]), a[d] = !(b[d] = e[g])
						}) : function(a) {
							return f(a, 0, d)
						}) : f
					}
				},
				pseudos: {
					not: e(function(a) {
						var b = [],
							c = [],
							d = A(a.replace(ca, "$1"));
						return d[N] ? e(function(a, b, c, e) {
							e = d(a, null, e, []);
							for (var f = a.length; f--;)(c = e[f]) && (a[f] = !(b[f] = c))
						}) : function(a, e, f) {
							return b[0] = a, d(b, null, f, c), !c.pop()
						}
					}),
					has: e(function(a) {
						return function(c) {
							return 0 < b(a, c).length
						}
					}),
					contains: e(function(a) {
						return a = a.replace(pa, qa),
							function(b) {
								return -1 < (b.textContent || b.innerText || x(b)).indexOf(a)
							}
					}),
					lang: e(function(a) {
						return ha.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(pa, qa).toLowerCase(),
							function(b) {
								var c;
								do
									if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
								return !1
							}
					}),
					target: function(b) {
						var c = a.location && a.location.hash;
						return c && c.slice(1) === b.id
					},
					root: function(a) {
						return a === H
					},
					focus: function(a) {
						return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !(!a.type && !a.href && !~a.tabIndex)
					},
					enabled: function(a) {
						return !1 === a.disabled
					},
					disabled: function(a) {
						return !0 === a.disabled
					},
					checked: function(a) {
						var b = a.nodeName.toLowerCase();
						return "input" === b && !!a.checked || "option" === b && !!a.selected
					},
					selected: function(a) {
						return a.parentNode && a.parentNode.selectedIndex, !0 === a.selected
					},
					empty: function(a) {
						for (a = a.firstChild; a; a = a.nextSibling)
							if (6 > a.nodeType) return !1;
						return !0
					},
					parent: function(a) {
						return !w.pseudos.empty(a)
					},
					header: function(a) {
						return ka.test(a.nodeName)
					},
					input: function(a) {
						return ja.test(a.nodeName)
					},
					button: function(a) {
						var b = a.nodeName.toLowerCase();
						return "input" === b && "button" === a.type || "button" === b
					},
					text: function(a) {
						var b;
						return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
					},
					first: k(function() {
						return [0]
					}),
					last: k(function(a, b) {
						return [b - 1]
					}),
					eq: k(function(a, b, c) {
						return [0 > c ? c + b : c]
					}),
					even: k(function(a, b) {
						for (var c = 0; c < b; c += 2) a.push(c);
						return a
					}),
					odd: k(function(a, b) {
						for (var c = 1; c < b; c += 2) a.push(c);
						return a
					}),
					lt: k(function(a, b, c) {
						for (b = 0 > c ? c + b : c; 0 <= --b;) a.push(b);
						return a
					}),
					gt: k(function(a, b, c) {
						for (c = 0 > c ? c + b : c; ++c < b;) a.push(c);
						return a
					})
				}
			}, w.pseudos.nth = w.pseudos.eq;
			for (u in {
					radio: !0,
					checkbox: !0,
					file: !0,
					password: !0,
					image: !0
				}) w.pseudos[u] = i(u);
			for (u in {
					submit: !0,
					reset: !0
				}) w.pseudos[u] = j(u);
			m.prototype = w.filters = w.pseudos, w.setFilters = new m, z = b.tokenize = function(a, c) {
				var d, e, f, g, h, i, j;
				if (h = S[a + " "]) return c ? 0 : h.slice(0);
				for (h = a, i = [], j = w.preFilter; h;) {
					d && !(e = da.exec(h)) || (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = ea.exec(h)) && (d = e.shift(), f.push({
						value: d,
						type: e[0].replace(ca, " ")
					}), h = h.slice(d.length));
					for (g in w.filter) !(e = ia[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
						value: d,
						type: g,
						matches: e
					}), h = h.slice(d.length));
					if (!d) break
				}
				return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
			}, A = b.compile = function(a, b) {
				var c, d = [],
					e = [],
					f = T[a + " "];
				if (!f) {
					for (b || (b = z(a)), c = b.length; c--;) f = s(b[c]), f[N] ? d.push(f) : e.push(f);
					f = T(a, t(e, d)), f.selector = a
				}
				return f
			}, B = b.select = function(a, b, c, d) {
				var e, f, g, h, i = "function" == typeof a && a,
					j = !d && z(a = i.selector || a);
				if (c = c || [], 1 === j.length) {
					if (f = j[0] = j[0].slice(0), 2 < f.length && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
						if (!(b = (w.find.ID(g.matches[0].replace(pa, qa), b) || [])[0])) return c;
						i && (b = b.parentNode), a = a.slice(f.shift().value.length)
					}
					for (e = ia.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !w.relative[h = g.type]);)
						if ((h = w.find[h]) && (d = h(g.matches[0].replace(pa, qa), na.test(f[0].type) && l(b.parentNode) || b))) {
							if (f.splice(e, 1), a = d.length && n(f), !a) return _.apply(c, d), c;
							break
						}
				}
				return (i || A(a, j))(d, b, !I, c, na.test(a) && l(b.parentNode) || b), c
			}, v.sortStable = N.split("").sort(U).join("") === N, v.detectDuplicates = !!E, F(), v.sortDetached = f(function(a) {
				return 1 & a.compareDocumentPosition(G.createElement("div"))
			}), f(function(a) {
				return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
			}) || g("type|href|height|width", function(a, b, c) {
				if (!c) return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
			}), (!v.attributes || !f(function(a) {
				return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
			})) && g("value", function(a, b, c) {
				if (!c && "input" === a.nodeName.toLowerCase()) return a.defaultValue
			}), f(function(a) {
				return null == a.getAttribute("disabled")
			}) || g("checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", function(a, b, c) {
				var d;
				if (!c) return !0 === a[b] ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
			}), "function" == typeof d && d.amd ? d(function() {
				return b
			}) : "undefined" != typeof module && module.exports ? module.exports = b : a.Sizzle = b
		}(window), c.browser = function() {
			var a, b = {},
				d = navigator.userAgent.toLowerCase().replace(/\s*[()]\s*/g, "; ").replace(/(\/[\w.]+)\s+/g, "$1; ").replace(/\;\s*$/, "").split(/;\s*/);
			return c.each(d, function(c) {
				a = (/[\/ :]([^\/ :]+)$/.exec(c) || [])[1], b[a ? c.substr(0, c.length - a.length - 1).replace(/\d*$/, "") : c] = a || !0
			}), {
				aol: b.aol,
				blackberry: b.blackberry,
				firefox: b.firefox,
				ie: Boolean(b.msie || b.trident),
				ios: Boolean(b.applewebkit && b.mobile),
				opera: b.opera,
				playstation: b.playstation,
				version: parseFloat(b.version || b.crios || b.msie || b.rv || b.firefox) || !1
			}
		}(), c.harmony = {
			PASSIVE: 1,
			UNSAFE_QUIRKSMODE_EVENTS: .5,
			COMMERCIAL_LINK_EVENTS: .1,
			LINK_EVENTS: -1,
			AGGRESSIVE: -1
		}, c.harmony.DEFAULT = 0, c.pii = function() {
			var a = {
					email: /[A-Z0-9._%+-]+(?:%(?:25)*40|@)[A-Z0-9.-]+\.[A-Z]{2,4}/,
					numeric: /\d([^0-9A-Z]{0,4}\d){6,18}/
				},
				b = {
					contains: function(a, b) {
						return this.regexp(b).test(a)
					},
					redact: function(a, b) {
						return a.replace(this.regexp(b), "___")
					},
					regexp: function(b) {
						b = c.extend({}, b);
						var d = c.map(c.all(a, function(a, c) {
							return !1 !== b[c]
						}), function(a) {
							return a.source
						});
						return RegExp("(\\b" + d.join("\\b|\\b") + "\\b)", "gi")
					},
					transmits: function(a, b) {
						return this.contains(a + " " + document.referrer, b || {
							numeric: !1
						})
					}
				};
			return {
				contains: c.bind(b.contains, b),
				redact: c.bind(b.redact, b),
				transmits: c.bind(b.transmits, b)
			}
		}(), c.platforms = function() {
			var a = {
					NONE: {
						id: "full",
						scope: "body",
						spec: {
							selector: "body"
						}
					},
					bbp: {
						spec: {
							parser: /^post-(\d+)$/,
							selector: "div[id^='post-']"
						},
						scope: "li .post"
					},
					hdlr: {
						spec: {
							parser: /^post_(\d+)$/,
							selector: "div[id^='post_']"
						},
						scope: ".post-content-area"
					},
					ipb: {
						spec: {
							parser: /^post_id_(\d+)$/,
							selector: "div[id^='post_id_']"
						},
						scope: ".post_body .post"
					},
					phpb: {
						spec: {
							parser: /^p(\d+)$/,
							selector: "div.post[id^='p']"
						},
						scope: ".postbody .content,.postbody .signature"
					},
					ubb: {
						spec: {
							parser: /^number(\d+)$/,
							parse_el: "span[id^=number]",
							selector: "a[name^='Post'] ~ table"
						},
						scope: ".post_inner *[id^='body'],.post_inner .signature"
					},
					vb3: {
						spec: {
							parser: /^post_message_(\d+)$/,
							selector: "div[id^='post_message_'], table[id^='post_message_'],section[id^='post_message_']"
						},
						scope: "div[id^='post_message_'],div[id^='post_message_'] ~ div:not([class])"
					},
					vb4: {
						spec: {
							parser: /^post_(\d+)$/,
							selector: "li[id^='post_']"
						},
						scope: ".post-content,.postbody .content,.postbody .signature,ul.conversation-list .list-item-body"
					},
					wppr: {
						spec: {
							attributes: ["id", "className"],
							parser: /(?:^|\s)post-(\d+)(?:\s|$)/,
							selector: "article[class*='post-'], div[id^='post-']"
						}
					}
				},
				b = {
					getPostId: function(a) {
						var b, d;
						return this === c.platforms.NONE ? " " : (d = this.spec.parse_el ? c.select(this.spec.parse_el, a)[0] : a, c.find(this.spec.attributes || ["id"], c.bind(function(a) {
							return b = d[a] ? d[a].match(this.spec.parser) : null, Boolean(b)
						}, this)), b ? b[1] : void 0)
					},
					getPostIds: function(a) {
						var b = [];
						return c.each(this.getPosts(a), c.bind(function(a) {
							(a = this.getPostId(a)) && !c.contains(b, a) && b.push(a)
						}, this)), b.length ? b : null
					},
					getPosts: function(a) {
						var b = [];
						return !a && document && document.body && (a = [document.body]), a && this.spec && (b = c.withScope(a, this.spec.selector, {
							consolidate: !0
						})), b
					}
				};
			return c.each(a, function(d, e) {
				d.id = d.id || e, c.each(b, function(a, b) {
					d[b] = c.bind(a, d)
				}), a[e] = d
			}), a.DEFAULT_POST_ID = " ", a.findById = function(a) {
				return c.find(c.platforms, function(b) {
					return b.id === a
				})
			}, a
		}(), c.observer = function() {
			var a, b = [],
				d = 0,
				e = function() {
					a || (a = new MutationObserver(c.entryPoint(function(a) {
						var d = [];
						c.each(a, function(a) {
							var b = [];
							"characterData" === a.type ? a.target && (b = [a.target]) : "attributes" === a.type ? b = [a.target] : a.addedNodes && a.addedNodes.length && (b = c.toArray(a.addedNodes)), b.length && (d = d.concat(b))
						}), 0 < d.length && c.each(b, function(a) {
							a.callback(d)
						})
					})))
				},
				f = function(b) {
					var f = {
						attributes: !1,
						characterData: !1,
						childList: !1,
						subtree: !0
					};
					d || (e(), b.opts.attributes && (f = c.extend(f, {
						attributes: !0
					}), "array" === c.type(b.opts.attributes) && (f = c.extend(f, {
						attributeFilter: b.opts.attributes
					}))), b.opts.content && (f = c.extend(f, {
						characterData: !0,
						childList: !0
					})), a.observe(b.context, f))
				};
			return {
				start: function(a, d, e) {
					a.document && (a = a.document), d = c.extend({
						attributes: !1,
						content: !0
					}, d), c.traits.mutation && c.contains(["document", "element"], c.type(a)) && (a = {
						callback: e,
						context: a,
						opts: d
					}, b.push(a), f(a))
				},
				pause: function() {
					d++, a && a.disconnect()
				},
				resume: function() {
					d--, c.each(b, f)
				}
			}
		}(), c.traits = {
			basicCompatibility: !(c.browser.blackberry || c.browser.playstation),
			cors: window.XMLHttpRequest && void 0 !== (new window.XMLHttpRequest).withCredentials,
			crossWindowCommunication: !c.browser.ios,
			fastRegexp: !c.browser.firefox,
			json: Boolean(window.JSON) && Boolean(window.JSON.stringify) && Boolean(window.JSON.parse),
			jsRedirectSetsReferrer: c.browser.aol || !(c.browser.ie || c.browser.opera),
			mutation: window.MutationObserver && !c.browser.ie,
			performanceTiming: Boolean(window.performance && window.performance.timing),
			referrerPolicy: !c.browser.ie,
			quirksMode: !Boolean(window.addEventListener),
			windowLevelHandlers: Boolean(window.addEventListener)
		};
	var e, f, g, h;
	b = {
		EVENT_LEVEL_LINK: 1,
		EVENT_LEVEL_TOP: 2,
		PLUGIN_MANUAL: 1,
		TYPE_ACCEPTABLE: "l",
		allowed: function() {
			var a;
			return function() {
				return a || (a = c.generateNodeFilter({
					classes: ["novig"],
					rels: ["novig"],
					selectors: e.exclude_scope,
					tags: "applet embed noscript object head img input link meta param select button iframe option script style svg textarea title".split(" ")
				})), a.apply(b, arguments)
			}
		}(),
		api: function() {
			var a, b, d, f = function() {
					var a = {
						optimize: "content",
						domains: "content"
					};
					return function(b, d, f) {
						var g = c.toArray(arguments).slice(3, arguments.length),
							h = a[b];
						Boolean(h) && (f = c.extend({}, f, {
							json_payload: h
						}));
						var j, h = b,
							k = i(f);
						return j = c.extend(c.commonParams(b, e), d), j.subId && j.key !== e.key && (j.subId = null), {
							data: g,
							method: h,
							opts: k,
							params: j
						}
					}
				}(),
				g = function(a) {
					var b = {},
						d = {};
					return c.each(a, function(a) {
						var f = a[0],
							g = a[1],
							h = a[2] || {};
						a = c.toArray(a).slice(3, a.length), d[f] = c.mergeParams(d[f] || c.commonParams(f, e), g), b[f] = b[f] || [], b[f].push({
							data: a,
							opts: i(h)
						})
					}), {
						calls: b,
						params: d
					}
				},
				i = function(a) {
					return a = a || {}, "function" === c.type(a.fn) && (a.fn = function(b) {
						return function(d) {
							var e, f = d.response ? d.response[0] : null;
							return "object" === c.type(f) && "array" === c.type(f.crawl) && "object" === c.type(h.crawler) && "function" === c.type(h.crawler.crawl) && (e = c.map(f.crawl, function(a) {
								return a + ""
							}), delete f.crawl, h.crawler.crawl(e)), b.apply(a, arguments)
						}
					}(a.fn)), a
				},
				j = function(a) {
					var b = a.opts.base_url || e.api_url,
						d = a.opts.path || "/" + a.method;
					return delete a.opts.base_url, c.request.apply(c, [b + d, a.params, a.opts].concat(a.data))
				},
				k = function(a, b, d) {
					c.each(b, function(b) {
						b && b.opts && b.opts.fn && a && b.opts.fn({
							response: c.packageArgs(a),
							data: b.data,
							args: d
						})
					})
				};
			return a = function() {
				var a = function(a) {
					var b = a.data[0].params,
						d = a.data[0].calls;
					a = c.fromJSON(a.response[0]) || {}, c.each(a, function(a, e) {
						var f, g = b[e],
							h = d[e];
						"string" === c.type(a) && (f = a.match(/^[^(]+\((.*)\);?\s*$/)) && (a = c.fromJSON(f[1])), k(a, h, g)
					})
				};
				return function(b) {
					b = g(b, !0), j({
						data: b,
						method: "batch",
						params: c.extend(c.commonParams("batch", e), b.params),
						opts: {
							json_payload: "batch",
							jsonp: !1,
							fn: c.bind(a, window)
						}
					})
				}
			}(), b = function(a, b, d) {
				var e = g(a, !1);
				return a = c.reduce({}, e.calls[d], function(a, b) {
					return {
						jsonp: a.jsonp || !b.opts || !1 !== b.opts.jsonp,
						ssl: a.ssl || !b.opts || !1 !== b.opts.ssl
					}
				}), j(f(b, e.params[b], {
					fn: function(a) {
						k(a.response[0], e.calls[b], e.params[b])
					},
					jsonp: a.jsonp,
					ssl: a.ssl
				}, e))
			}, d = function() {
				return j(f.apply(this, arguments))
			}, c.batchable(function() {
				var e, f;
				return c.batched(arguments) ? (e = c.batchArgs(arguments), f = c.batchCallType(e), "batch" === f ? a.call(this, e) : b.call(this, e, f)) : d.apply(this, arguments)
			}, function() {
				return {
					batch: e.batch_calls,
					timeout: e.batch_call_timeout
				}
			})
		}(),
		addEventListener: function(a, b) {
			this.fire(a, b)
		},
		click: function() {
			var a = function(a, b) {
					if ("_self" === b) return a;
					if (c.traits.crossWindowCommunication && c.traits.jsRedirectSetsReferrer) {
						var d = a.open("", b);
						return d.focus(), d
					}
				},
				d = function(a) {
					var d = a.previousSibling,
						e = a.nextSibling,
						f = ["", a.textContent, ""],
						g = function(a, b) {
							for (var c = a, d = c.data;
								(c = c[b + "Sibling"]) && 3 === c.nodeType;) d += c.data;
							return d
						},
						h = function(a, b, c) {
							return a = a.replace(/\s+/g, " "), b = b.replace(/\s+/g, " "), c = c.replace(/\s+/g, " "), a = a.replace(/^\s+/, ""), " " === b.substr(0, 1) && (b = b.substr(1), a += " " !== a.substr(a.length - 1, 1) ? " " : ""), " " === b.substr(b.length - 1, 1) && (b = b.substr(0, b.length - 1), c = (" " !== c.substr(0, 1) ? " " : "") + c), c = c.replace(/\s+$/, ""), [a, b, c]
						};
					void 0 !== f[1] && (f[0] = d && 3 === d.nodeType ? g(d, "previous") : "", f[2] = e && 3 === e.nodeType ? g(e, "next") : "", f = h.apply(this, f), "" !== f[0] && "" !== f[2] && (f[0] = f[0].split(" ").reverse().slice(0, 10 + (" " === f[0].substr(f[0].length - 1, 1) ? 1 : 0)).reverse().join(" "), f[2] = f[2].split(" ").slice(0, 10).join(" "), a = {
						type: "context",
						itype: (c.cache(a, "params") || {}).type,
						before: f[0],
						after: f[2],
						txt: f[1],
						loc: location.href,
						out: c.getActualHref(a),
						v: 2
					}, b.log("info", c.toQuery(a))))
				};
			return function(b, f) {
				var g, h, i, j, k = {},
					l = c.context(b) || window;
				if (f = b.target || f, f = !f || f === l.name || "_top" === f && l.top === l || "_parent" === f && l.parent === l ? "_self" : f, i = a(l, f), "_self" === f || c.traits.crossWindowCommunication && c.traits.jsRedirectSetsReferrer) try {
					if (void 0 === i.document) throw !0;
					j = "jsonp"
				} catch (m) {
					j = "go"
				} else j = "go";
				if (g = c.destructing(c.apiCallback(function() {
						e.time_api && this.logEvent.stop("clk");
						var a = c.toArray(arguments);
						a.unshift(b, i, f), this.onApiClick.apply(this, a)
					}, this)), c.cache(this, "link", "string" == typeof b ? b : c.getActualHref(b)), "string" == typeof b && (b = c.createA(b, f), !this.processLink(b)) || !e.enabled) return g();
				if (!c.traits.referrerPolicy && this.isPrivate(b) && (j = "go"), h = this.clickParams(b, j), e.time_api && this.logEvent.start("clk"), e.log_context && d(b), "go" === j) h = this.redirectUrl(h, k), this.redirect(h, l, i, f);
				else if (i === l) this.api.now("click", h, c.extend(k, {
					fn: g,
					timeout: e.click_timeout
				}));
				else {
					if (c.contextIsAncestor(l, i)) return this.redirect(c.getActualHref(b), l, i, f);
					g = c.entryPoint(g), setTimeout(function() {
						g()
					}, e.click_timeout), i.document.open(), i.callback = g, i.document.write("<html><head><title>" + c.getActualHref(b) + '</title><script type="text/javascript" src="' + this.api.now("click", h, c.extend(k, {
						fn: "callback",
						"return": !0
					})) + '"></script></head></html>'), i.document.close()
				}
			}
		}(),
		clickParams: function(a, b) {
			var d = c.extend(c.cache(a, "params"), {
				format: b,
				loAsUuid: c.cache(a, "uuid") || null,
				out: c.getActualHref(a),
				reaf: e.reaffiliate || null,
				ref: window.document.referrer || null,
				rewrit: c.cache(a, "rewrit"),
				title: window.document.title,
				txt: a.innerHTML
			});
			return 128 < d.txt.length && (d.txt = d.txt.replace(/<[^>]+>/g, ""), d.txt = 128 < d.txt.length ? d.txt.substr(0, 125) + "..." : d.txt), d
		},
		detectFiltering: function() {
			var a;
			try {
				a = {}, a = new function() {
					this.detect = function(a, b) {
						function c(a, b) {
							0 == f || 1e3 < b ? a(0 == f && e) : setTimeout(function() {
								c(a, 2 * b)
							}, 2 * b)
						}

						function d() {
							--f || (e = !g && h)
						}
						var e = !1,
							f = 2,
							g = !1,
							h = !1;
						if ("function" == typeof b) {
							a += "?ch=*&rn=*";
							var i = 11 * Math.random(),
								j = new Image;
							j.onload = d, j.onerror = function() {
								g = !0, d()
							}, j.src = a.replace(/\*/, 1).replace(/\*/, i), j = new Image, j.onload = d, j.onerror = function() {
								h = !0, d()
							}, j.src = a.replace(/\*/, 2).replace(/\*/, i), c(b, 250)
						}
					}
				}
			} catch (b) {
				a = {
					detect: function(a, b) {
						b(!0)
					}
				}
			}
			return function(b) {
				var d = c.updateUrl(e.asset_url, {
					pathname: "/images/pixel.gif"
				});
				a.detect(d, b)
			}
		}(),
		enabled: function() {
			return e.enabled && g !== window && window.vglnk && (window.vglnk.key || "function" == typeof window.vglnk) && (e.enabled = !1), e.enabled
		},
		expose: function() {
			return function(a, d) {
				if ((d = d || this[a]) && !h[a]) {
					var e, f = h;
					e = d, e = "function" === c.type(e) ? c.entryPoint(c.bind(e, b)) : e, f[a] = e
				}
			}
		}(),
		fire: function() {
			var a = {};
			return function(b, d) {
				b = b.toLowerCase();
				var e = a[b] || {
					fired: !1,
					listeners: []
				};
				"function" == typeof d ? e.fired ? setTimeout(function() {
					d({
						type: b
					})
				}, 0) : e.listeners.push(d) : (e.fired = !0, c.each(e.listeners, function(a) {
					"function" == typeof a && a({
						type: b
					})
				}), e.listeners = []), a[b] = e
			}
		}(),
		handleRightClick: function(a, b) {
			if (e.rewrite_modified && a && b) switch (b) {
				case "setup":
					c.cache(a, "href") || c.cache(a, "href", a.href), a.href = this.redirectUrl(this.clickParams(a, "go")), setTimeout(c.entryPoint(c.bind(function() {
						this.handleRightClick(a, "teardown")
					}, this)), 0);
					break;
				case "teardown":
					c.cache(a, "href") && (a.href = c.cache(a, "href"))
			}
		},
		harmony: function(a) {
			return e.harmony_level <= a
		},
		init: function() {
			var a = function() {
				var a = !0 === window.document.__v5k;
				return window.document.__v5k = !0, !a
			};
			return function() {
				var b = this;
				if (f = {}, a()) {
					try {
						b.initLibEvents(), b.initNamespace(), b.initOptions()
					} catch (d) {}
					return c.exceptionLogger(c.bind(b.logException, b), !e.dev), c.each(e.script_timeout), c.entryPoint(function() {
						b.initProcessors(), b.initDRApi(), b.initApi(), b.enabled() && (b.initLegacyCallbacks(), b.ping())
					})()
				}
			}
		}(),
		initApi: function() {
			var d, f = {};
			if (window.vglnk)
				for (d in window.vglnk) "_plugin" === d.substr(-7) && (f[d] = window.vglnk[d]);
			h = g[a] = c.noop, this.expose("click"), this.expose("link", c.bind(function(a) {
				"element" === c.type(a) && a.href && (this.initContext(c.context(a)), this.processLink(a))
			}, this)), this.expose("open", c.bind(this.click, this)), this.expose("$", c.clone(c)), this.expose("allowed"), this.expose("api"), this.expose("apiNow", c.bind(this.api.now, this.api)), this.expose("harmony"), this.expose("isBlacklisted"), this.expose("isCommercial"), this.expose("opt"), this.expose("platform"), this.expose("clickParams", function() {
				return c.extend(c.commonParams("click", e), b.clickParams.apply(b, arguments))
			}), this.expose("registerProcessor", function() {
				if (0 < arguments.length) return b.registerProcessor.apply(b, arguments)
			}), this.expose("sendLinks"), c.extend(h, h === window.vglnk ? f : {})
		},
		initContext: function() {
			var a = [];
			return function(b) {
				return void 0 === b ? a : void(b && !c.contains(a, b) && (a.push(b), this.initLinks(b), this.initEvents(b)))
			}
		}(),
		initDomObserver: function(a, d) {
			c.observer.start(a, d, c.batchable(function(a) {
				c.batched(arguments) && (a = c.reduce([], c.batchArgs(arguments, 0), function(a, b) {
					return a.concat(b)
				})), a = c.all(c.unique(a), function(a) {
					return Boolean(a.parentNode) && b.allowed(a)
				}), 0 < a.length && (c.each(c.withScope(a, "a[href]", {
					ancestors: !1
				}), function(a) {
					b.processLinks(a[1])
				}), c.each(f, function(c, d) {
					c.opts.mode !== b.PLUGIN_MANUAL && b.runPlugin(d, a)
				}))
			}, function() {
				return {
					batch: e.batch_mutation,
					timeout: e.batch_mutation_timeout
				}
			}))
		},
		initDRApi: function() {
			var a = !1;
			window.DrivingRevenue = c.entryPoint(c.destructing(c.bind(function() {
				a = !0, e.dr_key = window.DR_id, this.enabled() && this.ping()
			}, this))), c.on("DOMReady", function() {
				if (!a) try {
					delete window.DrivingRevenue
				} catch (b) {
					window.DrivingRevenue = void 0
				}
			})
		},
		initEvents: function(a) {
			var d = c.traits.windowLevelHandlers ? a : a.document,
				f = function(d) {
					d = d || a.event, (d = c.eventLink(d)) && !c.cache(d, "evented") && (h(b.EVENT_LEVEL_LINK, d), c.cache(d, "evented", !0))
				},
				g = function(a, d) {
					return function() {
						var e = [a].concat(c.toArray(arguments));
						d.apply(b, e)
					}
				},
				h = function(a, d) {
					c.on(d, "click", g(a, b.onClick)), c.on(d, "contextmenu", g(a, b.onContextmenu))
				};
			e.dynamic && c.on("DOMReady", function() {
				b.initDomObserver(a), e.dynamic_scope && c.each(c.select(e.dynamic_scope, a.document), function(a) {
					b.initDomObserver(a, {
						attributes: ["class", "id", "style"],
						content: !1
					})
				})
			}), c.on(d, "copy", c.bind(b.onCopy, b)), c.on(d, "mousedown", f), c.on("DOMReady", function() {
				c.each(a.document.links, function(a) {
					c.on(a, "mousedown", f)
				})
			}), (!c.traits.quirksMode || b.harmony(c.harmony.UNSAFE_QUIRKSMODE_EVENTS)) && h(b.EVENT_LEVEL_TOP, d)
		},
		initLegacyOptions: function() {
			var a, b = {
				DR_id: "dr_key",
				vglnk_api_key: "key",
				vglnk_cuid: "cuid",
				vglnk_domain: "api_url",
				vglnk_reaf: "reaffiliate",
				vglnk_subid: "sub_id"
			};
			for (a in b) void 0 !== window[a] && (h[b[a]] = window[a], "vglnk_domain" === a && (h[b[a]] += "/api"))
		},
		initLegacyCallbacks: function() {
			var a, b = {
				vl_cB: c.bind(this.onApiClick, this),
				vl_disable: function() {
					e.enabled = !1
				}
			};
			for (a in b) window[a] = b[a]
		},
		initLibEvents: function() {
			c.on(b), c.ready(c.bind(function() {
				this.fire("DOMReady")
			}, this))
		},
		initLinks: function(a) {
			var b = c.bind(function(a) {
				this.processLinks(c.toArray(a.document.links))
			}, this);
			void 0 === a ? c.each(this.initContext(), b) : b(a)
		},
		initNamespace: function() {
			window.vglnk && window.vglnk.key && (a = "vglnk");
			var b, c = window,
				d = a.split(".");
			for (a = d.pop(); 0 < d.length;) b = d.shift(), c[b] = c[b] || {}, c = c[b];
			g = c, h = g[a] = g[a] || {}
		},
		initOptions: function() {
			var a;
			this.initLegacyOptions(), e = c.extend(this.publicOptions({
				anywhere_url: "//redirect.viglink.com",
				api_url: "//api.viglink.com/api",
				asset_url: "//cdn.viglink.com/api",
				cuid: null,
				dev: !1,
				dr_key: null,
				enabled: c.traits.basicCompatibility,
				key: null,
				link_urls: !0,
				partner: null,
				platform: c.platforms.NONE.id,
				reaffiliate: !1,
				sub_id: null,
				sync_url: "//api.viglink.com/api",
				blacklist_domains: {},
				commercial_domains: {},
				harmony_level: c.harmony.DEFAULT,
				link_target: null,
				private_domains: null,
				rewrite_any: !0,
				rewrite_modified: !1,
				rewrite_original: !0
			}), e, h, {
				batch_calls: !0,
				batch_call_timeout: 100,
				batch_links: !1,
				batch_mutation: !0,
				batch_mutation_timeout: 250,
				click_timeout: 1e3,
				debug: !1,
				declare_handler: !1,
				dynamic: !0,
				dynamic_scope: null,
				exclude_scope: null,
				hop_timeout: 2e3,
				insert_host: "i.viglink.com",
				library_id: null,
				links_merge_timeout: 75,
				links_version: 3.2,
				log_context: !0,
				nofollow: {},
				norewrite: {},
				script_timeout: 2e3,
				testing_js: [],
				time_api: !1,
				time_load: !1,
				time_log_timeout: 3e3,
				plugins: {
					crawler: {},
					harmony: {},
					link_affiliation: {},
					modified_clicks: {}
				}
			}), e.sync_url = e.sync_url || e.api_url;
			for (a in e) "_plugin" === a.substr(-7) && delete e[a]
		},
		initPlugins: function() {
			var a, d = 1,
				g = {
					link_affiliation: "convert",
					link_optimization: "optimize",
					page_harmony: "harmony",
					partner_integration: "partners",
					product_linker: "insert",
					product_widget: "spotlight"
				},
				i = ["spotlight"],
				j = ["harmony"],
				k = function(b) {
					return function(b) {
						return function() {
							delete f[b].opts.mode, d = 1, clearTimeout(a), m()
						}
					}(b)
				},
				l = function(a) {
					var b;
					return c.find(g, function(a, c) {
						return "insert" === a && (b = c)
					}), a[b] || (a[b] = {
						enabled: !0,
						key: e.key,
						link_phrases: !1
					}), a[b].link_urls = e.link_urls, a
				},
				m = function() {
					var g = {
							_ran: !1,
							init: c.noop,
							initDocuments: c.noop,
							initNodes: c.noop,
							"public": {}
						},
						i = function(a, d) {
							a.setup = a.setup || (window.vglnk ? window.vglnk[d + "_plugin"] : null), "function" === c.type(a.setup) && (Boolean(a.initDocuments) || (a = c.extend(a, g, a.setup(c.reformatKeys(a.opts), c.clone(c), h, k(e.key))), a["public"] && b.expose(d, a["public"], !1)), a.opts.mode !== b.PLUGIN_MANUAL && b.runPlugin(d))
						},
						k = function(a) {
							var d = function() {
								if (a) {
									var d = c.toArray(arguments);
									d.unshift("custom", a), b.log.apply(this, d)
								}
							};
							return d.event = b.logEvent, d
						},
						l = function(a) {
							return !Boolean(a._ran)
						};
					a = null, c.each(j, function(a) {
						var b = f[a];
						b && !Boolean(b._ran) && i(b, a)
					}), c.each(c.all(f, l), i), c.find(f, l) && (a = setTimeout(c.entryPoint(m), Math.min(Math.max(Math.pow(2, ++d), 100), 5e3)))
				},
				n = function() {
					setTimeout(function() {
						b.api.flush()
					}, 100), m(), c.on("DOMReady", function() {
						setTimeout(b.api.flush, 0)
					})
				};
			return function(a) {
				a = l(a), c.each(a, c.bind(function(a, b) {
					b = g[b] || b, "object" == typeof a && !1 !== a.enabled && (f[b] = {
						opts: a
					}, c.contains(i, b) && c.jsonp(this.opt("asset_url") + "/plugins/" + b + ".js"), a.mode === this.PLUGIN_MANUAL && this.expose("init_" + b, k(b)))
				}, this)), n()
			}
		}(),
		initProcessors: function() {
			this.registerProcessor(function(a) {
				var b;
				b = c.createA(e.api_url), "/api/click" !== a.pathname || a.hostname !== b.hostname && !a.hostname.match(/(^|\.)(api|cdn|apicdn)\.viglink\.com$/) || (b = c.fromQuery(a.search), void 0 !== b.out && (a.href = b.out, delete b.out, c.cache(a, "params", b)))
			}), this.registerProcessor(function(a) {
				e.nofollow[a.href] && !c.hasRel(a, "nofollow") && (a.rel = (a.rel ? a.rel + " " : "") + "nofollow")
			}), this.registerProcessor(function(a) {
				e.declare_handler && c.attributes(a, {
					"data-hl": "viglink"
				})
			}), this.registerProcessor(function(a) {
				window.IPBoard && window.IPBoard.prototype && window.IPBoard.prototype.delegate && c.hasRel(a, "external") && (a.rel = a.rel.replace(/(^| )external( |$)/, ""), a.target = "_blank")
			})
		},
		isAuctionLink: function(a) {
			return !0 === c.cache(a, "auctioned")
		},
		isBlacklisted: function(a) {
			return a = c.canonicalizeHostname(a), "object" === c.type(e.blacklist_domains) && e.blacklist_domains[a]
		},
		isCommercial: function(a) {
			return a = c.canonicalizeHostname(a), "object" === c.type(e.commercial_domains) && e.commercial_domains[a]
		},
		isPrivate: function(a) {
			if ("array" !== c.type(e.private_domains)) return !1;
			var b = c.canonicalizeHostname(a);
			return c.find(e.private_domains, function(a) {
				return RegExp("(^|\\.)" + c.escapeRegExp(a) + "$", "i").test(b)
			})
		},
		isRewritable: function() {
			var a = c.canonicalizeHostname(document.location),
				d = c.generateNodeFilter({
					classes: ["norewrite"],
					rels: ["norewrite", "noskim"],
					custom: function(d, f) {
						if (!f) return !1;
						var g = c.canonicalizeHostname(d),
							h = "",
							i = !1;
						try {
							h = d.protocol, g.charAt(0)
						} catch (j) {
							return !0
						}
						if (i = Boolean("" === g || !h.match(/^https?:$/i) || e.norewrite[g]), h = !i) var h = c.cache(d, "type"),
							k = c.cache(d, "params") || {},
							h = !Boolean(h || k.type);
						return h && (i = Boolean(a === g || !e.rewrite_original || !e.rewrite_any && !b.isCommercial(d))), i
					}
				});
			return function(a) {
				return d(a)
			}
		}(),
		log: function(a, b, d, f) {
			var g, h = c.toQuery({
				libId: e.library_id,
				nocache: c.uniqid()
			});
			if (g = "pixel.gif", "custom" === a) h += "&" + c.toQuery({
				key: b,
				type: d
			}), c.each("array" === c.type(f) ? f : [f], function(a) {
				c.each(["e", "i", "o"], function(b) {
					delete a[b]
				}), h += "&" + c.toQuery(a)
			});
			else {
				if (h += "&" + c.toQuery({
						key: e.key,
						drKey: e.key ? null : e.dr_key,
						subId: e.sub_id
					}), "time" === a && c.traits.json) g = "time.gif", a = {
					e: c.toJSON(b),
					v: 2
				};
				else if ("exception" === a) a = {
					e: b,
					o: d
				};
				else {
					if ("info" !== a) return;
					a = {
						i: b
					}
				}
				h += "&" + c.toQuery(a)
			}
			g = e.api_url + "/" + g + "?" + h, c.pii.transmits(g) || (c.createEl("img").src = g)
		},
		logEvent: function() {
			var a = {},
				d = c.time(),
				f = c.traits.performanceTiming ? window.performance.timing.domLoading : null,
				g = c.batchable(function() {
					var a;
					a = c.batched(arguments) ? c.batchArgs(arguments) : [arguments], a = c.map(a, function(a) {
						return c.prune({
							event: a[0],
							time: a[1],
							total: a[2]
						})
					}), a.length && b.log("time", a)
				}, function() {
					return {
						timeout: e.time_log_timeout
					}
				});
			return {
				start: function(b) {
					a[b] = a[b] || {
						logged: 0,
						times: []
					}, a[b].times.push(c.time())
				},
				stop: function(b) {
					var d, e, h = c.time();
					a[b] && a[b].times && a[b].times.length && (d = a[b].times.shift(), e = f && 0 === a[b].logged ? h - f : null, a[b].logged += 1, g(b, h - d, e))
				},
				load: function() {
					f && g("load", d - f)
				}
			}
		}(),
		logException: function(a) {
			if (e.debug) {
				var b = {
					link: c.cache(this, "link"),
					loc: document.location.href,
					UA: navigator.userAgent
				};
				"string" == typeof a ? b.message = a : b = c.extend(b, a), this.log("exception", a, c.toQuery(b))
			}
		},
		onApiClick: function(a, b, d, f, g) {
			var h = f || c.getActualHref(a),
				i = c.bind(function() {
					this.redirect(h, c.context(a), b, d)
				}, this);
			"object" == typeof g && (g.tracking || g.image) ? (f = c.createEl(g.tracking ? "iframe" : "img", {
				src: g.tracking || g.image
			}, {
				height: 0,
				width: 0,
				visibility: "hidden"
			}), document.body.appendChild(f), setTimeout(c.entryPoint(i), g.timeout || e.hop_timeout)) : i()
		},
		onApiPing: function(a, d, f, g, h, i) {
			e.rewrite_original = !1, h = c.reformatKeys(h || {});
			var j, k;
			g = function(a) {
				var b = {},
					d = function(a) {
						c.isArray(a) ? b[a[0]] = a[1] : b[a] = 1
					};
				return c.isArray(a) && c.each(a, d), b
			}, c.exceptionLogger(function() {
				c.canonicalizeHostname(window.location).match(/(^|\.)cnn\.com$/) && (e.exclude_scope = "#optanon,.OUTBRAIN,*[class*=outbrain],*[class*=partner],*[class*=sponsored]")
			})(), c.exceptionLogger(function() {
				c.canonicalizeHostname(window.location).match(/^(www\.)?msn\.com$/) && (e.dynamic_scope = ".gallery-container > .gallerydata,section.gallery:first-child ~ .gallerydata", e.declare_handler = !0)
			})(), k = c.extend(e.plugins, h.plugins), e = c.extend(e, h), delete e.plugins, e.click_timeout = d, e.library_id = a, h.time && (e.time_api = e.time_load = h.time), e.time_api && this.logEvent.stop("png"), e.time_load && this.logEvent.load(), "array" === c.type(e.testing_js) && 0 < e.testing_js.length && c.each(e.testing_js, function(a) {
				c.jsonp(a)
			}), c.extend(e.nofollow, g(i)), c.extend(e.norewrite, g(f));
			for (j in e) "on" === j.toLowerCase().substr(0, 2) && 2 < j.length && "function" === c.type(e[j]) && (c.on(b, j.toLowerCase().substr(2), c.bind(e[j], window)), delete e[j]);
			this.initPlugins(k), this.initContext(window), this.fire("libready")
		},
		onClick: function(a, b) {
			b = b || window.event;
			var d = b.ctrlKey || b.metaKey || b.altKey || b.shiftKey,
				e = b.which && 1 === b.which || 0 === b.button,
				f = c.eventLink(b);
			if (f && e && !d && !c.isDefaultPrevented(b) && this.allowed(f) && this.isRewritable(f) && !this.isAuctionLink(f) && this.shouldHandleClick(a, f)) return this.click(f), c.preventDefault(b)
		},
		onContextmenu: function(a, b) {
			var d = c.eventLink(b || window.event);
			d && this.allowed(d) && this.isRewritable(d) && !this.isAuctionLink(d) && this.shouldHandleClick(a, d) && this.handleRightClick(d, "setup")
		},
		onCopy: function(a) {
			var d, e, f, g = [];
			if (window.getSelection)
				for (e = window.getSelection(), a = 0, d = e.rangeCount; a < d; a++) {
					try {
						f = e.getRangeAt(a).toString().replace(/((^)\s+|\s+$|\r)/g, "").replace(/\s*\n\s*/g, "\n")
					} catch (h) {}
					0 < f.length && 128 >= f.length && g.push(f)
				}
			c.each(g, function(a) {
				b.log("info", c.toQuery({
					type: "selection",
					txt: a,
					loc: location.href
				}))
			})
		},
		opt: function(a, b) {
			return void 0 !== b && void 0 !== this.publicOptions()[a] && (e[a] = b), e[a]
		},
		ping: function() {
			var a = !1;
			return function() {
				if (!a && (e.key || e.dr_key)) {
					var b = {
						ref: document.referrer || null
					};
					a = !0, c.pii.transmits(this.api.now("ping", b, {
						"return": !0
					})) || (this.logEvent.start("png"), this.detectFiltering(c.bind(function(a) {
						a && (e.batch_calls = !1, b.type = this.TYPE_ACCEPTABLE), this.api.now("ping", b, {
							fn: c.apiCallback(this.onApiPing, this)
						})
					}, this)))
				}
			}
		}(),
		platform: function() {
			return c.platforms.findById(e.platform) || c.platforms.NONE
		},
		processLink: function(a) {
			var b = c.cache(a, "processors") || {},
				d = this.allowed(a),
				e = this.isRewritable(a);
			return c.each(this.registerProcessor(), function(c) {
				!b[c.id] && d && (e || c.opts.any) && c.fn(a), b[c.id] = !0
			}), c.cache(a, "processors", b), a
		},
		processLinks: function(a) {
			c.each(a, c.bind(this.processLink, this))
		},
		publicOptions: function() {
			var a = {};
			return function(b) {
				return "object" === c.type(b) && (a = b), c.extend({}, a)
			}
		}(),
		redirect: function(a, d, e, f) {
			var g = function(a, d, e) {
				var f, g = [];
				if (c.traits.referrerPolicy) {
					f = function(a) {
						var b = d.document.createElement("meta");
						b.name = "referrer", b.content = a, d.document.getElementsByTagName("head")[0].appendChild(b)
					}, b.isPrivate(a) && (g = [f("no-referrer"), f("never")]), e();
					try {
						c.each(g, function(a) {
							a.parentNode.removeChild(a)
						})
					} catch (h) {}
				} else e()
			};
			d = d || window.top, c.traits.crossWindowCommunication || e ? c.traits.jsRedirectSetsReferrer ? setTimeout(c.entryPoint(function() {
				e && e !== d ? c.contextIsAncestor(d, e) ? e.location = a : e.location.replace(a) : g(a, d, function() {
					d.location = a
				})
			}), 0) : ("_blank" === f && (f = c.uniqid("win_")), f = c.createA(a, f), f.rel = "norewrite", d.document.body.appendChild(f), f.click(), f.parentNode.removeChild(f)) : (f = d.open(a, f), f.focus())
		},
		redirectUrl: function(a, b) {
			return b = b || {}, this.api.now("click", a, c.extend(b, {
				base_url: e.anywhere_url,
				path: "/"
			}, {
				"return": !0
			}))
		},
		runPlugin: function(a, b) {
			var d = window.document,
				e = f[a];
			e && e.initDocuments && (b ? e.initNodes(b) : (e.init(), "function" === c.type(e.initDocuments) && "document" === c.type(d) && e.initDocuments([d]), "function" === c.type(e.initNodes) && "element" === c.type(d.body) && c.on("DOMReady", function() {
				e.initNodes([d.body])
			})), e._ran = !0)
		},
		registerProcessor: function() {
			var a = !1,
				b = [],
				d = function(d, e) {
					return void 0 === d ? b : void("function" === c.type(d) && (e = c.extend({
						any: !1
					}, e), b.push({
						fn: d,
						id: c.uniqid(),
						opts: e
					}), a && this.initLinks()))
				};
			return d(function() {
				a = !0
			}), d
		}(),
		sendLinks: c.mergeable(function() {
			return {
				batchFn: b.api,
				nonBatchFn: b.api.now,
				batchable: e.batch_links,
				timeout: e.links_merge_timeout
			}
		}),
		shouldHandleClick: function(a, b) {
			var d = !0,
				e = "inserted" === c.cache(b, "type");
			return a === this.EVENT_LEVEL_LINK && (d = this.harmony(c.harmony.LINK_EVENTS) || (this.isCommercial(b) || e) && this.harmony(c.harmony.COMMERCIAL_LINK_EVENTS)), d
		}
	}, b.init();
	try {
		delete window.vglnk_self
	} catch (i) {}
}("undefined" == typeof vglnk_self ? "vglnk" : vglnk_self), window.vglnk = window.vglnk || {}, window.vglnk.convert_plugin = function(a, b, c) {
	var d, e, f = {};
	return a = b.extend({
		any: !0,
		convert_minimum_bid: !1,
		check_exp_domains: !0
	}, a), e = {
		getDomains: function() {
			var a = [];
			b.each(f, function(b, c) {
				2 !== f[c] && (a.push(c), f[c] = 2)
			}), 0 < a.length && c.apiNow("domains", {
				domains: a.join("|"),
				v: "2"
			}, {
				fn: b.apiCallback(e.onDomainApi, e)
			})
		},
		init: function() {
			c.opt("link_target", a.link_target), c.opt("rewrite_any", a.any), c.opt("rewrite_original", !0), (d = !a.any || c.harmony(b.harmony.COMMERCIAL_LINK_EVENTS) || a.convert_minimum_bid || a.check_exp_domains) && c.registerProcessor(b.bind(function(a) {
				this.initDomainLookup(), this.saveDomain(a)
			}, this), {
				any: !0
			})
		},
		initDomainLookup: function() {
			var a = !1;
			return function() {
				a || (a = !0, b.on("DOMReady", b.bind(this.getDomains, this)))
			}
		}(),
		onDomainApi: function() {
			var a = b.destructing(function() {
				c.registerProcessor(function(a) {
					c.opt("declare_handler") && b.attributes(a, {
						"data-hl": "viglink"
					})
				}), c.registerProcessor(b.bind(function(a) {
					e.unlinkBlacklisted(a)
				}, this), {
					any: !0
				})
			});
			return function(d) {
				var e = c.opt("blacklist_domains") || {},
					f = c.opt("commercial_domains") || {};
				b.each(d.results, function(a, b) {
					f[b] = !0, a.unlink && (e[b] = !0)
				}), c.opt("commercial_domains", f), c.opt("blacklist_domains", e), a()
			}
		}(),
		saveDomain: function(a) {
			a = b.canonicalizeHostname(a), f[a] = f[a] || 1
		},
		unlinkBlacklisted: function(a) {
			c.isBlacklisted(a) && b.unlink(a)
		}
	}, {
		init: b.bind(e.init, e),
		initNodes: function() {
			e.getDomains()
		}
	}
}, window.vglnk = window.vglnk || {}, window.vglnk.crawler_plugin = function(a, b, c) {
	var d = [],
		e = c.platform();
	return a = {
		crawl: function(a) {
			e && "array" === b.type(a) && 0 !== a.length && (a = b.all(a, function(a) {
				return !b.contains(d, a)
			}), a = this.findPostsById(a), b.each(a, b.bind(function(a) {
				a.content = this.redact(a.el.innerHTML.replace(/(^\s+|\s+$)/g, "")), delete a.el
			}, this)), a = b.all(a, function(a) {
				return Boolean(a.content && a.id)
			}), 0 < a.length && this.processPosts(a))
		},
		findPostsById: function(a) {
			return b.all(b.map(e.getPosts(), function(a) {
				return {
					el: a,
					id: e.getPostId(a)
				}
			}), function(c) {
				return b.contains(a, c.id)
			})
		},
		processPosts: function(a) {
			a = b.map(a, function(a) {
				return d.push(a.id), {
					c: a.content,
					i: a.id
				}
			}), c.api("content", {
				content: b.toJSON({
					ct: a,
					pt: e.id,
					u: location.href
				})
			}, {
				jsonp: !1
			})
		},
		redact: function(a) {
			return b.pii.redact(a)
		}
	}, {
		"public": {
			crawl: b.bind(a.crawl, a)
		}
	}
}, window.vglnk = window.vglnk || {}, window.vglnk.modified_clicks_plugin = function(a, b, c) {
	return {
		init: function() {
			c.opt("rewrite_modified", !0)
		}
	}
}, window.vglnk = window.vglnk || {}, window.vglnk.privacy_plugin = function(a, b, c) {
	return {
		init: function() {
			a.domains && c.opt("private_domains", a.domains)
		}
	}
}, window.vglnk = window.vglnk || {}, window.vglnk.dr_search_box_plugin = function(a, b, c) {
	a = b.extend({
		key: null
	}, a);
	var d = {
		init: function(a) {
			b.each(this.getDRSearchForms(a), function(a) {
				if (!b.cache(a, "evented")) {
					var c = d.getInput(a),
						e = function() {
							c.value || b.css(c, {
								"background-image": "url(http://cdn.viglink.com/images/ebay_watermark.gif)"
							})
						};
					b.cache(a, "evented", !0), a.onsubmit = null, c.onfocus = null, c.onblur = null, b.on(c, "focus", function() {
						b.css(c, {
							"background-image": "none"
						})
					}), b.on(c, "blur", e), e(), b.on(a, "submit", function(b) {
						d.onSubmit(b, a)
					})
				}
			})
		},
		getDRSearchForms: function(a) {
			var c = [];
			return b.each(a, function(a) {
				"element" === b.type(a) && b.each(a.getElementsByTagName("form"), function(a) {
					d.getInput(a) && a.id.match(/^DR-ebay-search(CSS|2)?$/i) && c.push(a)
				})
			}), c
		},
		getInput: function(a) {
			return a.p || a.q2
		},
		onSubmit: function(e, f) {
			e = e || window.event;
			var g = "http://shop.ebay.com/i.html?" + b.toQuery({
					_nkw: d.getInput(f).value
				}),
				g = b.createA(g, "_blank");
			return b.cache(g, "params", {
				key: a.key
			}), c.click(g), b.preventDefault(e)
		}
	};
	if (a.key) return {
		init: b.bind(d.init, d),
		initNodes: function(a) {
			d.init(a)
		}
	}
}, window.vglnk = window.vglnk || {}, window.vglnk.harmony_plugin = function(a, b, c) {
	return a = b.extend({
		level: b.harmony.DEFAULT
	}, a), {
		init: function() {
			var b = parseFloat(a.level, 10);
			isFinite(b) && c.opt("harmony_level", b)
		}
	}
}, window.vglnk = window.vglnk || {}, window.vglnk.optimize_plugin = function(a, b, c, d) {
	var e, f = {
		uuid: "uuid",
		index: "idx",
		optimized_url: "url",
		aliases: "aka"
	};
	return a = b.extend({
		scope: "body"
	}, a), e = {
		cache: function() {
			var a = {},
				b = {};
			return {
				links: {
					get: function(b) {
						return a[b]
					},
					set: function(b, c) {
						var d = {};
						d[f.optimized_url] = c[f.optimized_url], d[f.uuid] = c[f.uuid], d[f.aliases] = c[f.aliases], a[b] = d
					}
				},
				stats: {
					increment: function(a, c) {
						if (b[a] || (b[a] = {}), c)
							if ("rep" === c) b[a].rep = (b[a].rep || 0) + 1;
							else {
								var d;
								d = b[a].ex = b[a].ex || {}, d[c] = (d[c] || 0) + 1
							}
						else b[a].n = (b[a][f.insertion_count] || 0) + 1
					},
					getAndReset: function() {
						var a = b;
						return b = {}, a
					}
				}
			}
		}(),
		filterLinkNodes: function() {
			var a = {
					sameDomainOrInternal: function() {
						var a = window.location.hostname;
						return function(b) {
							return a === b.hostname
						}
					}()
				},
				c = function(c) {
					return b.all(c, function(c) {
						return b.every(a, function(a) {
							return !a(c)
						})
					})
				};
			return function(a) {
				var d = {
					needs_optimization: [],
					needs_call: []
				};
				return b.each(c(a), function(a) {
					var c = e.cache.links.get(a.href);
					c && c[f.uuid] && b.cache(a, "uuid", c[f.uuid]), c && c[f.optimized_url] ? d.needs_optimization.push(a) : c && "false" === c[f.optimized_url] || d.needs_call.push(a)
				}), d
			}
		}(),
		generateAliases: function(a) {
			var c = [],
				d = e.cache.links.get(a.href),
				c = c.concat(d[f.aliases] || []);
			return c.push(b.canonicalizeHostname(a.href)), c.push(b.canonicalizeHostname(d[f.optimized_url])), b.unique(c)
		},
		getLinks: function(a) {
			c.opt("time_api") && d.event.start("opt"), c.sendLinks("optimize", {
				links: b.unique(b.map(a, function(a) {
					return a.href
				})),
				mode: ["O"],
				u: location.href,
				ver: c.opt("links_version")
			}, {
				fn: b.bind(e.onOptimizeApi, e)
			}, a)
		},
		log: b.batchable(function() {
			var a = {
				stats: b.toJSON(e.cache.stats.getAndReset())
			};
			4 < a.stats.length && d("loJsLog", a)
		}, function() {
			return {
				timeout: 1e3
			}
		}),
		onOptimizeApi: function(a) {
			var g = a.response[0],
				h = a.args.links,
				i = a.data[0];
			c.opt("time_api") && d.event.stop("opt"), "object" === b.type(g) && (a = ["opt", "non", "unk"], b.each(a, function(a) {
				g[a] && g[a].length && b.each(g[a], function(b) {
					var c = h[b[f.index]];
					"non" === a && (b[f.optimized_url] = !1), e.cache.links.set(c, b)
				})
			}), a = e.filterLinkNodes(i), e.optimizeLinks(a.needs_optimization))
		},
		optimizeLinks: function(a) {
			b.each(a, function(a) {
				b.cache(a, "rewrit", !1)
			}), a = e.runExclusionFilters(a), b.each(a, this.optimizeLink), b.traits.json && e.log()
		},
		optimizeLink: function() {
			var c = function(a) {
					return a.replace(/^https?:\/\//, "")
				},
				d = function(a, b) {
					for (var c; c = a.firstChild;) a.removeChild(c);
					a.appendChild(document.createTextNode(b))
				},
				g = function(a) {
					var d = a.href,
						f = a.textContent || a.innerText,
						g = Boolean(f),
						h = e.generateAliases(a),
						i = function() {
							var a = c(d).toLowerCase(),
								e = f.toLowerCase().replace(a, "");
							return b.some(h, function(a) {
								return -1 !== e.indexOf(a.toLowerCase())
							})
						},
						j = function() {
							var a = f.split(/(?:\.\.\.|\u2026)/);
							return !(2 > a.length) && RegExp("^" + b.map(a, b.escapeRegExp).join(".+") + "$").test(d)
						},
						k = function() {
							var c = b.canonicalizeHostname(a);
							return b.canonicalizeHostname(b.createEl("a", {
								href: f
							})) === c
						},
						l = function() {
							var c;
							return !!k() && (c = b.fromQuery(a.search), b.find(c, function(a) {
								return a === f
							}))
						};
					return {
						full_replace: Boolean(g && (d === f || c(d) === f || j() || l())),
						exclude: Boolean(g && i()),
						partial_replace: Boolean(g && (-1 !== f.indexOf(d) || -1 !== f.indexOf(c(d))))
					}
				};
			return function(h) {
				var i, j = e.cache.links.get(h.href),
					k = j[f.optimized_url];
				if (i = g(h), k && !a.observer) {
					if (i.full_replace) d(h, k), e.cache.stats.increment(j[f.uuid], "rep");
					else {
						if (i.exclude) return void e.cache.stats.increment(j[f.uuid], "a");
						i.partial_replace && (i = "undefined" !== b.type(h.textContent) ? h.textContent : h.innerText, i = -1 !== i.indexOf(h.href) ? i.replace(h.href, k) : i.replace(c(h.href), k), d(h, i), e.cache.stats.increment(j[f.uuid], "rep"))
					}
					k = -1 === k.indexOf("http://") ? "http://" + k : k, h.href = k
				}
				e.cache.stats.increment(j[f.uuid]), b.cache(h, "rewrit", !0)
			}
		}(),
		runExclusionFilters: function() {
			var a = b.generateNodeFilter({
					classes: ["nooptimize", "norewrite"],
					rels: ["nooptimize", "norewrite", "noskim"],
					custom: function(a, c) {
						if (c) return Boolean(b.cache(a, "type"))
					}
				}),
				d = function(a) {
					var c = e.generateAliases(a),
						d = b.context(a).document.title;
					return b.every(c, function(a) {
						return -1 === d.indexOf(a)
					})
				},
				g = function() {
					var a = function(a, c) {
							var d = b.reduce([], ["prev_tokens", "next_tokens"], function(b, c) {
								return a[c] && a[c].length && (b = b.concat(a[c])), b
							}).join(" ").toLowerCase();
							return b.some(c, function(a) {
								return -1 !== d.indexOf(a.toLowerCase())
							})
						},
						c = function() {
							var a = function(a) {
								return a = "undefined" !== b.type(a.textContent) ? a.textContent : a.innerText, b.all(a.split(/\s+/g), function(a) {
									return "" !== a
								})
							};
							return function(c) {
								for (var d = {
										prev_tokens: [],
										next_tokens: []
									}; c && c !== document.body.parentNode;) {
									for (var e = d, f = c.previousSibling, g = c.nextSibling; f || g;) f && b.nodesOfType([f], 1, 3).length && "SCRIPT" !== f.tagName && (e.prev_tokens = e.prev_tokens.concat(a(f).reverse())), f = !!f && f.previousSibling, g && b.nodesOfType([g], 1, 3).length && "SCRIPT" !== g.tagName && (e.next_tokens = e.next_tokens.concat(a(g))), g = !!g && g.nextSibling;
									if (20 < d.prev_tokens.length + d.next_tokens.length + 0) break;
									c = c.parentNode
								}
								return d
							}
						}();
					return function(b) {
						var d = e.generateAliases(b);
						return b = c(b), 80 < b.prev_tokens.length + b.next_tokens.length + 0 && (b.prev_tokens = b.prev_tokens.slice(0, 40), b.next_tokens = b.next_tokens.slice(0, 40)), b.prev_tokens = b.prev_tokens.reverse(), !a(b, d)
					}
				}();
			return function(h) {
				return b.all(h, function(b) {
					var h = e.cache.links.get(b.href)[f.uuid];
					return c.allowed(b) && a(b) ? g(b) ? !!d(b) || (e.cache.stats.increment(h, "t"), !1) : (e.cache.stats.increment(h, "p"), !1) : (e.cache.stats.increment(h, "n"), !1)
				})
			}
		}()
	}, {
		initNodes: function(d) {
			var f;
			d = b.nodesOfType(d, 1), d = b.all(b.links(d, a.scope), c.allowed), d = e.filterLinkNodes(d), (f = d.needs_optimization) && f.length && e.optimizeLinks(f), (d = d.needs_call) && d.length && e.getLinks(d)
		}
	}
}, window.vglnk = window.vglnk || {}, window.vglnk.insert_plugin = function(a, b, c, d) {
	var e, f, g, h, i = null,
		j = null;
	if (a = b.extend({
			cat: null,
			dynamic_sample_rate: 1,
			insertion_order: "api",
			key: null,
			link_phrases: !0,
			link_target: null,
			link_urls: !0,
			manual_mode: 1 === a.mode,
			per_page: null,
			per_phrase: 5,
			proximity: null,
			same_proximity: 100,
			scope: null,
			ui: !0
		}, a), "api" !== a.insertion_order && "dom" !== a.insertion_order && (a.insertion_order = "api"), a.key) return e = c.platform(), f = {
		cache: function() {
			var c, d, e = function() {
					c = {}, d = {}
				},
				f = function(a, e) {
					var f, g = d,
						h = c,
						i = {};
					return e = e || [b.platforms.DEFAULT_POST_ID], f = b.all(b.unique(b.map(e, function(a) {
						return g[a]
					})), function(a) {
						return null !== a
					}), b.find(f, function(c) {
						if (h[c] && h[c].data && h[c].order) {
							if (a) return i[a] = h[c].data[a], !0;
							b.each(h[c].order, function(a) {
								var b = h[c].data[a];
								i[a] || (i[a] = b)
							})
						}
					}), a ? i[a] : i
				},
				g = function(a, e, f, g) {
					var h = c,
						i = d;
					return f = f || "-", g = g || [b.platforms.DEFAULT_POST_ID], h[f] = h[f] || {
						data: {},
						order: []
					}, h[f].data[a] || (h[f].data[a] = e, h[f].order.push(a)), b.each(g, function(a) {
						i[a] = f
					}), !0
				},
				h = function(a, c, d, e) {
					var h = b.all(b.toArray(arguments), function(a) {
						return Boolean(a)
					});
					return "array" === b.type(h[h.length - 1]) && (e = h.pop()), a = h[0], c = h[1], 1 >= h.length ? f(a, e) : 2 <= h.length ? g(a, c, d, e) : void 0
				};
			return a.manual_mode && b.extend(h, {
				reset: e
			}), e(), h
		}(),
		enabled: function() {
			return a.link_phrases || a.link_urls
		},
		focusLink: function(a) {
			a.id || (a.id = b.uniqid("vl-link-")), location.href.hash = "#" + a.id, window.scrollBy(0, -150)
		},
		getPartnerParams: function() {
			var a, b, d = c.opt("partner"),
				e = {};
			for (a in d) break;
			if (a)
				for (b in d[a]) e[a + "_" + b] = d[a][b];
			return e
		},
		getPhrases: function(g, h) {
			c.opt("time_api") && d.event.start("ins"), c.api("insert", b.extend(f.getPartnerParams(), {
				cat: a.cat,
				i: h ? h.join("|") : null,
				mode: a.mode,
				pt: e.id,
				ps: a.product_source,
				u: location.href,
				v: "2.0"
			}), {
				fn: b.apiCallback(f.onInsertApi, f)
			}, g, h)
		},
		hasCalled: function() {
			var c = {},
				d = Math.random() < a.dynamic_sample_rate,
				e = function(a) {
					return d && b.isArray(a) ? b.map(a, function(a) {
						return e(a)
					}) : d && a === b.platforms.DEFAULT_POST_ID ? location.href : a
				},
				f = function(a) {
					return a = e(a), b.isArray(a) && a.length ? Boolean(b.all(a, function(a) {
						return c[a]
					}).length === a.length) : Boolean(c[b.platforms.DEFAULT_POST_ID])
				},
				g = function(a) {
					a = e(a), b.isArray(a) && a.length ? b.each(a, function(a) {
						c[a] = !0
					}) : c[b.platforms.DEFAULT_POST_ID] = !0
				};
			return function(a, b) {
				return b ? g(a) : f(a)
			}
		}(),
		init: function() {
			a.scope = a.scope || e.scope, a.link_urls && (h = RegExp("(?:(?:\\b(https?://)|(?:^|\\s)\\W*(www\\d{0,3}\\.|(?:[a-z0-9-]+\\.)+[a-z]{2,4}/))((?:[^\\s()<>]+|\\((?:[^\\s()<>]|(?:\\([^\\s()<>]+\\)))*\\))+(?:\\((?:[^\\s()<>]|(?:\\([^\\s()<>]+\\)))*\\)|[^\\s`!()\\[\\]{};:'\".,<>?«»“”‘’]))|(?:^|\\s)\\W*((?:[a-z0-9-]+\\.)+com\\b/?)(?!\\.[a-z0-9-]+))", "i"))
		},
		initLink: function() {
			return function(d, e, f) {
				var g = a.link_target;
				(g = "U" === e.type ? c.opt("link_target") : g || f) && (d.target = g), d.href || (d.href = e.url), d.rel = "nofollow", b.cache(d, "params", {
					exp: i,
					iid: e.iid,
					key: a.key,
					mid: e.mid,
					type: e.type || null
				}), !0 === e.auc && (e = b.fromQuery(d.search), (f = e.u || e.out) && (delete e.format, delete e.out, delete e.u, b.extend(e, c.clickParams(d), {
					out: f
				}), d.search = "?" + b.toQuery(e)), b.cache(d, "auctioned", !0)), b.cache(d, "href", d.href), c.link(d)
			}
		}(),
		insertLinks: function() {
			var d = b.generateNodeFilter({
					classes: ["nolinks", "atma-nolink", "atma-nolinks"],
					tags: ["map"],
					custom: function(a) {
						return b.matches(a, "a") && Boolean(a.href)
					}
				}),
				e = function(c, d, e, f) {
					var h = {
						phrase_to_nodes: {},
						regexp_cache: {},
						stats: {}
					};
					return b.each(d, function(a) {
						i(c, a, e, f, h)
					}, {
						timeout: !0
					}), "api" === a.insertion_order && g(e, h), h.stats
				},
				g = function(a, c) {
					var d = k(a);
					d.push("&!UNLINKED!&"), b.each(d, function(d) {
						(d = c.phrase_to_nodes[d]) && b.each(d, function(b) {
							m(b, b.data, a, c)
						})
					})
				},
				i = function(a, b, e, f, g) {
					if (c.allowed(b) && d(b, {
							ancestors: !Boolean(f),
							self: !0
						}))
						if (3 === b.nodeType) j(a, b, e, g);
						else if (1 === b.nodeType)
						for (b = b.firstChild; b;) f = b.nextSibling, i(a, b, e, !0, g), b = f
				},
				j = function() {
					var c = function(c, d) {
							var e = [];
							return b.each(c, function(a) {
								var c;
								d[a] ? c = d[a] : (c = b.escapeRegExp(a).split(" ").join("\\s+"), c = RegExp("(?:^|[\\s\"'\\(])(" + c + ")(?=\\s|\\W*$|\\W{2})", "i"), d[a] = c), e.push(c)
							}), a.link_urls && h && e.push(h), e
						},
						d = function(a, c) {
							var d = k(c);
							return a = f.normalizePhrase(a), b.all(d, function(b) {
								return -1 !== a.indexOf(b)
							})
						};
					return function(e, g, h, i) {
						var j, k, m = !1,
							o = i.phrase_to_nodes,
							p = i.regexp_cache;
						g.parentNode && (g.data && (m = e.test(g.data.replace(/\s+/, " "))), m && "dom" === a.insertion_order ? l(e, g, h, i) : m && "api" === a.insertion_order && (j = d(g.data, h), e = c(j, p), k = [g], b.each(e, function(a) {
							var c = [];
							b.each(k, function(d) {
								for (var e, g, h, i, k; d && d.data && "" !== d.data && (Boolean(!b.traits.fastRegexp && (h = d.data.match(/^\s+/))) || Boolean(h = d.data.match(a))) && h.input !== e && (e = h.input, g = h.slice(1).join(""), g);) i = f.normalizePhrase(g), g = n(d, h), g.previous && g.previous.data && c.push(g.previous), d = g.next, k = b.contains(j, i) ? i : "&!UNLINKED!&", i = o, g = g.match, i[k] || (i[k] = []), i[k].push(g);
								d && !h && c.push(d)
							}, {
								timeout: !0
							}), k = c
						})))
					}
				}(),
				k = function(a) {
					return a = f.cache(a), b.map(a, function(a, b) {
						return b
					})
				},
				l = function(a, c, d, e) {
					for (var f, g, h; c && c.data && "" !== c.data && (Boolean(!b.traits.fastRegexp && (h = c.data.match(/^\s+/))) || Boolean(h = c.data.match(a))) && h.input !== f && (f = h.input, g = h.slice(1).join(""), g);) c = n(c, h), m(c.match, g, d, e), c = c.next
				},
				m = function() {
					var d = function(c, d) {
							var e, f;
							return e = !c || !a.per_phrase || !d[c.phrase] || d[c.phrase].count < a.per_phrase, f = !a.per_page || b.reduce(0, d, function(a, b) {
								return a + b.count
							}) < a.per_page, e && f
						},
						e = function(d, e, g) {
							var h, i = Boolean(c.opt("dynamic_scope")),
								j = function() {
									var c, e;
									return !g.phrase || ((a.proximity || a.same_proximity) && (e = b.geometry(h), b.find(f.cache(d), function(d) {
										var h, i;
										if (d.links) return !((h = f.normalizePhrase(d.phrase) === f.normalizePhrase(g.phrase)) && !a.same_proximity || !h && !a.proximity) && (i = h ? Math.max(a.same_proximity, a.proximity) : a.proximity, d.links = b.all(d.links, function(a) {
											var d = b.isInDom(a.el);
											return !c && d && (c = b.find(a.segments, function(a) {
												if (a = a.geometry, a = b.extend({}, a), a.x1 -= i, a.y1 -= i, a.x2 += i, a.y2 += i, a.x1 < e.x2 && a.x2 > e.x1 && a.y1 < e.y2 && a.y2 > e.y1) return !0
											})), d
										}), c)
									})), !c)
								};
							return !!e.parentNode && (h = b.createEl("span"), e.parentNode.insertBefore(h, e), h.appendChild(e), function(a) {
								return h.parentNode.insertBefore(e, h), h.parentNode.removeChild(h), a
							}((!i || b.isVisible(h)) && j()))
						};
					return function(g, h, i, j) {
						var k;
						j = j.stats;
						var l = f.normalizePhrase(h),
							l = h ? f.cache(l, i) : null;
						if (h && !l && (l = {
								url: h.match(/^https?:\/\//i) ? h : "http://" + h,
								type: "U"
							}), l && l.url.match(/https?:\/\//i) && h && d(l, j) && e(i, g, l)) {
							var m = l;
							if (i = b.createEl("a"), i.innerHTML = h.replace(/([a-z0-9]+ *|[^a-z0-9]+)/gi, "<span>$1</span>"), i.className = "vglnk", b.cache(i, "type", "inserted"), b.cache(i, "phrase", h), a.ui && "U" !== m.type && (i.title = "Link added by VigLink"), f.initLink(i, m), !b.cache(i, "unlinked") && !c.isBlacklisted(i)) {
								h = g.parentNode, h.insertBefore(i, g), h.removeChild(g), g = l;
								var n;
								h = {
									el: i,
									segments: []
								};
								var o = i.getElementsByTagName("span"),
									p = {
										els: []
									};
								for (i = 0, m = o.length; i < m; i++) n = o[i], void 0 === k || n.offsetTop === k.offsetTop ? p.els.push(n) : (h.segments.push(p), p = {
									els: [n]
								}), k = n;
								p.geometry = b.geometry.apply(b, p.els), h.segments.push(p), g.links = g.links || [], g.links.push(h), k = l.phrase || l.url, j[k] = j[k] || {
									count: 0,
									iid: l.iid,
									imp: l.imp,
									phrase: l.phrase,
									url: l.url,
									type: l.type
								}, j[k].count++
							}
						}
					}
				}(),
				n = function(a, b) {
					var c, d;
					return d = b.slice(1).join(""), c = b.index + b[0].length - d.length, 0 < c ? c = a.splitText(c) : (c = a, a = null), d = c.length <= d.length ? null : c.splitText(d.length), {
						previous: a,
						match: c,
						next: d
					}
				};
			return function(c, g) {
				var h = {},
					i = f.regexp(g);
				i && ((c = b.all(c, d)) && c.length && (h = e(i, c, g, !1)), a.link_phrases && (f.sendInsertedTerms(h), f.log(h)))
			}
		}(),
		insertManually: function() {
			var c = !1,
				d = b.clone(a),
				e = function(a) {
					return b.map(a, function(a, b) {
						return {
							iid: "00000000",
							phrase: b,
							type: "0",
							url: a
						}
					})
				};
			return function(h, i, j) {
				var k, l = !1;
				g.init(), a.manual_mode && !c && (c = !0, k = i = i || {}, a.same_proximity = k.same_proximity || a.same_proximity, a.proximity = k.proximity || a.proximity, a.per_page = k.per_page || a.per_page, a.per_phrase = k.per_phrase || a.per_phrase, k = i.target_node || document.body, h = e(h), f.loadPhrases(h, null, [k]), a = d, f.cache.reset(), l = !0, c = !1), "function" === b.type(j) && j(l, k)
			}
		}(),
		loadPhrases: function(a, c, d, e) {
			b.each(a, function(a) {
				a.phrase && a.url && a.iid && (a.phrase = f.normalizePhrase(a.phrase), f.cache(a.phrase, {
					auc: a.auc,
					count: 0,
					iid: a.iid,
					imp: c,
					phrase: a.phrase,
					mid: a.mid,
					url: a.url,
					type: a.type || ""
				}, c, e))
			}), f.hasCalled(e, !0), this.insertLinks(d, e)
		},
		log: function(a) {
			var c = 0,
				e = 0,
				f = [];
			b.each(a, function(a, b) {
				var d = parseInt(a.count, 10);
				0 < d && ("U" === a.type ? e += d : "0" !== a.type && f.push({
					count: d,
					iid: a.iid,
					phrase: b,
					type: a.type
				}), c += d)
			}), 0 < c && d("insert", [{
				ct: c,
				cl: e,
				exp: i,
				imp_id: j,
				v: "2.0",
				phrases: b.toJSON(f)
			}])
		},
		normalizePhrase: function(a) {
			return a.toLowerCase().replace(/(^\s+|\s+$)/g, "").split(/\s+/).join(" ")
		},
		onInsertApi: function(a, e, f) {
			c.opt("time_api") && d.event.stop("ins"), "object" === b.type(a) && (i = a.exp, j = a.imp_id, a.results && this.loadPhrases(a.results, j, e, f))
		},
		regexp: function(a) {
			var c;
			return a = f.cache(a), a = b.map(a, function(a, c) {
				return b.escapeRegExp(c).split(" ").join("\\s+")
			}), 0 < a.length && (c = "(?:^|[\\s\"'\\(])(" + a.join("|") + ")(?=\\s|\\W*$|\\W{2})", c = RegExp(h ? "(?:" + c + "|" + h.source + ")" : c, "i")), c || h
		},
		sendInsertedTerms: function(d) {
			d = b.map(d, function(a, b) {
				return {
					count: a.count,
					phrase: b,
					iid: a.iid,
					impId: a.imp,
					url: a.url,
					type: a.type
				}
			}), d.length && c.apiNow("inserted", {
				cat: a.cat,
				exp: i,
				terms: b.toJSON(d),
				u: location.href,
				v: "2.0"
			})
		}
	}, g = {
		init: b.destructing(b.bind(f.init, f)),
		initNodes: function(d) {
			var g = [],
				h = [],
				i = [];
			f.enabled() && (a.scope ? (b.each(d, function(c) {
				var d = b.withScope([c], a.scope, {
					ancestors: !0,
					consolidate: !0,
					descendants: !1,
					self: !0
				});
				d.length ? (i.push(c), h = h.concat(d)) : (c = b.withScope([c], a.scope, {
					ancestors: !1,
					consolidate: !0,
					descendants: !0,
					self: !1
				}), c.length && (i = i.concat(c), h = h.concat(c)))
			}, {
				timeout: !0
			}), i = b.unique(i), h = b.unique(h)) : h = i = d, Boolean(c.opt("dynamic_scope")) && (i = b.all(i, function(a) {
				return !b.matches(a, ":has(a.vglnk)")
			}, {
				timeout: !0
			})), i.length && (h.length && (g = e.getPostIds(h)), a.link_phrases && !f.hasCalled(g) ? f.getPhrases(i, g) : f.insertLinks(i, g)))
		}
	}, a.manual_mode && b.extend(g, {
		"public": {
			run: f.insertManually
		}
	}), g
}, window.vglnk = window.vglnk || {}, window.vglnk.partners_plugin = function(a, b, c) {
	var d;
	return a = b.extend({
		log_links: !0,
		log_status: !1,
		pai_type: [],
		scope: "body"
	}, a), d = {
		extractDescription: function() {
			var a;
			return a = window.document.getElementsByTagName("meta"), (a = b.find(a, function(a) {
				return a.getAttribute("name") && "description" === a.getAttribute("name").toLowerCase()
			})) ? a.getAttribute("content") || null : null
		},
		logViews: function(a, d) {
			var e = {
				links: b.unique(b.map(a, function(a) {
					return a.href
				})),
				mode: ["P"],
				u: location.href,
				ver: c.opt("links_version"),
				title: window.document.title
			};
			d && (e.desc = d), c.sendLinks("optimize", e, {
				jsonp: !1
			})
		},
		logStatus: function(a) {
			b.createEl("img").src = b.updateUrl(c.opt("sync_url"), {
				pathname: "/api/sync/status.gif",
				search: "?" + b.toQuery({
					st: a
				})
			})
		},
		run: function() {
			var c = a.pai_type;
			b.isArray(c) && c.length && d.sync(c)
		},
		sync: function() {
			return function(e) {
				var f, g;
				f = e.shift(), g = b.updateUrl(c.opt("sync_url"), {
					pathname: "/api/sync.gif",
					search: "?" + b.toQuery({
						partner_id: f
					})
				}), f = b.createEl("img"), b.on(f, "load", function() {
					a.log_status && d.logStatus("su"), e.length && d.sync(e)
				}), b.on(f, "error", function() {
					a.log_status && d.logStatus("fa"), e.length && d.sync(e)
				}), a.log_status && d.logStatus("bg"), f.src = g
			}
		}()
	}, {
		init: function() {
			d.run()
		},
		initNodes: function(e) {
			a.log_links && (e = b.links(e, a.scope), e = b.all(e, c.allowed), e.length && d.logViews(e, d.extractDescription()))
		}
	}
};