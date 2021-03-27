class Ternary {
	constructor( dep ) {
		this._dep = dep;
	}

	get dep() {
		return this._dep;
	}

	set dep( d ) {
		this._dep = d;
	}

	check( l, r ) {
		return this.dep ? l : r;
	}
}
module.exports = Ternary;
