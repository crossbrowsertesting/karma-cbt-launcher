## karma-cbt-launcher 
Run your [Karma](https://karma-runner.github.io/2.0/index.html) tests on [CrossBrowserTesting's](http://crossbrowsertesting.com) platform.

*A large portion of this code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher. The original code can be found [here](http://github.com/actano/karma-cbt-launcher).*

#### Install:  
npm install instructions coming soon. For now, you can require lib/karma-cbt-launcher.

#### Usage:
Setup your tests in Karma as you normally would and modify your config file with the customLaunchers and cbtConfig values.

**karma.conf.js**
```javascript
module.exports = (config) => {
  config.set({
    singleRun: true,
    frameworks: ['jasmine'],
    plugins: ['karma-*'],
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
    cbtConfig: {
      username: 'CBT ACCOUNT EMAIL',
      authkey: 'CBT ACCOUNT AUTHKEY',
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
