import './stylesheets/main.sass';
import $ from 'jquery';

$( () => {
	const scrollToArticle = e => {
		e.preventDefault();
		$( 'body' ).removeClass( 'no-scroll' );
		$( '.nav' ).removeClass( 'nav--open' );
		$( '#menu' ).removeClass( 'menu--open' );
		$( '#hero' ).removeClass( 'hero--active' );

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
			.animate( { scrollTop: $amount }, 500, 'swing', () => {
				window.location.hash = target;
				if ( link ) {
					window.location = link;
				}
			} );
	};

	$( '#menu' ).on( 'click', function () {
		const $nav = $( this ).siblings( '.nav' );

		$nav.toggleClass( 'nav--open' );

		// Toggle main navigation
		$( this ).toggleClass( 'menu--open' );

		// Lock body from scrolling
		$( 'body' ).toggleClass( 'no-scroll' );
	} );

	$( '#explore' ).on( 'click', e => scrollToArticle( e ) );
	$( '.nav__link' ).on( 'click', e => scrollToArticle( e ) );

	$( '#footer-date' ).html( new Date().getFullYear().toString() );

	$( '.article__button.specs' ).on( 'click', function () {
		const $this = $( this );
		const $container = $this.closest( '.article__buttons' ).siblings( '.article__bullets' );
		const onEnPage = $( 'html' ).attr( 'lang' ) === 'en';
		if ( onEnPage ) {
			$this.html( 'Hide Specs' );
		} else {
			$this.html( 'Sakrij' );
		}

		if ( $container.hasClass( 'article__bullets--open' ) ) {
			if ( onEnPage ) {
				$this.html( 'Show Specs' );
			} else {
				$this.html( 'Prikaži više' );
			}

			$this.closest( '.article__section' ).find( '* > :first-child' ).css( 'margin-left', 'auto' );
		}

		$container.toggleClass( 'article__bullets--open' );
	} );
} );
