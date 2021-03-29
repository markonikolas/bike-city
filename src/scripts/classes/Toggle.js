import AbstractElementNode from './AbstractElementNode';

class Toggle extends AbstractElementNode {
	constructor(node) {
		super(node);
	}

	registerEvents() {
		super.registerEvents();
		this.elementNode.addEventListener('click', this.toggle);
	}

	deregisterEvents() {
		super.deregisterEvents();
		this.elementNode.removeEventListener('click', this.toggle);
	}

	toggle() {
		const openClass = 'menu--open';

		return super.checkIfClassExists(openClass) ? super.removeClass(openClass) : super.addClass(openClass);
	}
}

export default Toggle;
