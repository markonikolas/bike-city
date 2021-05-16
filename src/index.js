import './stylesheets/main.sass'
import $ from 'jquery'

$(() => {
	function scrollToArticle(e) {
		e.preventDefault()
		$('body').removeClass('no-scroll')
		$('.nav').removeClass('nav--open')
		$('#menu').removeClass('menu--open')
		$('#hero').removeClass('hero--active')

		const target = e.target.hash
		const $target = $(target)

		const link = e.target.href || null

		let $amount = $target.offset() || 0

		if ($amount) {
			$amount = $amount.top
		}

		// Animate scrolling
		$('html, body')
			.stop()
			.animate({ scrollTop: $amount }, 500, 'swing', () => {
				window.location.hash = target
				if (link) {
					window.location = link
				}
			})
	}

	$('#menu').on('click', function () {
		const $nav = $(this).siblings('.nav')

		$nav.toggleClass('nav--open')

		// Toggle main navigation
		$(this).toggleClass('menu--open')

		// Lock body from scrolling
		$('body').toggleClass('no-scroll')
	})

	$('#explore').on('click', (e) => scrollToArticle(e))
	$('.nav__link').on('click', (e) => scrollToArticle(e))
	$('#size').on('click', (e) => scrollToArticle(e))

	$('#footer-date').html(new Date().getFullYear().toString())

	$('.article__button.specs').on('click', function() {
		const $this = $(this);
		const $container = $this.siblings('.article__bullets');

		$this.html('Hide Specs');
		if($container.hasClass('article__bullets--open')) {
			$this.html('Show Specs');
		}

		$container.toggleClass('article__bullets--open');
	})
})
