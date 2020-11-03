const path = require("path");
const paths = require("../config/utils/paths");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.resolve(paths.appPublic, "./index.html"),
    filename: "./index.html",
});

const AutoRoutePlugin = require("ux-autoroute-plugin");
const autoRoutePlugin = new AutoRoutePlugin({
    pagePath: path.resolve(paths.appSrc, "./pages"),
    output: path.resolve(__dirname),
    filename: "router.js",
    srcAlias: "@",
});

module.exports = plugins = [
    htmlWebpackPlugin,
    autoRoutePlugin,
];
