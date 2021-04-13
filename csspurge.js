(async function purgeStylesWithHtml() {
	const csspurge = require("css-purge");
	const fs = require("fs/promises");

	const assetDir = `${__dirname}/public/static`;
	const stylesDir = `${assetDir}/styles`;

	const files = fs.readdir(stylesDir);
	const styles = await files;

	styles.forEach((style) => {
		csspurge.purgeCSSFiles(
			{
				css: `${stylesDir}/${style}`,
				css_output: `${stylesDir}/${style}`,
				verbose: true,
			},
			"config/csspurge.config.json"
		);
	});
})();
