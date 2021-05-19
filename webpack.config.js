// noinspection ConditionalExpressionJS

module.exports = ( { analyze, production, watch } ) => {
	const path = require( 'path' );

	// Env
	const isDev = !production;
	const isWatching = !!watch;
	const isAnalyze = !!analyze;

	// Helpers
	const Ternary = require( './helper/Ternary' );

	// Modes
	// Returns first parameter if in n mode, second otherwise
	const inDevMode = new Ternary( isDev );
	const inWatchMode = new Ternary( isWatching );

	// Constants
	const APP_DIR = './src';
	const BUILD_DIR = 'public';
	const BUILD_ASSETS_DIR = 'static';
	const ENTRY_FILENAME = 'index';

	// Filenames
	const assetFilename = inDevMode.check( '[name]', '[contenthash]' );

	// Plugins
	const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
	const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
	const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );

	const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
	const { BundleAnalyzerPlugin } = isAnalyze && require( 'webpack-bundle-analyzer' );
	const { SourceMapDevToolPlugin } = isDev && require( 'webpack' );

	const { WebpackManifestPlugin } = !isDev && require( 'webpack-manifest-plugin' );

	const MediaQueryPlugin = require( 'media-query-plugin' );
	// Config
	const mode = inDevMode.check( 'development', 'production' );

	// Fix for hmr not working properly because of browserslist
	const target = 'web';
	const devtool = false;
	const entry = path.resolve( __dirname, APP_DIR, ENTRY_FILENAME );
	const output = {
		path: path.resolve( __dirname, BUILD_DIR ),
		filename: inDevMode.check( 'static/scripts/[name].js', 'static/scripts/[contenthash].js' ),
		chunkFilename: inDevMode.check( 'static/scripts/[name]', 'static/scripts/[contenthash].js' ),
		publicPath: '',
	};
	const devServer = {
		contentBase: path.join( __dirname, BUILD_DIR ),
		compress: true,
		hot: true,
		watchContentBase: true,
	};
	const watchOptions = {
		ignored: /node_modules/,
		aggregateTimeout: 0,
		poll: 0,
	};

	const sourceMap = {
		sourceMap: false,
	};

	const modules = {
		rules: [
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: [ 'babel-loader' ],
			},

			{
				test: /\.svg$/i,
				loader: 'url-loader',
				options: {
					name: `${BUILD_ASSETS_DIR}/icons/${assetFilename}.[ext]`,
					limit: inWatchMode.check( 10240, false ),
				},
			},
			{
				test: /\.(png|jpe?g|svg|webp)$/i,
				loader: 'image-webpack-loader',
				options: {
					enforce: 'pre',
					bypassOnDebug: true,
					limit: inWatchMode.check( 10240, false ),
				},
			},
			{
				test: /\.(ttf|woff|woff2|otf)$/i,
				loader: 'url-loader',
				options: {
					name: `${assetFilename}.[ext]`,
					outputPath: 'static/fonts',
					publicPath: '../fonts/',
					limit: false,
				},
			},
			{
				test: /\w+[Subset].woff2/i,
				loader: 'url-loader',
				options: {
					name: `${assetFilename}.[ext]`,
					outputPath: 'static/fonts',
					publicPath: '../fonts/',
					limit: false,
				},
			},
			{
				test: /\.(png|jpe?g|webp|gif)$/i,
				loader: 'url-loader',
				options: {
					name: `${BUILD_ASSETS_DIR}/images/${assetFilename}.[ext]`,
					limit: inWatchMode.check( 10240, false ),
					publicPath: '../',
				},
			},
		],
	};

	const chunks = {
		normalize: 'normalize',
		jquery: 'jquery',
	};

	const optimizationOptions = {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				normalize: {
					test: /[\\/]node_modules[\\/]normalize.css/,
					name: inDevMode.check( `${chunks.normalize}`, '[contenthash]' ),
					enforce: true,
				},
				jquery: {
					test: /[\\/]node_modules[\\/]jquery[\\/]dist[\\/]jquery.js/,
					name: inDevMode.check( `${chunks.jquery}`, '[contenthash]' ),
					enforce: true,
				},
			},
		},
		minimize: !isDev,
		minimizer: isDev ? [] : [ `...` ],
	};

	// Loader Rules
	const styleRules = {
		test: /\.s?[ac]ss$/,
		use: [
			inWatchMode.check( 'style-loader', MiniCssExtractPlugin.loader ),
			{
				loader: 'css-loader',
				options: sourceMap,
			},
			MediaQueryPlugin.loader,
		],
	};

	const optimization = inWatchMode.check( { minimize: false }, optimizationOptions );

	const templatesCommon = {
		showErrors: isDev,
		minify: !isDev,
		favicon: `${APP_DIR}/assets/images/favicon.png`,
		scriptLoading: 'defer',
		cache: true,
		publicPath: '../',
	};

	const plugins = [
		new CleanWebpackPlugin( {
			verbose: true,
		} ),
		new HTMLWebpackPlugin( {
			template: 'src/templates/en-template.html',
			filename: 'en/index.html',
			...templatesCommon,
		} ),
		new HTMLWebpackPlugin( {
			template: 'src/templates/sr-template.html',
			filename: 'sr/index.html',
			...templatesCommon,
		} ),
		new MiniCssExtractPlugin( {
			filename: `${BUILD_ASSETS_DIR}/styles/${assetFilename}.css`,
		} ),
		new MediaQueryPlugin( {
			include: [ 'main' ],
			queries: {
				'screen and (min-width: 375px)': 'xs',
				'screen and (min-width: 411px)': 'sm',
				'screen and (min-width: 768px)': 'md',
			},
		} ),
		new BrowserSyncPlugin(
			// BrowserSync options
			{
				host: 'localhost',
				port: 8000,
				proxy: 'http://localhost:8080/',

				files: [
					'**/*-template.html', // reload on html change
					{
						match: '**/*.js',
						options: {
							ignored: [ '**/*.js' ], // ignore all js files, hmr will take care of it
						},
					},
					{
						match: '**/*.sass',
						options: {
							ignored: [ '**/*.sass' ], // ignore all sass files, hmr will take care of it
						},
					},
				],
				reloadDelay: 0,
			},
			{ reload: false },
		),
	];

	// *******
	// Conditionally inserted
	// Loaders
	// *******
	if ( CssMinimizerPlugin = null ) {
		// Webpack 5 feature `...` to 'extend' Terser and other minimizers
		optimizationOptions.minimizer.push(
			`...`,
			new CssMinimizerPlugin( {
				sourceMap,
				parallel: true,
				minimizerOptions: {
					preset: [
						'default',
						{
							discardComments: { removeAll: true },
						},
					],
				},
			} ),
		);
	}

	const postcssLoader = [
		{
			loader: 'postcss-loader',
			options: {
				...sourceMap,
				postcssOptions: {
					plugins: [ 'autoprefixer', 'postcss-preset-env' ],
				},
			},
		},
		{
			loader: 'sass-loader',
			options: sourceMap,
		},
	];
	// Add aditional loaders to the rules array
	styleRules.use.push( ...postcssLoader );

	modules.rules.push( styleRules );

	// *******
	// Plugins
	if ( WebpackManifestPlugin ) {
		plugins.push( new WebpackManifestPlugin() );
	}

	if ( BundleAnalyzerPlugin ) {
		plugins.push( new BundleAnalyzerPlugin() );
	}

	if ( SourceMapDevToolPlugin ) {
		plugins.push(
			new SourceMapDevToolPlugin( {
				filename: 'maps/[contenthash][ext].map',
				exclude: [ 'vendor.js', 'runtime.js' ],
			} ),
		);
	}

	const config = {
		mode,
		target,
		devtool,
		entry,
		output,
		devServer,
		watchOptions,
		module: modules,
		optimization,
		plugins,
	};

	return config;
};
