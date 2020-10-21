const path = require("path");
const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.resolve(paths.appPublic, "./index.html"),
    filename: "./index.html",
});

module.exports = plugins = [htmlWebpackPlugin];
