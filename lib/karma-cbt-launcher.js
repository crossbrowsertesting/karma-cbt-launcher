'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* 
This code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher. 
The original code can be found at http://github.com/actano/karma-cbt-launcher
*/

var webdriver = require("selenium-webdriver");
var url = require('url');
var consoleLogger = require('./console-logger');
var cbtTunnel = require('./tunnel');
var session = require('./session');

var log = consoleLogger('karma-cbt-launcher');
var karmaLogger = false;

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
var XUA = 'x-ua-compatible';

function handleXUaCompatible(args, urlObj) {
    if (args[XUA]) {
        var q = urlObj.query || {};
        var query = _extends({}, q, _defineProperty({}, XUA, args[XUA]));
        return _extends({}, urlObj, { query: query });
    }
    return urlObj;
}

function handleTunnelHost(urlObj) {
    // use special hostname for tunnel
    var result = _extends({}, urlObj, { hostname: 'local' });
    delete result.host;
    delete result.search; // url.format does not want search attribute
    return result;
}

var factory = function factory(logger, baseBrowserDecorator, args, config) {

    if (!karmaLogger) {
        karmaLogger = true;
        log = logger.create('karma-cbt');
        session.setLogger(logger);
    }

    var cbtConfig = config.cbtConfig;
    var username = cbtConfig.username || process.env.CBT_USERNAME;
    var authkey = cbtConfig.authkey || process.env.CBT_AUTHKEY;
    cbtTunnel.username = username;
    cbtTunnel.authkey = authkey;

    // allows for webdriver to run tests concurrently for versions < 4
    process.env.SELENIUM_PROMISE_MANAGER = 0;

    var spec = _extends({ name: 'Karma test', build: '' }, args);
    var pseudoActivityInterval = spec.pseudoActivityInterval;
    delete spec.base;
    delete spec.config;
    delete spec.pseudoActivityInterval;

    var kill = null;

    var browser = {};
    baseBrowserDecorator(browser);
    browser.name = spec.browser_api_name + ' on ' + spec.os_api_name + ' (' + spec.screen_resolution + ') via CrossBrowserTesting';

    var start = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(id, url) {
            var cbtSession, driver, interval, stop;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            cbtSession = null;
                            driver = null;
                            interval = false;

                            stop = function () {
                                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                    var promises;
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    promises = [];

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
                                                    _context.next = 6;
                                                    return Promise.all(promises);

                                                case 6:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, undefined);
                                }));

                                return function stop() {
                                    return _ref2.apply(this, arguments);
                                };
                            }();

                            _context3.prev = 4;
                            _context3.next = 7;
                            return session.create(id);

                        case 7:
                            cbtSession = _context3.sent;

                            driver = cbtSession.configureBuilder(new webdriver.Builder().withCapabilities(spec)).build();
                            driver.getSession().then(function (seleniumSession) {
                                cbtSession.setSeleniumId(seleniumSession.getId());
                            });

                            interval = pseudoActivityInterval && setInterval(function () {
                                log.debug('Imitate activity');
                                driver.getTitle();
                            }, pseudoActivityInterval);

                            driver.get(url);

                            return _context3.abrupt('return', stop);

                        case 15:
                            _context3.prev = 15;
                            _context3.t0 = _context3['catch'](4);

                            log.error('Error starting %s', browser.name, _context3.t0);
                            _context3.next = 20;
                            return stop();

                        case 20:
                            return _context3.abrupt('return', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, undefined);
                            })));

                        case 21:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[4, 15]]);
        }));

        return function start(_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();

    browser._start = function (myurl) {
        log.info('Connecting to %s', browser.name);
        var _url = url.format(handleTunnelHost(handleXUaCompatible(spec, url.parse(myurl, true))));
        kill = start(browser.id, _url);
    };

    browser.on('kill', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(done) {
            var stop;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (kill) {
                                _context4.next = 3;
                                break;
                            }

                            done();
                            return _context4.abrupt('return');

                        case 3:
                            _context4.prev = 3;

                            log.debug('Killing %s', browser.name);
                            _context4.next = 7;
                            return kill;

                        case 7:
                            stop = _context4.sent;
                            _context4.next = 10;
                            return stop();

                        case 10:
                            done();
                            log.info('Killed %s.', browser.name);
                            _context4.next = 17;
                            break;

                        case 14:
                            _context4.prev = 14;
                            _context4.t0 = _context4['catch'](3);

                            done(_context4.t0);

                        case 17:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined, [[3, 14]]);
        }));

        return function (_x3) {
            return _ref4.apply(this, arguments);
        };
    }());

    return browser;
};

factory.$inject = ['logger', 'baseBrowserDecorator', 'args', 'config'];

module.exports = factory;