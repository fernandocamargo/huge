const core = (function () {})
const defaults = {
	container: document.body,
	selectors: {
		wrapper: '.navigation',
		toggler: '.navigation > .title .anchor',
		anchors: '.item .anchor'
	},
	select: {}
}
const internal = {
	DOM: {
		collections: [],
		items: [],
		anchors: []
	}
}
let settings

const API = {
	is: {
		function: function (object) {
			return (typeof object === 'function')
		},

		equal: function (comparison) {
			return (comparison === this)
		},

		not: function (comparison) {
			return (comparison !== this)
		},

		parent: function (stack, comparison) {
			const parent = (comparison.parentNode === this)
			return (parent ? comparison : stack)
		}
	},

	container: {
		get: function () {
			const reachable = settings.container.querySelectorAll
			const container = (reachable ? settings.container : document.body)
			return container
		}
	},

	toggler: {
		listen: function () {
			const toggler = (internal.DOM.toggler || internal.DOM.container)
			const toggle = this.toggle.bind(this)
			toggler.addEventListener('click', toggle)
			return this
		}
	},

	init: function (options) {
		settings = Object.assign({}, defaults, options)
		return this.build.call(this)
	},

	build: function () {
		const reach = this.reach.bind(this)
		const keys = Object.keys(settings.selectors)
		Object.assign(internal.DOM, keys.reduce(reach, {}))
		return this.bind.call(this)
	},

	bind: function () {
		return Object.keys(this).reduce(this.delegate.bind(this), this)
	},

	delegate: function (stack, entity) {
		const avoid = this.avoid.bind(this)
		const listener = this[entity].listen
		const listenable = this.is.function(listener)
		const handler = (listenable ? listener.bind(this) : avoid)
		handler()
		return stack
	},

	reach: function (stack, key) {
		const container = this.container.get.call(this)
		const reached = container.querySelector(settings.selectors[key])
		const result = {[key]: reached}
		return (!reached ? stack : Object.assign(stack, result))
	},

	populate: function (promise) {
		const fulfill = this.fulfill.bind(this)
		const error = this.error.bind(error)
		Promise.resolve(promise).then(fulfill).catch(error)
		return this
	},

	fulfill: function (level, parent, depth = 0) {
		const layer = this.dig.call(this)(level)
		const multiple = (layer || [])
		const empty = !multiple.length
		const handler = (!empty ? 'nestle' : 'avoid')
		return this[handler].call(this, multiple, parent, depth)
	},

	dig: function (surface) {
		return (settings.dig || surface.valueOf.bind(surface))
	},

	nestle: function (nodes, parent, depth) {
		const wrapper = (parent || internal.DOM.wrapper)
		const markup = this.draw.call(this, 'collection')(nodes, depth)
		const collection = this.append.call(this, wrapper, markup)
		const render = this.render.bind(this, collection, depth)
		internal.DOM.collections.push(collection)
		nodes.forEach(render)
		return this
	},

	sign: function (element, data) {
		const avoid = this.avoid
		const identify = settings.identify
		const executable = this.is.function.call(this, identify)
		const signature = (executable ? identify.call(this, data) : false)
		const handler = (signature ? element.classList.add : avoid)
		handler.call(element.classList, signature)
		return element
	},

	render: function (parent, depth, data, index) {
		const listen = this.listen.bind(this)
		const sign = this.sign.bind(this)
		const wrapper = (parent || internal.DOM.wrapper)
		const markup = this.draw.call(this, 'item')(data, depth, index)
		const item = this.append.call(this, wrapper, markup)
		const anchor = item.querySelector(settings.selectors.anchors)
		internal.DOM.items.push(sign(item, data))
		internal.DOM.anchors.push(listen(anchor, depth, data))
		return this.fulfill.call(this, data, item, (depth + 1))
	},

	separate: function (type, reference) {
		const avoid = this.avoid.bind(this)
		const not = this.is.not
		const all = internal.DOM[type]
		const executable = this.is.function.call(this, reference)
		const value = reference.valueOf.bind(reference)
		const handler = (executable ? reference : value)
		const itself = handler(all)
		const siblings = all.filter(not.bind(itself))
		return {itself, siblings, all}
	},

	parent: function (parent, children) {
		return children.reduce(this.is.parent.bind(parent), false)
	},

	belong: function (parent) {
		return this.parent.bind(this, parent)
	},

	handle: function (anchor, depth, data, event) {
		const avoid = this.avoid.bind(this)
		const separate = this.separate.bind(this)
		const container = this.container.get.call(this)
		const belong = this.belong.bind(this)
		const equal = this.is.equal
		const wrapper = internal.DOM.wrapper
		const item = anchor.parentNode
		const items = separate('items', item)
		const anchors = separate('anchors', anchor)
		const collections = separate('collections', belong(item))
		const select = (settings.select[depth] || avoid)
		const DOM = {container, wrapper, items, anchors, collections}
		event.preventDefault()
		select.call(this, DOM, data)
		return this
	},

	draw: function (type) {
		const stringify = JSON.stringify
		return (settings.draw[type] || stringify)
	},

  append: function (element, markup) {
    element.insertAdjacentHTML('beforeend', markup)
    return element.lastChild
  },

	listen: function (anchor, ...params) {
		const context = [this, anchor].concat(params)
		const handle = this.handle.bind.apply(this.handle, context)
		anchor.addEventListener('click', handle)
		return anchor
	},

	toggle: function (event) {
		const avoid = this.avoid.bind(this)
		const container = this.container.get.call(this)
		const DOM = Object.assign({}, internal.DOM, {container})
		const handler = (settings.toggle || avoid)
		event.preventDefault()
		return handler(DOM)
	},

	error: function () {
		const avoid = this.avoid.bind(this)
		return (settings.error || avoid)
	},

	avoid: function () {
		return this
	}
}

export default Object.assign(core.prototype, API)