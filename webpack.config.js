var config = {
    context: __dirname+"/app",
    entry: './index.js',
    output: {
        path: __dirname + '/app',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel', exclude: /node_modules/, query: {presets: ['es2015']}},
            {test: /\.html$/, loader: 'raw', exclude: /node_modules/},
            {test: /\.css$/, loader: 'style!css', exclude: /node_modules/}
        ]
    }
};

if(process.env.NODE_ENV == 'production') {
    config.output.path = __dirname + '/dist';
    config.devtool = 'source-map';
}

module.exports = config;