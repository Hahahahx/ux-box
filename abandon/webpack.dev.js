const path = require("path");
const paths = require("ux-box/config/paths");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

module.exports = function (commonConfig) {
    return merge(commonConfig, {
        entry: ["webpack-hot-middleware/client"],
        output: {
            path: paths.appBuild,
            pathinfo: true,
            // 会有一个main bundle，以及每一个异步chunk都有一个文件，
            // 但在development模式下不会生产出真正的文件
            filename: "static/js/bundle.js",
            // 使用代码分割（codeSplitting）时会有额外的JS chunk文件
            chunkFilename: "static/js/[name].chunk.js",
            // 指向sourceMap入口到原始磁盘位置上（windows中会转换成URL）
            devtoolModuleFilenameTemplate: (info) =>
                path.resolve(info.absoluteResourcePath).replace(/\\/g, "/"),
        },
        devtool: "eval-cheap-module-source-map",
        plugins: [new webpack.HotModuleReplacementPlugin()],
        watch: true,
        // watchOptions: {

        //     ignored: ["node_modules/**"],
        // },
        devServer: {
            open: {
                app: ["Edge", "--incognito", "--other-flag"],
            },
            compress: true,
            hot: true,
        },
    });
};
