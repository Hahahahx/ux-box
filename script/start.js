const env = "development";
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require("webpack");

const Koa = require("koa");
const Router = require("@koa/router");

const config = require("../config/webpack.base")(env.trim());
const compiler = webpack(config);

const app = new Koa();
const router = new Router();

router
    .get("/lessc", async (context, next) => {})
    .get("/assets/main.css", (req, res) => {
        res.status(404).send("not found");
    });

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        hot: true,
        stats: "minimal",
    })
);

app.use(webpackHotMiddleware(compiler));

app;
app.listen(9000, () => {
    console.log("启动成功：http://localhost:9000");
});
