const { existsSync } = require("fs");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
const noopServiceWorkerMiddleware = require("react-dev-utils/noopServiceWorkerMiddleware");
const ignoredFiles = require("react-dev-utils/ignoredFiles");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");
const {
    appPublic,
    publicUrlOrPath,
    appSrc,
    appNodeModules,
    proxySetup,
} = require("./utils/paths");
const { resolve } = require("path");
const getHttpsConfig = require("./utils/getHttpsConfig");
const { themeMiddleware } = require("ux-less-theme");

const host = process.env.HOST || "0.0.0.0";
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
    return {
        disableHostCheck:
            !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === "true",
        compress: true,
        clientLogLevel: "none",
        contentBase: appPublic,
        contentBasePublicPath: publicUrlOrPath,
        watchContentBase: true,
        hot: true,
        transportMode: "ws",
        injectClient: false,
        sockHost,
        sockPath,
        sockPort,
        publicPath: publicUrlOrPath.slice(0, -1),
        quiet: true,
        watchOptions: {
            ignored: ignoredFiles(appSrc),
        },
        https: getHttpsConfig(),
        host,
        overlay: false,
        historyApiFallback: {
            disableDotRule: true,
            index: publicUrlOrPath,
        },
        public: allowedHost,
        proxy,
        before(app, server) {
            app.use(
                themeMiddleware({
                    baseUrl: "/less",
                    antdDir: resolve(appNodeModules, "./antd"),
                    indexDir: resolve(appSrc, "./assets/styles"),
                    outputDir: appPublic,
                })
            );
            app.use(evalSourceMapMiddleware(server));
            app.use(errorOverlayMiddleware());

            if (existsSync(proxySetup)) {
                require(proxySetup)(app);
            }
        },
        after(app) {
            app.use(redirectServedPath(publicUrlOrPath));
            app.use(noopServiceWorkerMiddleware(publicUrlOrPath));
        },
    };
}
