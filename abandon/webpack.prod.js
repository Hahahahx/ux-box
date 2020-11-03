const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function (commonConfig) {
    return merge(commonConfig, {
        devtool: "cheap-module-source-map",
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // Must be set to true if using source-maps in production
                    terserOptions: {
                        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    },
                }),
            ],
        },
    });
};
