/* eslint-disable prefer-arrow/prefer-arrow-functions */

module.exports = function(api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        "loose": true
      }
    ]
  ];
  const plugins = [
    "no-side-effect-class-properties",
    ["@babel/plugin-proposal-class-properties", {"loose": true}],
    "@babel/plugin-transform-object-assign"
  ];

  return {
    presets,
    plugins
  };
};
