const prodConfig = require("./webpack.prod");
const devConfig = require("./webpack.dev");
const rules = require("./rules");
const plugins = require("./plugins");
const path = require("path");
const paths = require("../utils/paths") ;
const PnpWebpackPlugin = require("pnp-webpack-plugin");

module.exports = (mode) => {
    const commonConfig = {
        context: path.resolve(__dirname),
        mode,
        entry: [
            "core-js/es/map",
            "core-js/es/set",
            path.resolve(paths.appSrc, "index.js"),
        ],
        output: {
            publicPath: paths.publicUrlOrPath,
            path: paths.appBuild,
            filename: "[name].js",
            jsonpFunction: `webpackJsonp${paths.appPackageJson.name}`,
            globalObject: "this",
        },
        module: {
            strictExportPresence: true,
            rules: rules,
        },
        plugins: plugins,
        resolve: {
            modules: ["node_modules"],
            alias: {
                "@": paths.appSrc,
            },
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            fallback: { crypto: false },
            plugins: [PnpWebpackPlugin],
        },
        resolveLoader: {
            plugins: [PnpWebpackPlugin.moduleLoader(module)],
        },
    };

    const configFactory = mode === "production" ? prodConfig : devConfig;

    return configFactory(commonConfig);
};
