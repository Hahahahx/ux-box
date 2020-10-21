module.exports = rules = [
    {
        test: /\.css/,
        use: [
            "style-loader",
            {
                loader: "css-loader",
                options: {
                    modules: true,
                },
            },
        ],
    },
    {
        test: /\.(js|jsx|ts|tsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
    },
    {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
    },
];
