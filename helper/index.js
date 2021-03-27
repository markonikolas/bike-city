function ternary( flag, c1, c2 ) {
	if ( typeof flag !== 'boolean' ) {
		throw new Error(
			'first parameter of ternary function is invalid. Be sure to pass a boolean.'
		);
	}
	return flag ? c1 : c2;
}

module.exports = ternary;
