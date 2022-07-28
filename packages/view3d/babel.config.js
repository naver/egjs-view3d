module.exports = (api) => {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env", {
        targets: {
          chrome: "51",
          firefox: "54",
          ios: "10"
        }
      }
    ]
  ];
  const plugins = [];

  return {
    presets,
    plugins
  };
};
