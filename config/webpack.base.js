const { merge } = require("webpack-merge");
const prodConfig = require("./webpack.prod");
const devConfig = require("./webpack.dev");
const rules = require("./rules");
const plugins = require("./plugins");
const path = require("path");
const paths = require("./paths");

module.exports = (mode) => {
    const config = mode === "production" ? prodConfig() : devConfig();

    const commonConfig = {
        mode,
        entry: [path.resolve(paths.appSrc, "index.js")],
        output: {
            path: paths.appBuild,
            filename: "index.js",
        },
        module: {
            rules: rules,
        },
        plugins: plugins,
        resolve: {
            alias: {
                "@": path.resolve("src"),
            },
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
    };

    return merge(commonConfig, config);
};
