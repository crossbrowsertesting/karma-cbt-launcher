'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* 
This code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher. 
The original code can be found at http://github.com/actano/karma-cbt-launcher
*/

var consoleLogger = require('./console-logger');
var cbtTunnel = require('./tunnel');

var activeSessions = {};

var remoteHub = 'http://hub.crossbrowsertesting.com:80/wd/hub';

var log = consoleLogger('cbt-session');

module.exports = {
    activeSessions: activeSessions,
    setLogger: function setLogger(logger) {
        log = logger.create('cbt-session');
        cbtTunnel.setLogger(logger);
    },
    create: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            log.debug('Starting session %s', id);

                            if (!activeSessions[id]) {
                                _context.next = 3;
                                break;
                            }

                            throw new Error('Session ' + id + ' already active');

                        case 3:
                            activeSessions[id] = '';
                            _context.prev = 4;
                            _context.next = 7;
                            return cbtTunnel.start();

                        case 7:
                            _context.next = 13;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](4);

                            console.error(_context.t0);
                            process.exit(1);

                        case 13:
                            return _context.abrupt('return', {
                                stop: function stop() {
                                    if (!activeSessions[id]) throw new Error('Session ' + id + ' not active');
                                    log.debug('Closing session %s', id);
                                    delete activeSessions[id];
                                    if (Object.keys(activeSessions).length === 0) {
                                        log.info('Last session, stopping tunnel');
                                        cbtTunnel.stop();
                                    }
                                },

                                setSeleniumId: function setSeleniumId(seleniumId) {
                                    activeSessions[id] = seleniumId;
                                },
                                configureBuilder: function configureBuilder(builder) {
                                    var caps = builder.usingServer(remoteHub).getCapabilities();
                                    log.debug('Configuring selenium builder for %s', JSON.stringify(caps));
                                    caps.set('username', cbtTunnel.username);
                                    caps.set('password', cbtTunnel.authkey);
                                    caps.set('tunnel_name', cbtTunnel.name);
                                    return builder;
                                }
                            });

                        case 14:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[4, 9]]);
        }));

        function create(_x) {
            return _ref.apply(this, arguments);
        }

        return create;
    }()
};