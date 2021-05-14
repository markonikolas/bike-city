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
		const $hero = $('#hero')

		$nav.toggleClass('nav--open')
		$hero.toggleClass('hero--active')

		// Toggle main navigation
		$(this).toggleClass('menu--open')

		// Lock body from scrolling
		$('body').toggleClass('no-scroll')
	})

	$('#explore').on('click', (e) => scrollToArticle(e))
	$('.nav__link').on('click', (e) => scrollToArticle(e))

	$('#footer-date').html(new Date().getFullYear().toString())
})
