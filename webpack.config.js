const path = require("path");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");

module.exports = {
  stats: { children: true },
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist/"),
    clean: true,
  },

  resolve: {
    alias: {
      "@scripts": path.join(__dirname, "src/js"),
      "@styles": path.join(__dirname, "src/css"),
      "@images": path.join(__dirname, "src/images"),
    },
  },

  devtool: "source-map",

  plugins: [
    new HtmlBundlerPlugin({
      entry: [
        {
          import: "./src/views/template.ejs", // template file
          filename: "index.html", // => dist/index.html
          data: {
            title: "Webpack Template",
          }, // pass variables into template
        },
      ],

      js: {
        // output filename for JS
        filename: "js/[name].[contenthash:8].js",
      },

      css: {
        // output filename for CSS
        filename: "css/[name].[contenthash:8].css",
      },

      preprocessor: "ejs",

      preprocessorOptions: {
        async: false, // defaults 'false'
        // defaults process.cwd(), root path for includes with an absolute path (e.g., /file.html)
        root: path.join(__dirname, "src/views"), // defaults process.cwd()
        // defaults [], an array of paths to use when resolving includes with relative paths
        views: [
          "src/partials", // relative path
          path.join(__dirname, "src/partials"), // absolute path
        ],
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: "css-loader",
            options: {
              import: false, // disable @import at-rules handling
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|ico|svg)$/,
        type: "asset/resource",
        generator: {
          filename: ({ filename }) => {
            // Keep directory structure for images in dist folder
            const srcPath = "src/assets/imgs";
            const regExp = new RegExp(
              `[\\\\/]?(?:${path.normalize(srcPath)}|node_modules)[\\\\/](.+?)$`
            );
            const assetPath = path.dirname(
              regExp.exec(filename)[1].replace("@", "").replace(/\\/g, "/")
            );

            return `images/${assetPath}/[name].[hash:8][ext]`;
          },
        },
      },
    ],
  },

  // enable HMR with live reload
  devServer: {
    static: path.resolve(__dirname, "dist"),
    watchFiles: {
      paths: ["src/**/*.*"],
      options: {
        usePolling: true,
      },
    },
  },
};
