const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const postcssNormalize = require("postcss-normalize");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const paths = require("./utils/paths");

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

// common function to get style loaders

const getRules = (isEnvDevelopment, isEnvProduction, shouldUseSourceMap) => {
    const getStyleLoaders = (cssOptions, preProcessor) => {
        const loaders = [
            isEnvDevelopment && require.resolve("style-loader"),
            isEnvProduction && {
                loader: MiniCssExtractPlugin.loader,
                // css is located in `static/css`, use '../../' to locate index.html folder
                // in production `paths.publicUrlOrPath` can be a relative path
                options: paths.publicUrlOrPath.startsWith(".")
                    ? { publicPath: "../../" }
                    : {},
            },
            {
                loader: require.resolve("css-loader"),
                options: cssOptions,
            },
        ].filter(Boolean);
        if (preProcessor) {
            const isLessOptions =
                preProcessor === "less-loader"
                    ? {
                          lessOptions: {
                              modifyVars: {},
                              javascriptEnabled: true,
                          },
                          sourceMap: isEnvDevelopment,
                      }
                    : {
                          sourceMap: isEnvDevelopment,
                      };
            loaders.push(
                {
                    // Options for PostCSS as we reference these options twice
                    // Adds vendor prefixing based on your specified browser support in
                    // package.json
                    loader: require.resolve("postcss-loader"),
                    options: {
                        // Necessary for external CSS imports to work
                        // https://github.com/facebook/create-react-app/issues/2677
                        ident: "postcss",
                        plugins: () => [
                            require("postcss-flexbugs-fixes"),
                            require("postcss-preset-env")({
                                autoprefixer: {
                                    flexbox: "no-2009",
                                },
                                stage: 3,
                            }),
                            // Adds PostCSS Normalize as the reset css with default options,
                            // so that it honors browserslist config in package.json
                            // which in turn let's users customize the target behavior as per their needs.
                            postcssNormalize(),
                        ],
                        syntax: require("postcss-less"),
                        sourceMap: isEnvDevelopment,
                    },
                },
                {
                    loader: require.resolve(preProcessor),
                    options: isLessOptions,
                }
            );
        }
        return loaders;
    };

    return [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            enforce: "pre",
            use: [
                {
                    options: {
                        cache: true,
                        formatter: require.resolve(
                            "react-dev-utils/eslintFormatter"
                        ),
                        eslintPath: require.resolve("eslint"),
                        resolvePluginsRelativeTo: __dirname,
                    },
                    loader: require.resolve("eslint-loader"),
                },
            ],
            include: paths.appSrc,
        },
        {
            // "oneOf" will traverse all following loaders until one will
            // match the requirements. When no loader matches it will fall
            // back to the "file" loader at the end of the loader list.
            oneOf: [
                // "url" loader works like "file" loader except that it embeds assets
                // smaller than specified limit in bytes as data URLs to avoid requests.
                // A missing `test` is equivalent to a match.
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve("url-loader"),
                    options: {
                        limit: imageInlineSizeLimit,
                        name: "static/media/[name].[hash:8].[ext]",
                    },
                },
                // Process application JS with Babel.
                // The preset includes JSX, Flow, TypeScript, and some ESnext features.
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    include: paths.appSrc,
                    loader: require.resolve("babel-loader"),
                    options: {
                        customize: require.resolve(
                            "babel-preset-react-app/webpack-overrides"
                        ),
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    targets: {}, // 这里是targets的配置，根据实际browserslist设置
                                    corejs: 3, // 添加core-js版本
                                    modules: false, // 模块使用 es modules ，不使用 commonJS 规范
                                    useBuiltIns: "usage", // 默认 false, 可选 entry , usage
                                },
                            ],
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    corejs: false, // 默认值，可以不写
                                    helpers: true, // 默认，可以不写
                                    regenerator: false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
                                    useESModules: true, // 使用 es modules helpers, 减少 commonJS 语法代码
                                },
                            ],
                            "@babel/plugin-proposal-optional-chaining",
                            "@babel/plugin-syntax-jsx",
                            [
                                "@babel/plugin-proposal-decorators",
                                {
                                    legacy: true,
                                },
                            ],
                            //"@babel/plugin-transform-classes",
                            "@babel/plugin-proposal-class-properties",
                            [
                                require.resolve(
                                    "babel-plugin-named-asset-import"
                                ),
                                {
                                    loaderMap: {
                                        svg: {
                                            ReactComponent:
                                                "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                                        },
                                    },
                                },
                            ],
                            [
                                "import",
                                {
                                    libraryName: "antd",
                                    libraryDirectory: "es",
                                    style: true, // change importing css to less
                                },
                            ],
                        ],
                        // This is a feature of `babel-loader` for webpack (not Babel itself).
                        // It enables caching results in ./node_modules/.cache/babel-loader/
                        // directory for faster rebuilds.
                        cacheDirectory: true,
                        // See #6846 for context on why cacheCompression is disabled
                        cacheCompression: false,
                        compact: isEnvProduction,
                    },
                },
                // Process any JS outside of the app with Babel.
                // Unlike the application JS, we only compile the standard ES features.
                {
                    test: /\.(js|mjs)$/,
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    loader: require.resolve("babel-loader"),
                    options: {
                        babelrc: false,
                        configFile: false,
                        compact: false,
                        presets: [
                            [
                                require.resolve(
                                    "babel-preset-react-app/dependencies"
                                ),
                                { helpers: true },
                            ],
                        ],
                        cacheDirectory: true,
                        // See #6846 for context on why cacheCompression is disabled
                        cacheCompression: false,

                        // Babel sourcemaps are needed for debugging into node_modules
                        // code.  Without the options below, debuggers like VSCode
                        // show incorrect code and set breakpoints on the wrong lines.
                        sourceMaps: isEnvDevelopment, // shouldUseSourceMap,
                        inputSourceMap: isEnvDevelopment, // shouldUseSourceMap,
                    },
                },
                {
                    test: cssRegex,
                    exclude: cssModuleRegex,
                    use: getStyleLoaders({
                        importLoaders: 2,
                        sourceMap: isEnvDevelopment,
                    }),
                    sideEffects: true,
                },
                {
                    test: cssModuleRegex,
                    use: getStyleLoaders({
                        importLoaders: 2,
                        sourceMap: isEnvDevelopment,
                        modules: {
                            getLocalIdent: getCSSModuleLocalIdent,
                        },
                    }),
                },
                {
                    test: lessRegex,
                    exclude: lessModuleRegex,
                    use: getStyleLoaders(
                        {
                            importLoaders: 2,
                            sourceMap: isEnvDevelopment,
                        },
                        "less-loader"
                    ),
                    sideEffects: true,
                },
                {
                    test: lessModuleRegex,
                    use: getStyleLoaders(
                        {
                            importLoaders: 2,
                            sourceMap: isEnvDevelopment, // isEnvProduction && shouldUseSourceMap,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                        },
                        "less-loader"
                    ),
                },
                {
                    loader: require.resolve("file-loader"),
                    // Exclude `js` files to keep "css" loader working as it injects
                    // its runtime that would otherwise be processed through "file" loader.
                    // Also exclude `html` and `json` extensions so they get processed
                    // by webpacks internal loaders.
                    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                    options: {
                        name: "static/media/[name].[hash:8].[ext]",
                    },
                },
                // ** STOP ** Are you adding a new loader?
                // Make sure to add the new loader(s) before the "file" loader.
            ],
        },
    ];
};

module.exports = { getRules };
