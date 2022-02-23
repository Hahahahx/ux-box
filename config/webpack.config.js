import { existsSync } from "fs";
import { resolve as _resolve, relative, join } from "path";
import PnpWebpackPlugin, { moduleLoader } from "pnp-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import safePostCssParser from "postcss-safe-parser";
import ModuleScopePlugin from "react-dev-utils/ModuleScopePlugin";
import {
    appPackageJson as _appPackageJson,
    appTsConfig,
    appIndexJs,
    appBuild,
    publicUrlOrPath,
    appSrc,
    appNodeModules,
    moduleFileExtensions,
} from "./utils/paths";
import { additionalModulePaths, webpackAliases } from "./utils/modules";
import { getRules } from "./rules";
import { getPlugins } from "./plugins";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const appPackageJson = require(_appPackageJson);

const isExtendingEslintConfig = process.env.EXTEND_ESLINT === "true";
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

// Check if TypeScript is setup
const useTypeScript = existsSync(appTsConfig);

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
export default function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === "development";
    const isEnvProduction = webpackEnv === "production";
 
    // 用于在生产环境中启用分析的变量
    // 传入变量别名，如果传入构建命令，则使用标志
    const isEnvProductionProfile =
        isEnvProduction && process.argv.includes("--profile");

    return {
        context: _resolve(__dirname),
        mode: isEnvProduction ? "production" : "development",
        // Stop compilation early in production
        bail: isEnvProduction,
        devtool: isEnvProduction ? false : "ource-map",
        // These are the "entry points" to our application.
        // This means they will be the "root" imports that are included in JS bundle.
        entry: [
            // 兼容包
            "core-js/es",
            "core-js/es/map",
            "core-js/es/set",
            isEnvDevelopment &&
                require.resolve("react-dev-utils/webpackHotDevClient"),
            // Finally, this is your app's code:
            appIndexJs,
            // We include the app code last so that if there is a runtime error during
            // initialization, it doesn't blow up the WebpackDevServer client, and
            // changing JS code would still trigger a refresh.
        ].filter(Boolean),
        output: {
            // The build folder.
            path: isEnvProduction ? appBuild : undefined,
            // Add /* filename */ comments to generated require()s in the output.
            pathinfo: isEnvDevelopment,
            // There will be one main bundle, and one file per asynchronous chunk.
            // In development, it does not produce real files.
            filename: isEnvProduction
                ? "static/js/[name].[contenthash:8].js"
                : isEnvDevelopment && "static/js/bundle.js",
            // TODO: remove this when upgrading to webpack 5
            futureEmitAssets: true,
            // There are also additional JS chunk files if you use code splitting.
            chunkFilename: isEnvProduction
                ? "static/js/[name].[contenthash:8].chunk.js"
                : isEnvDevelopment && "static/js/[name].chunk.js",
            // webpack uses `publicPath` to determine where the app is being served from.
            // It requires a trailing slash, or the file assets will get an incorrect path.
            // We inferred the "public path" (such as / or /my-project) from homepage.
            publicPath: publicUrlOrPath,
            // Point sourcemap entries to original disk location (format as URL on Windows)
            devtoolModuleFilenameTemplate: isEnvProduction
                ? (info) =>
                      relative(appSrc, info.absoluteResourcePath).replace(
                          /\\/g,
                          "/"
                      )
                : isEnvDevelopment &&
                  ((info) =>
                      _resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
            // Prevents conflicts when multiple webpack runtimes (from different apps)
            // are used on the same page.
            jsonpFunction: `webpackJsonp${appPackageJson.name}`,
            // this defaults to 'window', but by setting it to 'this' then
            // module chunks which are built will work in web workers as well.
            globalObject: "this",
        },
        optimization: {
            minimize: isEnvProduction,
            minimizer: [
                // This is only used in production mode
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            // Disabled because of an issue with Uglify breaking seemingly valid code:
                            // https://github.com/facebook/create-react-app/issues/2376
                            // Pending further investigation:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                            // Disabled because of an issue with Terser breaking valid code:
                            // https://github.com/facebook/create-react-app/issues/5250
                            // Pending further investigation:
                            // https://github.com/terser-js/terser/issues/120
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        // Added for profiling in devtools
                        keep_classnames: isEnvProductionProfile,
                        keep_fnames: isEnvProductionProfile,
                        output: {
                            ecma: 5,
                            comments: false,
                            // Turned on because emoji and regex is not minified properly using default
                            // https://github.com/facebook/create-react-app/issues/2488
                            ascii_only: true,
                        },
                    },
                    sourceMap: isEnvDevelopment,
                }),
                // This is only used in production mode
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: isEnvDevelopment
                            ? {
                                  // `inline: false` forces the sourcemap to be output into a
                                  // separate file
                                  inline: false,
                                  // `annotation: true` appends the sourceMappingURL to the end of
                                  // the css file, helping the browser find the sourcemap
                                  annotation: true,
                              }
                            : false,
                    },
                    cssProcessorPluginOptions: {
                        preset: [
                            "default",
                            { minifyFontValues: { removeQuotes: false } },
                        ],
                    },
                }),
            ],
            // Automatically split vendor and commons
            // https://twitter.com/wSokra/status/969633336732905474
            // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
            splitChunks: {
                chunks: "all",
                name: false,
            },
            // Keep the runtime chunk separated to enable long term caching
            // https://twitter.com/wSokra/status/969679223278505985
            // https://github.com/facebook/create-react-app/issues/5358
            runtimeChunk: {
                name: (entrypoint) => `runtime-${entrypoint.name}`,
            },
        },
        resolve: {
            // This allows you to set a fallback for where webpack should look for modules.
            // We placed these paths second because we want `node_modules` to "win"
            // if there are any conflicts. This matches Node resolution mechanism.
            // https://github.com/facebook/create-react-app/issues/253
            modules: ["node_modules", appNodeModules].concat(
                additionalModulePaths || []
            ),
            // These are the reasonable defaults supported by the Node ecosystem.
            // We also include JSX as a common component filename extension to support
            // some tools, although we do not recommend using it, see:
            // https://github.com/facebook/create-react-app/issues/290
            // `web` extension prefixes have been added for better support
            // for React Native Web.
            extensions: moduleFileExtensions
                .map((ext) => `.${ext}`)
                .filter((ext) => useTypeScript || !ext.includes("ts")),
            alias: {
                "@": appSrc,
                "@images": join(appSrc, "/assets/images"),
                "@styles": join(appSrc, "/assets/styles"),
                "@assets": join(appSrc, "/assets"),
                "@pages": join(appSrc, "/pages"),
                "@modules": join(appSrc, "/modules"),
                "@services": join(appSrc, "/services"),
                "@components": join(appSrc, "/components"),
                // 支持 React Native Web
                // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
                "react-native": "react-native-web", 
                // 允许ReactDevTools更好的识别
                ...(isEnvProductionProfile && {
                    "react-dom$": "react-dom/profiling",
                    "scheduler/tracing": "scheduler/tracing-profiling",
                }),
                ...(webpackAliases || {}),
            },
            plugins: [ 
                // 即插即用插件，更好的安装和添加模块，也防止某些依赖被遗忘
                PnpWebpackPlugin,
                // Prevents users from importing files from outside of src/ (or node_modules/).
                // This often causes confusion because we only process files within src/ with babel.
                // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
                // please link the files into your node_modules/ and let module-resolution kick in.
                // Make sure your source files are compiled, as they will not be processed in any way.
                new ModuleScopePlugin(appSrc, [_appPackageJson]),
            ],
        },
        resolveLoader: {
            plugins: [
                // Also related to Plug'n'Play, but this time it tells webpack to load its loaders
                // from the current package.
                moduleLoader(module),
            ],
        },
        module: {
            strictExportPresence: true,
            rules: getRules(
                isEnvDevelopment,
                isEnvProduction,
                shouldUseSourceMap
            ),
        },
        plugins: getPlugins(isEnvDevelopment, isEnvProduction).filter(Boolean),
        // Some libraries import Node modules but don't use them in the browser.
        // Tell webpack to provide empty mocks for them so importing them works.
        node: {
            module: "empty",
            dgram: "empty",
            dns: "mock",
            fs: "empty",
            http2: "empty",
            net: "empty",
            tls: "empty",
            child_process: "empty",
        },
        performance: false,
    };
}
