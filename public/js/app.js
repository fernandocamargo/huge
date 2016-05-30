/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _navigation = __webpack_require__(1);

	var _navigation2 = _interopRequireDefault(_navigation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var API = '/api/nav.json';
	var CSS = {
		active: 'active'
	};
	var selectors = {
		wrapper: '.navigation.sitemap',
		toggler: '.navigation.controls .item.toggle .anchor',
		anchors: '.navigation.sitemap .item .anchor'
	};
	var error = function error() {
		return console.log('Something went wrong. API request: ' + API);
	};
	var draw = {
		collection: function collection() {
			return '<ul class="collection"></ul>';
		},
		item: function item(_item) {
			return '<li class="item">\t\t\t<a href="' + _item.url + '" title="' + _item.label + '" class="anchor">\t\t\t\t' + _item.label + '\t\t\t</a>\t\t</li>';
		}
	};
	var array = function array(object) {
		return Array.prototype.slice.call(object);
	};
	var go = function go() {
		window.location = this;
		return window.location.reload();
	};
	var use = function use(object) {
		var multiple = object.hasOwnProperty('length');
		var collection = multiple ? array(object) : [object];
		return collection;
	};
	var highlight = function highlight(element) {
		var status = this !== undefined ? this : true;
		var method = status ? 'add' : 'remove';
		return element.classList[method](CSS.active);
	};
	var focus = function focus() {
		use(this.container).forEach(highlight);
		use(this.items.itself).forEach(highlight);
		use(this.items.siblings).forEach(highlight.bind(false));
		return this;
	};
	var toggle = function toggle(DOM) {
		use(DOM.items).forEach(highlight.bind(false));
		DOM.container.classList.toggle(CSS.active);
		return undefined;
	};
	var select = {
		0: function _(DOM, data) {
			var addressable = !!data.url;
			var nestled = !!(data.items || []).length;
			var highlighted = DOM.items.itself.classList.contains(CSS.active);
			var deepened = nestled && highlighted;
			var move = addressable && (!nestled || deepened);
			var handler = move ? go.bind(data.url) : focus.bind(DOM);
			return handler();
		},
		1: function _(DOM, data) {
			return go.call(data.url);
		}
	};
	var serialize = function serialize(response) {
		return response.json();
	};
	var dig = function dig(item) {
		return item.items;
	};
	var container = document.getElementsByClassName('header').item(0);
	var settings = { container: container, selectors: selectors, dig: dig, draw: draw, select: select, toggle: toggle };
	var promise = window.fetch(API).then(serialize).catch(error);
	var menu = _navigation2.default.init(settings).populate(promise);

	exports.default = window.app = window.app || { menu: menu };

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var core = function core() {};
	var defaults = {
		container: document.body,
		selectors: {
			wrapper: '.navigation',
			toggler: '.navigation > .title .anchor',
			anchors: '.item .anchor'
		},
		select: {}
	};
	var internal = {
		DOM: {
			items: [],
			anchors: []
		}
	};
	var settings = void 0;

	var API = {
		is: {
			function: function _function(object) {
				return typeof object === 'function';
			}
		},

		container: {
			get: function get() {
				var reachable = settings.container.querySelectorAll;
				var container = reachable ? settings.container : document.body;
				return container;
			}
		},

		toggler: {
			listen: function listen() {
				var toggler = internal.DOM.toggler || internal.DOM.container;
				var toggle = this.toggle.bind(this);
				toggler.addEventListener('click', toggle);
				return this;
			}
		},

		init: function init(options) {
			settings = Object.assign({}, defaults, options);
			return this.build.call(this);
		},

		build: function build() {
			var reach = this.reach.bind(this);
			var keys = Object.keys(settings.selectors);
			Object.assign(internal.DOM, keys.reduce(reach, {}));
			return this.bind.call(this);
		},

		bind: function bind() {
			return Object.keys(this).reduce(this.delegate.bind(this), this);
		},

		delegate: function delegate(stack, entity) {
			var avoid = this.avoid.bind(this);
			var listener = this[entity].listen;
			var listenable = this.is.function(listener);
			var handler = listenable ? listener.bind(this) : avoid;
			handler();
			return stack;
		},

		reach: function reach(stack, key) {
			var container = this.container.get.call(this);
			var reached = container.querySelector(settings.selectors[key]);
			var result = _defineProperty({}, key, reached);
			return !reached ? stack : Object.assign(stack, result);
		},

		populate: function populate(promise) {
			var fulfill = this.fulfill.bind(this);
			var error = this.error.bind(error);
			Promise.resolve(promise).then(fulfill).catch(error);
			return this;
		},

		fulfill: function fulfill(level, parent) {
			var depth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

			var layer = this.dig.call(this)(level);
			var multiple = layer || [];
			var empty = !multiple.length;
			var handler = !empty ? 'nestle' : 'avoid';
			return this[handler].call(this, multiple, parent, depth);
		},

		dig: function dig(surface) {
			return settings.dig || surface.valueOf.bind(surface);
		},

		nestle: function nestle(multiple, parent, depth) {
			var wrapper = parent || internal.DOM.wrapper;
			var markup = this.draw.call(this, 'collection')();
			var collection = this.append.call(this, wrapper, markup);
			var render = this.render.bind(this, collection, depth);
			multiple.forEach(render);
			return this;
		},

		render: function render(parent, depth, data) {
			var listen = this.listen.bind(this);
			var wrapper = parent || internal.DOM.wrapper;
			var markup = this.draw.call(this, 'item')(data);
			var item = this.append.call(this, wrapper, markup);
			var anchor = item.querySelector(settings.selectors.anchors);
			internal.DOM.items.push(item);
			internal.DOM.anchors.push(listen(anchor, depth, data));
			return this.fulfill.call(this, data, item, depth + 1);
		},

		not: function not(iterator) {
			return iterator !== this;
		},

		separate: function separate(type, element) {
			var not = this.not;
			var all = internal.DOM[type];
			var itself = element;
			var siblings = all.filter(not.bind(element));
			return { itself: itself, siblings: siblings, all: all };
		},

		handle: function handle(anchor, depth, data, event) {
			var avoid = this.avoid.bind(this);
			var separate = this.separate.bind(this);
			var container = this.container.get.call(this);
			var wrapper = internal.DOM.wrapper;
			var item = anchor.parentNode;
			var items = separate('items', item);
			var anchors = separate('anchors', anchor);
			var select = settings.select[depth] || avoid;
			var DOM = { container: container, wrapper: wrapper, items: items, anchors: anchors };
			event.preventDefault();
			select.call(this, DOM, data);
			return this;
		},

		draw: function draw(type) {
			var stringify = JSON.stringify;
			return settings.draw[type] || stringify;
		},

		append: function append(element, markup) {
			element.insertAdjacentHTML('beforeend', markup);
			return element.lastChild;
		},

		listen: function listen(anchor) {
			for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				params[_key - 1] = arguments[_key];
			}

			var context = [this, anchor].concat(params);
			var handle = this.handle.bind.apply(this.handle, context);
			anchor.addEventListener('click', handle);
			return anchor;
		},

		toggle: function toggle(event) {
			var avoid = this.avoid.bind(this);
			var container = this.container.get.call(this);
			var DOM = Object.assign({}, internal.DOM, { container: container });
			var handler = settings.toggle || avoid;
			event.preventDefault();
			return handler(DOM);
		},

		error: function error() {
			var avoid = this.avoid.bind(this);
			return settings.error || avoid;
		},

		avoid: function avoid() {
			return this;
		}
	};

	exports.default = Object.assign(core.prototype, API);

/***/ }
/******/ ]);