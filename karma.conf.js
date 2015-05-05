// Karma configuration
// Generated on Wed Feb 25 2015 20:36:40 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js',
        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-mocks.js',
        'BackgammonLogicService.js',
        'BackgammonLogicService_test.js'
//        'aiService.js',
//        'aiService_test.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    coverageReporter:{type: 'html', dir:'coverage/'},


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'aiService.js':['debug']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,


      plugins : [
          'karma-chrome-launcher',
          'karma-jasmine',
          'karma-coverage'
      ]
  });
};
