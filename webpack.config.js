var webpack = require('webpack');
var path = require('path');

var DEV = path.resolve(__dirname, "dev");
var OUTPUT = path.resolve(__dirname, "output");

var config = {
    entry: DEV + '/entry.jsx',
    output: {
        path: OUTPUT,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                include: DEV,
                loader: 'babel-loader',
                /*loaders: 'react-hot',*/
            },
            {
                test: /\.css$/, // Only .css files
                loader: 'style-loader!css-loader' // Run both loaders
            }/*, 
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=25000'
            }*/
        ]
    }
};

module.exports = config;
