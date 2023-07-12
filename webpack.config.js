// This file is actually ignored by Webpack - it's here to help IDEs resolve aliases.
module.exports = {
  //...
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, "./src/Assets"),
      Components: path.resolve(__dirname, "./src/Components"),
      Config: path.resolve(__dirname, "./src/Config"),
      Helpers: path.resolve(__dirname, "./src/Helpers"),
      sass: path.resolve(__dirname, "./src/sass"),
      Service: path.resolve(__dirname, "./src/Service"),
      Store: path.resolve(__dirname, "./src/Store"),
    }
  }
}
