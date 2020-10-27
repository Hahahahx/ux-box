const webpack = require("webpack");
const resolve = require("resolve");
const fs = require("fs");
const path = require("path");
const paths = require("./utils/paths");
const ManifestPlugin = require("webpack-manifest-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");
const RouterPlugin = require("ux-autoroute-plugin");
const AntdDayJsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getClientEnvironment = require("./utils/env");
// 自定义主题配置
// const AntdThemePlugin = require('./antdThemePlugin');

// 一些App不需要优化web请求缓存，所以不内联chunk可以使构建编译更加丝滑
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";

// 查找是否有ts配置文件
const useTypeScript = fs.existsSync(paths.appTsConfig);

// We will provide `paths.publicUrlOrPath` to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
// Get environment variables to inject into our app.
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const getPlugins = (isEnvDevelopment, isEnvProduction) => {
    return [
        // AntdThemePlugin,
        // 自定义路由配置插件
        new RouterPlugin({
            pagePath: path.resolve(paths.appSrc, "./pages"),
            output: path.resolve(__dirname),
            filename: "router.js",
            srcAlias: "@",
        }),
        // antd时间插件momentjs替换为dayjs，减小包大小
        new AntdDayJsWebpackPlugin(),
        // 生成一个index.html文件在<script>中
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    template: paths.appHtml,
                },
                isEnvProduction
                    ? {
                          minify: {
                              removeComments: true,
                              collapseWhitespace: true,
                              removeRedundantAttributes: true,
                              useShortDoctype: true,
                              removeEmptyAttributes: true,
                              removeStyleLinkTypeAttributes: true,
                              keepClosingSlash: true,
                              minifyJS: true,
                              minifyCSS: true,
                              minifyURLs: true,
                          },
                      }
                    : undefined
            )
        ),
        // 内联的webpack运行时脚本，这些脚本太小而不能保证联网请求
        // https://github.com/facebook/create-react-app/issues/5358
        isEnvProduction &&
            shouldInlineRuntimeChunk &&
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
        // 构建一些环境变量在index.html中，如：
        // public URL => %PUBLIC_URL%
        // <link rel='icon' href="%PUBLIC_URL%">
        // 它将是一个空白的字符串，除非你在package.json中配置了homepage属性
        // 如此，它就作为URL的pathname
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        // 这个插件为模块not found错误提供了context，例如资源请求
        new ModuleNotFoundPlugin(paths.appPath),
        // 设置一些环境变量在代码中，例如：
        // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
        // 在生产环境构建时将NODE_ENV设置为production是必不可少的
        // 不然React在开发（development）模式下编译就会变得非常缓慢
        // 因为在每次编译都要加载生产环境中插件或配置
        new webpack.DefinePlugin(env.stringified),
        // 这个插件被用来提醒热更新（当前只有css
        isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebook/create-react-app/issues/240
        isEnvDevelopment && new CaseSensitivePathsPlugin(),
        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebook/create-react-app/issues/186
        isEnvDevelopment &&
            new WatchMissingNodeModulesPlugin(paths.appNodeModules),
        isEnvProduction &&
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "static/css/[name].[contenthash:8].css",
                chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
            }),
        // Generate an asset manifest file with the following content:
        // - "files" key: Mapping of all asset filenames to their corresponding
        //   output file so that tools can pick it up without having to parse
        //   `index.html`
        // - "entrypoints" key: Array of files which are included in `index.html`,
        //   can be used to reconstruct the HTML if necessary
        new ManifestPlugin({
            fileName: "asset-manifest.json",
            publicPath: paths.publicUrlOrPath,
            generate: (seed, files, entrypoints) => {
                const manifestFiles = files.reduce((manifest, file) => {
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);
                const entrypointFiles = entrypoints.main.filter(
                    (fileName) => !fileName.endsWith(".map")
                );

                return {
                    files: manifestFiles,
                    entrypoints: entrypointFiles,
                };
            },
        }),
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // Generate a service worker script that will precache, and keep up to date,
        // the HTML & assets that are part of the webpack build.
        isEnvProduction &&
            new WorkboxWebpackPlugin.GenerateSW({
                clientsClaim: true,
                exclude: [/\.map$/, /asset-manifest\.json$/],
                importWorkboxFrom: "cdn",
                navigateFallback: paths.publicUrlOrPath + "index.html",
                navigateFallbackBlacklist: [
                    // Exclude URLs starting with /_, as they're likely an API call
                    new RegExp("^/_"),
                    // Exclude any URLs whose last part seems to be a file extension
                    // as they're likely a resource and not a SPA route.
                    // URLs containing a "?" character won't be blacklisted as they're likely
                    // a route with query params (e.g. auth callbacks).
                    new RegExp("/[^/?]+\\.[^/]+$"),
                ],
            }),
        // TypeScript type checking
        useTypeScript &&
            new ForkTsCheckerWebpackPlugin({
                typescript: resolve.sync("typescript", {
                    basedir: paths.appNodeModules,
                }),
                async: isEnvDevelopment,
                useTypescriptIncrementalApi: true,
                checkSyntacticErrors: true,
                resolveModuleNameModule: process.versions.pnp
                    ? `${__dirname}/utils/pnpTs.js`
                    : undefined,
                resolveTypeReferenceDirectiveModule: process.versions.pnp
                    ? `${__dirname}/utils/pnpTs.js`
                    : undefined,
                tsconfig: paths.appTsConfig,
                reportFiles: [
                    "**",
                    "!**/__tests__/**",
                    "!**/?(*.)(spec|test).*",
                    "!**/src/setupProxy.*",
                    "!**/src/setupTests.*",
                ],
                silent: true,
                // The formatter is invoked directly in WebpackDevServerUtils during development
                formatter: isEnvProduction ? typescriptFormatter : undefined,
            }),
    ];
};

module.exports = { getPlugins };
