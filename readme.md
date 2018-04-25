## karma-cbt-launcher 
Run your [Karma](https://karma-runner.github.io/2.0/index.html) tests on [CrossBrowserTesting's](http://crossbrowsertesting.com) platform.

*A large portion of this code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher. The original code can be found [here](http://github.com/actano/karma-cbt-launcher).*

#### Install:  
npm install instructions coming soon. For now, you can require karma-cbt-launcher/index.

#### Usage:
Setup your tests in Karma as you normally would and modify your config file with the customLaunchers and cbtConfig values.

**karma.conf.js**
```javascript
module.exports = (config) => {
  config.set({
    singleRun: true,
    frameworks: ['jasmine'],
    plugins: [
      'karma-*',
      require('../index') // Path to karma-cbt-launcher
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
      username: 'CBT_USERNAME',
      authkey: 'CBT_AUTHKEY',
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
```
You can also specify the username and authkey using environment variables: **CBT_USERNAME** and **CBT_AUTHKEY**

#### Reporter:
A custom reporter 'CrossBrowserTesting' is also included that will mark a test as pass if all tests return success. If a single test returns failed, the entire suite for that device will be marked failed on the CBT results page. The results message will also be set with the number of tests passed and the number that failed.
