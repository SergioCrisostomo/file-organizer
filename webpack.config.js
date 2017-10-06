const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'ui/');

module.exports = {
	entry: __dirname + '/app/app.js',
	output: {
		path: BUILD_DIR,
		filename: 'app.js'
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js'
		}
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader'
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}
		]
	},
	target: 'web',
	plugins: []
};
