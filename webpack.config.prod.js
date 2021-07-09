const projectSettings = require('./projectSettings');

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const prefixer = require('postcss-prefixer');


module.exports = {
    mode: 'production',
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: 'build/assets',
            to: 'assets'
        }]),
        new HTMLWebpackPlugin({
            template: 'build/index.html',
            filename: 'index.html',
            hash: true,
            minify: false,
            ...projectSettings,
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                exclude: [path.resolve(__dirname, 'node_modules/bulma')],
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.css$/,
                include: [path.resolve(__dirname, 'node_modules/bulma')],
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    prefixer({
                                        prefix: 'bu-'
                                    })
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
}
