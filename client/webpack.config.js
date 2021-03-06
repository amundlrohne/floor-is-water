const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "www"),
        filename: "index.bundle.js",
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpg|jpe?g|gif|fbx|glb|gltf|ttf|woff|woff2|mp3)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "android_asset/www",
                        },
                    },
                ],
            },
        ],
    },
};
