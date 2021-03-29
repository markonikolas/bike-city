const _elementNode = Symbol('elementNode');

class AbstractElementNode {
	constructor(node) {
		this[_elementNode] = document.getElementById(node);

		this.registerEvents();
	}

	get elementNode() {
		return this[_elementNode];
	}

	set elementNode(node) {
		if (typeof node === 'string') {
			return (this.elementNode = document.querySelector(node));
		}
		return (this.elementNode = node);
	}

	registerEvents() {
		console.info('Loading page, registering events.');
	}
	deregisterEvents() {
		console.info('Reloading page, de-registering events.');
	}

	checkIfClassExists(className) {
		return this.classList.contains(className);
	}

	addClass(className) {
		this.classList.add(className);
	}

	removeClass(className) {
		this.classList.remove(className);
	}
}

export default AbstractElementNode;
