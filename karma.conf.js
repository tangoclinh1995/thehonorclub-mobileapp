module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],

    // List of files / patterns to load in the browser
    files: [
      // Ionic libraries
      "www/lib/ionic/js/ionic.bundle.js",

      // Angular Mocks
      "www/lib/angular-mocks/angular-mocks.js",

      // Firebase
      "www/lib/firebase/firebase.js",

      // Angular Fire
      "www/lib/angularfire/dist/angularfire.min.js",

      // Our app's JS files
      "www/app.js",
      "app/js_controllers/*.js",
      "app/js_services/*.js",

      // Unit testing files
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
