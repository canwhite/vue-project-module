// Karma configuration
// Generated on Tue Feb 19 2019 16:36:40 GMT+0800 (GMT+08:00)

var webpackConfig = require('../build_config/webpack.test.config');
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],


    // list of files / patterns to load in the browser
    files: [
      'unit/index.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {'./unit/index.js': ['webpack', 'sourcemap']},
		
		
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //reporters: ['progress'],
    reporters: ['progress', 'spec', 'coverage'],


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
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    
    // 不显示 `webpack` 打包日志信息
    webpackServer: {
        noInfo: false
    },
    webpack: webpackConfig,
    coverageReporter: {
        dir: './coverage',
        reporters: [
            { type: 'lcov', subdir: '.' },
            { type: 'text-summary' }
        ]
    }
  })
}
