// Karma configuration
// Generated on Fri May 29 2015 19:30:26 GMT+0800 (中国标准时间)

var webpackConfig = require('../build_config/webpack.test.config');

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        // 相对目录，这里如果填了，files和exclude里的文件路径都会相对于它,默认是karma.conf.js所在的目录
        basePath: '',

        // frameworks to use 需要用到的断言库，这里我们只用jsamine
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'spec', 'coverage'],

        // 测试时，浏览器需要加载的文件list
        files: [
        	'./unit/specs/jasmineTest.js',
        	'./unit/test.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        	'./unit/test.js': ['coverage'],
        },

        // list of files / patterns to exclude
        // 测试时，浏览器会忽略掉这个list里面的文件，不加载它们
        exclude: ['karma.conf.js'],

        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },

        // 下面是覆盖报告
        // coverage是代码测试覆盖率的一个reporter，也就是说告诉你项目的代码有多少测试了
        coverageReporter: {
            dir: './coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        },

        // 必须
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-webpack',
            'karma-spec-reporter',
        ],

        /**
         * 日志等级
         * config.LOG_DISABLE //不输出信息
         * config.LOG_ERROR    //只输出错误信息
         * config.LOG_WARN //只输出警告信息
         * config.LOG_INFO //输出全部信息
         * config.LOG_DEBUG //输出调试信息
         */
        logLevel: config.LOG_INFO,

        // 测试启动的浏览器：有IE，Chrome，ChromeCanary，FireFox，Opera，Safari，PhantomJS
        browsers: ['Chrome'],

        // 开启或禁用持续集成模式
        // 设置为true, Karma将打开浏览器，执行测试并最后退出
        singleRun: false,

        colors: true,
        
        autoWatch: true,

        // 并发级别（启动的浏览器数）
        concurrency: Infinity,
    })
}