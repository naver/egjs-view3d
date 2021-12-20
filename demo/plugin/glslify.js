module.exports = function(context, options) {
  return {
    name: "docusaurus-plugin-glslify",
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.(glsl|vs|fs|vert|frag)$/,
              exclude: /node_modules/,
              use: ["raw-loader", "glslify-loader"]
            }
          ]
        }
      };
    }
  };
};
