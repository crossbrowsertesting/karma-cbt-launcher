/* 
This code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher. 
The original code can be found at http://github.com/actano/karma-cbt-launcher
*/

const webdriver = require("selenium-webdriver");
const url = require('url');
const consoleLogger = require('./console-logger');
const cbtTunnel = require('./tunnel');
const session = require('./session');

let log = consoleLogger('karma-cbt-launcher');
let karmaLogger = false;

// Handle x-ua-compatible option same as karma-ie-launcher(copy&paste):
//
// Usage :
//   customLaunchers: {
//     IE9: {
//       base: 'WebDriver',
//       config: webdriverConfig,
//       'x-ua-compatible': 'IE=EmulateIE9'
//     }
//   }
//
// This is done by passing the option on the url, in response the Karma server will
// set the following meta in the page.
//   <meta http-equiv="X-UA-Compatible" content="[VALUE]"/>
const XUA = 'x-ua-compatible';

function handleXUaCompatible(args, urlObj) {
    if (args[XUA]) {
        const q = urlObj.query || {};
        const query = { ...q, [XUA]: args[XUA] };
        return { ...urlObj, query };
    }
    return urlObj;
}

function handleTunnelHost(urlObj) {
    // use special hostname for tunnel
    const result = { ...urlObj, hostname: 'local' };
    delete result.host;
    delete result.search; // url.format does not want search attribute
    return result;
}

const factory = (logger, baseBrowserDecorator, args, config) => {
    
    if (!karmaLogger) {
        karmaLogger = true;
        log = logger.create('karma-cbt');
        session.setLogger(logger);
    }

    let cbtConfig = config.cbtConfig;
    const username = cbtConfig.username || process.env.CBT_USERNAME;
    const authkey = cbtConfig.authkey || process.env.CBT_AUTHKEY;
    cbtTunnel.username = username;
    cbtTunnel.authkey = authkey;

    // allows for webdriver to run tests concurrently for versions < 4
    process.env.SELENIUM_PROMISE_MANAGER = 0;
    
    const spec = { name: 'Karma test', build: '', ...args };
    const pseudoActivityInterval = spec.pseudoActivityInterval;
    delete spec.base;
    delete spec.config;
    delete spec.pseudoActivityInterval;
    
    let kill = null;
    
    const browser = {};
    baseBrowserDecorator(browser);
    browser.name = `${spec.browser_api_name} on ${spec.os_api_name} (${spec.screen_resolution}) via CrossBrowserTesting`;
    
    const start = async (id, url) => {
        let cbtSession = null;
        let driver = null;
        let interval = false;
        
        const stop = async () => {
            const promises = [];
            if (cbtSession) {
                promises.push(cbtSession.stop());
            }
            if (interval) {
                clearInterval(interval);
            }
            if (driver && driver.getSession()) {
                log.debug('Quitting selenium');
                promises.push(driver.quit());
            }
            await Promise.all(promises);
        };
        
        try {
            cbtSession = await session.create(id);
            driver = cbtSession.configureBuilder(new webdriver.Builder().withCapabilities(spec)).build();
            driver.getSession().then( (seleniumSession) => {
                cbtSession.setSeleniumId(seleniumSession.getId());
            });
            
            interval = pseudoActivityInterval && setInterval(() => {
                log.debug('Imitate activity');
                driver.getTitle();
            }, pseudoActivityInterval);
            
            driver.get(url);
            
            return stop;
        } catch (e) {
            log.error('Error starting %s', browser.name, e);
            await stop();
            return async () => {};
        }
    };
    
    browser._start = (myurl) => {
        log.info('Connecting to %s', browser.name);
        const _url = url.format(handleTunnelHost(handleXUaCompatible(spec, url.parse(myurl, true))));
        kill = start(browser.id, _url);
    };
    
    browser.on('kill', async (done) => {
        if (!kill) {
            done();
            return;
        }
        try {
            log.debug('Killing %s', browser.name);
            const stop = await kill;
            await stop();
            done();
            log.info('Killed %s.', browser.name);
        } catch (e) {
            done(e);
        }
    });
    
    return browser;
};

factory.$inject = ['logger', 'baseBrowserDecorator', 'args', 'config'];

module.exports = factory;
