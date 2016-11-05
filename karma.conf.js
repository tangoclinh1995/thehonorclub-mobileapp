module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],

    // List of files / patterns to load in the browser
    files: [
      "www/lib/ionic/js/ionic.bundle.js",

      "www/lib/angular-mocks/angular-mocks.js",

      "www/lib/firebase/firebase.js",
      "www/lib/angularfire/dist/angularfire.min.js",

      "www/app.js",
      "app/js_controllers/*.js",
      "app/js_services/*.js",

      "unit_testing/test_controllers/*.js",
      "unit_testing/test_services/*.js",
    ],

    // List of files to exclude
    exclude: [
    ],

    preprocessors: {
      "unit_testing/test_controllers/*.js": ["coverage"],
      "unit_testing/test_services/*.js": ["coverage"],
    },

    reporters: ["progress", "coverage"],
    coverageReporter: {
      type: "html",
      dir: "coverage/",
      subdir: "."
    },

    port: 9876,
    browsers: ["Chrome"],

    colors: true,  

    singleRun: true,

    plugins: [
      "karma-chrome-launcher",
      "karma-jasmine",
      "karma-coverage"
    ]

  })
}
