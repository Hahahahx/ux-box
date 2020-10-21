const env = " development";
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");

const Koa = require("koa");
const Router = require("@koa/router");

const config = require("../config/webpack.config");
const compiler = webpack(config(env));

const app = new Koa();
const router = new Router();

router.get("/lessc", async (context, next) => {});

app.use(webpackDevMiddleware(compiler));
app.listen(9000, () => {
    console.log("启动成功：http://localhost:9000");
});
