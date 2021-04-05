import $ from "jquery";

// Styles
import "./stylesheets/locale/locale_en.sass";
import "./stylesheets/main.sass";

const on_sr_locale = document.documentElement.getAttribute("lang") === "sr";
const on_en_locale = document.documentElement.getAttribute("lang") === "en";

$(function () {
	function scrollToArticle(e) {
		e.preventDefault();
		console.log(e.target)
		const target = e.target.hash,
			$target = $(target);

		const link = e.target.href || null;

		let $amount = $target.offset() || 0;

		if($amount) {
			$amount = $amount.top;
		}

		$("html, body")
			.stop()
			.animate(
				{
					scrollTop: $amount,
				},
				500,
				"swing",
				function () {
					window.location.hash = target;
					console.log(link)
					if(link) {
						window.location = link;	
					}
				}
			);
	}

	$("#menu").on("click", function () {
		const $nav = $(this).next("nav.header__nav");
		const $localeIsOpen = $nav.find(".locales-toggle--active");

		// Close locales submenu if opened
		if ($localeIsOpen.length) {
			$localeIsOpen
				.removeClass("locales-toggle--active")
				.next(".locales")
				.find(".locales__wrapper")
				.slideUp();
		}

		$(".nav__link:not(.locales-toggle)").on("click", function (e) {
			$(this).closest(".header__nav").slideUp();
			scrollToArticle(e);
		});

		// Toggle main navigation
		$nav.slideToggle();
	});

	$("#locales-button").on("mousedown", function () {
		$(this).toggleClass("locales-toggle--down");
	});

	$("#locales-button").on("mouseup", function () {
		const $this = $(this);

		$this.removeClass("locales-toggle--down");
		$this.toggleClass("locales-toggle--active");

		setTimeout(function () {
			$this.next(".locales").find(".locales__wrapper").slideToggle();
		}, 200);
	});

	$("#explore").on("click", scrollToArticle);
});
