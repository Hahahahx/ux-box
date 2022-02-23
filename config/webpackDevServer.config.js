import { existsSync } from "fs";
import errorOverlayMiddleware from "react-dev-utils/errorOverlayMiddleware";
import evalSourceMapMiddleware from "react-dev-utils/evalSourceMapMiddleware";
import noopServiceWorkerMiddleware from "react-dev-utils/noopServiceWorkerMiddleware";
import ignoredFiles from "react-dev-utils/ignoredFiles";
import redirectServedPath from "react-dev-utils/redirectServedPathMiddleware";
import {
    appPublic,
    publicUrlOrPath,
    appSrc,
    appNodeModules,
    proxySetup,
} from "./utils/paths";
import { resolve } from "path";
import getHttpsConfig from "./utils/getHttpsConfig";
import { themeMiddleware } from "ux-less-theme";

const host = process.env.HOST || "0.0.0.0";
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;

export default function (proxy, allowedHost) {
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
