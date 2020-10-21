const path = require("path");
const paths = require("./paths");

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

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const tsconfigPathsPlugin = new TsconfigPathsPlugin({
    configFile: path.resolve(__dirname, "../tsconfig.json"),
});

module.exports = plugins = [
    htmlWebpackPlugin,
    autoRoutePlugin,
    tsconfigPathsPlugin,
];
