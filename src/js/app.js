import navigation from './components/navigation'

const API = '/api/nav.json'
const CSS = {
	active: 'active'
}
const selectors = {
	wrapper: '.navigation.sitemap',
	toggler: '.navigation.controls .item.toggle .anchor',
	anchors: '.navigation.sitemap .item .anchor'
}
const error = () => console.log(`Something went wrong. API request: ${API}`)
const draw = {
	collection: (nodes, depth) => {
		const first = !depth
		const role = (first ? 'menubar' : 'menu')
		const hidden = String(!first)
		return `<ul class="collection" role="${role}" aria-hidden="${hidden}">\
		</ul>`
	},
	item: (item) => {
		const children = !!(item.items || []).length
		const popup = String(children)
		return `<li class="item" role="menuitem" aria-haspopup="${popup}">\
			<a href="${item.url}" title="${item.label}" class="anchor">\
				${item.label}\
			</a>\
		</li>`
	}
}
const array = object => Array.prototype.slice.call(object)
const go = function go() {
	window.location = this
	return window.location.reload()
}
const use = (object) => {
	const multiple = object.hasOwnProperty('length')
	const collection = (multiple ? array(object) : [object])
	return collection
}
const hidden = function (element) {	
	const status = String((this !== undefined) ? this : true)
	return element.setAttribute('aria-hidden', status)
}
const highlight = function (element) {
	const status = ((this !== undefined) ? this : true)
	const method = (status ? 'add' : 'remove')
	return element.classList[method](CSS.active)
}
const focus = function () {
	use(this.container).forEach(highlight)
	use(this.collections.itself).forEach(hidden.bind(false))
	use(this.collections.siblings).slice(1).forEach(hidden)
	use(this.items.itself).forEach(highlight)
	use(this.items.siblings).forEach(highlight.bind(false))
	return this
}
const toggle = (DOM) => {
	use(DOM.collections).slice(1).forEach(hidden)
	use(DOM.items).forEach(highlight.bind(false))
	DOM.container.classList.toggle(CSS.active)
	return this
}
const select = {
	0: (DOM, data) => {
		const addressable = !!data.url
		const nestled = !!(data.items || []).length
		const highlighted = DOM.items.itself.classList.contains(CSS.active)
		const deepened = (nestled && highlighted)
		const move = (addressable && (!nestled || deepened))
		const handler = (move ? go.bind(data.url) : focus.bind(DOM))
		return handler()
	},
	1: (DOM, data) => {
		return go.call(data.url)
	}
}
const serialize = response => response.json()
const dig = item => item.items
const identify = data => data.url.split('/').slice().reverse().shift()
const container = document.getElementsByClassName('header').item(0)
const settings = {container, selectors, dig, draw, select, toggle, identify}
const promise = window.fetch(API).then(serialize).catch(error)
const menu = navigation.init(settings).populate(promise)

export default window.app = (window.app || {menu})