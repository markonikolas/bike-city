module.exports = env => {
	const path = require( 'path' );

	// Env
	const isDev = !env.production;
	const isWatching = !!env.watch;
	const isAnalize = !!env.analyze;

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
	const { BundleAnalyzerPlugin } = isAnalize && require( 'webpack-bundle-analyzer' );
	const { SourceMapDevToolPlugin } = isDev && require( 'webpack' );

	const { WebpackManifestPlugin } = !isDev && require( 'webpack-manifest-plugin' );
	const CssMinimizerPlugin = !isDev && require( 'css-minimizer-webpack-plugin' );

	// Config
	const mode = inDevMode.check( 'development', 'production' );
	// Fix for hmr not working properly beacuse of browserslist
	const target = 'web';
	const devtool = false;
	const entry = path.resolve( __dirname, APP_DIR, ENTRY_FILENAME );
	const output = {
		path: path.resolve( __dirname, BUILD_DIR ),
		filename: inDevMode.check( '[name].js', '[contenthash].js' ),
		chunkFilename: inDevMode.check( '[name]', '[contenthash].js' ),
		publicPath: ''
	};
	const devServer = {
		contentBase: path.join( __dirname, BUILD_DIR ),
		compress: true,
		hot: true,
		watchContentBase: true

	};
	const watchOptions = {
		ignored: /node_modules/,
		aggregateTimeout: 0,
		poll: 0
	};

	const sourceMap = {
		sourceMap: isDev
	};

	const modules = {
		rules: [
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.svg$/i,
				loader: 'url-loader',
				options: {
					name: `${BUILD_ASSETS_DIR}/icons/${assetFilename}.[ext]`,
					limit: inWatchMode.check( 10240, false )
				}
			},
			{
				test: /\.(png|jpe?g|svg)$/i,
				loader: 'image-webpack-loader',
				options: {
					enforce: 'pre',
					bypassOnDebug: true,
					limit: inWatchMode.check( 10240, false )
				}
			},
			{
				test: /\.(ttf|woff|woff2|otf)$/i,
				loader: 'url-loader',
				options: {
					name: `${assetFilename}.[ext]`,
					outputPath: 'static/fonts',
					publicPath: '../fonts/',
					limit: isWatching
				}
			},
			{
				test: /\.(png|jpe?g)$/i,
				loader: 'url-loader',
				options: {
					name: `${BUILD_ASSETS_DIR}/images/${assetFilename}.[ext]`,
					limit: inWatchMode.check( 10240, false )
				}
			}

		]
	};

	const optimizationOptions = {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				defaultVendors: {
					// Note the usage of `[\\/]` as a path separator for cross-platform compatibility.
					test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
					filename: inDevMode.check( 'vendor.js', '[contenthash].js' ),
					// Tells webpack to ignore splitChunks.minSize, splitChunks.minChunks, splitChunk.
					// maxAsyncRequests and splitChunks.maxInitialRequests options and always create
					// chunks for this cache group.
					enforce: true
				},
				// Imported in main.sass
				normalize: {
					test: /[\\/]node_modules[\\/]normalize.css[\\/]/,
					filename: inDevMode.check( 'vendor.css', '[contenthash].css' ),
					enforce: true
				}
			}
		},
		minimize: !isDev,
		minimizer: [ `...` ]
	};

	// Loader Rules
	const styleRules = {
		test: /\.s?[ac]ss$/i,
		use: [
			inWatchMode.check(
				'style-loader',
				MiniCssExtractPlugin.loader
			),
			{
				loader: 'css-loader',
				options: sourceMap
			}
		]
	};

	const optimization = inWatchMode.check( { minimize: false }, optimizationOptions );

	const plugins = [
		new CleanWebpackPlugin( {
			verbose: true
		} ),
		new HTMLWebpackPlugin( {
			template: 'src/template.html',
			filename: 'index.html',
			showErrors: isDev,
			minify: !isDev,
			favicon: `${APP_DIR}/assets/images/favicon.png`,
			scriptLoading: 'defer',
			cache: true
		} ),
		new MiniCssExtractPlugin( {
			filename: `${BUILD_ASSETS_DIR}/styles/${assetFilename}.css`
		} ),
		new BrowserSyncPlugin(
			// BrowserSync options
			{
				host: 'localhost',
				port: 8000,
				proxy: 'http://localhost:8080/',

				files: [
					'**/template.html', // reload on html change
					{
						match: '**/*.js',
						options: {
							ignored: [ '**/*.js' ] // ignore all js files, hmr will take care of it
						}
					},
					{
						match: '**/*.sass',
						options: {
							ignored: [ '**/*.sass' ] // ignore all sass files, hmr will take care of it
						}
					}
				],
				reloadDelay: 0
			}, { reload: false }
		)
	];

	// *******
	// Conditionally inserted
	// Loaders
	// *******
	if ( CssMinimizerPlugin ) {
		// Webpack 5 feature `...` to 'extend' Terser and other minimizers
		optimizationOptions.minimizer.push( `...`, new CssMinimizerPlugin( {
			parallel: true,
			sourceMap: true,
			minimizerOptions: {
				preset: [
					'default',
					{
						discardComments: { removeAll: true }
					}
				]
			}
		} ) );
	}

	const aditionalStyleLoaders = [
		{
			loader: 'postcss-loader',
			options: {
				sourceMap: isDev,
				postcssOptions: {
					plugins: [
						'autoprefixer',
						'postcss-preset-env'
					]
				}
			}
		},
		{
			loader: 'sass-loader',
			options: sourceMap
		}
	];
	// Add aditional loaders to the rules array
	styleRules.use.push( ...aditionalStyleLoaders );
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
		plugins.push( new SourceMapDevToolPlugin( {
			filename: 'maps/[contenthash][ext].map',
			exclude: [ 'vendor.js', 'runtime.js' ]
		} ) );
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
		plugins
	};

	return config;
};
