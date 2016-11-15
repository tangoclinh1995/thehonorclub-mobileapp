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

      // Ionic Datepicker
      "www/lib/ionic-datepicker/dist/ionic-datepicker.bundle.min.js",

      // Ionic Timepicker
      "www/lib/ionic-timepicker/dist/ionic-timepicker.bundle.min.js",

      // Moment.js
      "www/lib/moment/min/moment.min.js",

      // Ionic Tinder card library -->
      "www/lib/collide/collide.js",
      "www/lib/ionic-ion-tinder-cards/ionic.tdcards.js",
      
      // Our app's JS files
      "www/app.js",
      "app/js_controllers/*.js",
      "app/js_services/*.js",
      "app/js_routing/*.js",

      // Unit testing files
      "unit_testing/test_controllers/*.js",
      "unit_testing/test_services/*.js",

      "www/templates/*.html"
    ],

    // List of files to exclude
    exclude: [
    ],

    preprocessors: {
      "app/js_controllers/*.js": ["coverage"],
      "app/js_services/*.js": ["coverage"],
    },

    reporters: ["progress", "coverage"],
    coverageReporter: {
      type: "html",
      dir: "coverage/",
      subdir: "."
    },

    port: 9876,
    browsers: ['FirefoxDeveloper'],

    colors: true,  

    singleRun: true,

    plugins: [
      "karma-firefox-launcher",
      "karma-jasmine",
      "karma-coverage",
      "karma-ng-html2js-preprocessor"
    ]

  })
}