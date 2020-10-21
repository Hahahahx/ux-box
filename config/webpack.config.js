const { merge } = require("webpack-merge");
const prodConfig = require("./webpack.prod");
const devConfig = require("./webpack.dev");
const rules = require("./rules");
const plugins = require("./plugins");

module.exports = (env) => {
    const config = env === "production" ? prodConfig() : devConfig();

    const commonConfig = {
        entry: [
            "core-js/es/map",
            "core-js/es/set",
            path.join(__dirname, "./src/index.tsx"),
        ],
        output: {
            path: path.join(__dirname, "./build"),
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
