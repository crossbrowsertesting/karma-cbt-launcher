require('babel-polyfill');

module.exports = (config) => {
  config.set({
    singleRun: true,
    frameworks: ['jasmine'],
    plugins: [
      'karma-*',
      '@cbt/karma-cbt-launcher'
    ],
    preprocessors: {
      'tests/*.html': ['html2js']
    },
    files: [
      'tests/*.js',
      'tests/index.html'
    ],
    logLevel: config.LOG_DEBUG,
    browsers: [
      'win7_ie11',
      'win10_edge20',
    ],
    reporters: [
      'progress',
      'CrossBrowserTesting',
    ],
    cbtConfig: {
      username: '',
      authkey: '',
    },
    customLaunchers: {
      win7_ie11: {
        base: 'CrossBrowserTesting',
        browserName: 'win7_ie11',
        browser_api_name: 'IE11',
        os_api_name: 'Win7x64',
        screen_resolution: '1366x768',
      },
      win10_edge20: {
        base: 'CrossBrowserTesting',
        browserName: 'win10_edge20',
        browser_api_name: 'Edge20',
        os_api_name: 'Win10',
        screen_resolution: '1920x1080',
      },
    },
  })
}
