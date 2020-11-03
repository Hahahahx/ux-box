const env = "development";
const params = JSON.parse(process.argv.splice(2));

const webpackDevMiddleware = require("./webpack-dev-middleware-koa");
const webpackHotMiddleware = require("koa-webpack-hot-middleware");
const webpack = require("webpack");
const Koa = require("koa");
const app = new Koa();

const configFactory = require("../config/webpack.base");
const paths = require("../config/utils/paths");
const path = require("path");

// 查询是否外部有用户覆盖的webpack配置。
let customConfigFactory;
if (params.webpackFile) {
    customConfigFactory = require(path.resolve(
        paths.appPath,
        params.webpackFile
    ));
}
const config = configFactory(env);
const compiler = customConfigFactory
    ? webpack(customConfigFactory(config, env))
    : webpack(config);

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        hot: true,
        stats: "minimal",
    })
);

app.use(webpackHotMiddleware(compiler));

app.listen(9000, () => {
    console.log("启动成功：http://localhost:9000");
});
