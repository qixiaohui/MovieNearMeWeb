var config = {
    context: __dirname+"/app",
    entry: './index.js',
    output: {
        path: __dirname + '/app',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.html$/, loader: 'raw', exclude: /node_modules/},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.js$/, loader: 'babel', exclude: /node_modules/, query: {presets: ['es2015']}},
            {test: /\.(png|jpg)$/, loader: 'file?name=img/[name].[ext]'},
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
            {test: [/fontawesome-webfont\.svg/, /fontawesome-webfont\.eot/, /fontawesome-webfont\.ttf/, /fontawesome-webfont\.woff/, /fontawesome-webfont\.woff2/], loader: 'file?name=fonts/[name].[ext]'}
        ]
    }
};

if(process.env.NODE_ENV == 'production') {
    config.output.path = __dirname + '/dist';
    config.devtool = 'source-map';
}

module.exports = config;