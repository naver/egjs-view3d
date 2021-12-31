module.exports = function(config) {
  const karmaConfig = {
    frameworks: ["mocha", "chai", "chai-as-promised", "sinon", "karma-typescript"],
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    client: {
      mocha: {
        opts: "./mocha.opts",
      },
    },
    files: [
      "./src/**/*.ts",
      "./test/**/*.ts",
      "./test/setup.js",
      {pattern: "./test/assets/**/*.*", watched: false, included: false, served: true},
    ],
    proxies: {
      "/assets/": "/base/test/assets/"
    },
    preprocessors: {
      "src/**/*.ts": ["karma-typescript"],
      "test/**/*.ts": ["karma-typescript"],
    },
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.test.json",
      reports: {
        html: {
          "directory": "coverage",
          "subdirectory": "./"
        },
        lcovonly: {
          "directory": "coverage",
          "filename": "lcov.info",
          "subdirectory": "."
        },
      },
      coverageOptions: {
        instrumentation: true,
        exclude: /test/i,
      },
      bundlerOptions: {
        transforms: [
          require("karma-typescript-es6-transform")()
        ]
      }
    },
    browsers: [],
    customLaunchers: {
      CustomChromeHeadless: {
        base: "ChromeHeadless",
        flags: ["--window-size=400,300", "--no-sandbox", "--disable-setuid-sandbox"],
      },
    },
    reporters: ["mocha"],
  };

  karmaConfig.browsers.push(config.chrome ? "Chrome" : "CustomChromeHeadless");

  if (config.coverage) {
    karmaConfig.reporters.push("karma-typescript");
    karmaConfig.singleRun = true;
  }

  config.set(karmaConfig);
};
