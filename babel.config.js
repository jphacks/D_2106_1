const path = require("path");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [
            ".js",
            ".ts",
            ".tsx",
            ".ios.js",
            ".android.js",
            ".ios.ts",
            ".android.ts",
            ".json",
          ],
          alias: {
            root: ["./"],
            src: path.resolve(__dirname, "src"),
            root: path.resolve(__dirname),
          },
        },
      ],
    ],
  };
};
