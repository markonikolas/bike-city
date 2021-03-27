// Font imports in "./stylesheets/base/_fonts.sass"

// Styles
import './stylesheets/main.sass';
import './scripts';

// Only files accepted here will be hot reloaded.
// When making changes in this file be sure to reload the page.
if ( module && module.hot ) {
	module.hot.accept( './scripts/', () => 'Module accepted.' );
}

// aditional settings for hmr go here
// e. g. how DOM handles 'unmounting' nodes
