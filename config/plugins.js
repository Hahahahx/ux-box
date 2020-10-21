const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "./example/index.html"),
    filename: "./index.html",
});


module.exports = plugins = [
    htmlWebpackPlugin
]