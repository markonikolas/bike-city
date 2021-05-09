import $ from 'jquery';

// Styles
import './stylesheets/main.sass';

$( () => {
	function scrollToArticle( e ) {
		e.preventDefault();
		const target = e.target.hash;
		const $target = $( target );

		const link = e.target.href || null;

		let $amount = $target.offset() || 0;

		if ( $amount ) {
			$amount = $amount.top;
		}

		// Animate scrolling
		$( 'html, body' )
			.stop()
			.animate(
				{
					scrollTop: $amount
				},
				500,
				'swing',
				() => {
					window.location.hash = target;
					if ( link ) {
						window.location = link;
					}
				}
			);
	}

	$( '#menu' ).on( 'click', function () {
		// Toggle main navigation
		$( this ).toggleClass( 'menu--open' );

		// Lock body from scrolling
		$( 'body' ).toggleClass( 'no-scroll' );
	} );

	$( '#explore' ).on( 'click', e => scrollToArticle( e ) );
} );
