const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack=require('webpack');
const path=require('path');

const nodeENV=process.env.NODE_ENV || 'development';
const isProd = nodeENV === 'production';

const sourcePath = path.join(__dirname, './src');
const distPath = path.join(__dirname, './bin/vision-tools/dist');

const plugins=[
    new webpack.DefinePlugin({
        __DEV__:nodeENV=='development',
        'process.env': {
            NODE_ENV: JSON.stringify(nodeENV)
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['common'],
        minChunks: Infinity,
        chunks:['popup','content']
    }),
    new webpack.ProvidePlugin({
        React: "react"
    }),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin("[name].style.css")
];

if(isProd){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
    }),new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }));
}else{
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

module.exports={
    context: sourcePath,
    entry:{
        common:['classnames','react','react-dom'],
        popup:'./popup.js',
        content:'./content.js',
        background:'./background.js'
    },
    output:{
        path:distPath,
        filename:'[name].js'
    },
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude: /node_modules/,
                use:'babel-loader'
            },{
                test:   /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                    publicPath: distPath
                })
            },
            {
                test:   /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"],
                    publicPath: distPath
                })
            },{
                test:/\.(png|jpg|svg|gif)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit:50000,
                        name:'images/[name].[ext]'
                    }
                }
            }, {
                test: /\.json$/,
                use: 'json'
            }, {
                test: /\.md$/,
                use: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            sourcePath
        ]
    },
    devtool: isProd ? 'source-map' : 'eval',
    plugins:plugins
};
