'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* 
This code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher. 
The original code can be found at http://github.com/actano/karma-cbt-launcher
*/

var consoleLogger = require('./console-logger');
var cbt = require('cbt_tunnels');

var log = consoleLogger('cbt-tunnel');

var tunnelProm = void 0;
var isRunning = false;

module.exports = {
    setLogger: function setLogger(logger) {
        return log = logger.create('cbt-tunnel');
    },
    stop: function stop() {
        if (!isRunning) cbt.stop();
        isRunning = false;
    },
    start: function start() {
        return new Promise(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                var cbtConfig;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                cbtConfig = {
                                    username: module.exports.username,
                                    authkey: module.exports.authkey,
                                    quiet: false
                                };

                                if (!isRunning) {
                                    _context.next = 5;
                                    break;
                                }

                                //tunnel is already up
                                resolve();
                                _context.next = 31;
                                break;

                            case 5:
                                if (!tunnelProm) {
                                    _context.next = 19;
                                    break;
                                }

                                _context.prev = 6;
                                _context.t0 = resolve;
                                _context.next = 10;
                                return tunnelProm;

                            case 10:
                                _context.t1 = _context.sent;
                                (0, _context.t0)(_context.t1);
                                _context.next = 17;
                                break;

                            case 14:
                                _context.prev = 14;
                                _context.t2 = _context['catch'](6);

                                reject(_context.t2);

                            case 17:
                                _context.next = 31;
                                break;

                            case 19:
                                tunnelProm = new Promise(function (resolve, reject) {
                                    cbt.start(cbtConfig, function (err) {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            isRunning = true;
                                            resolve();
                                        }
                                    });
                                });
                                _context.prev = 20;
                                _context.t3 = resolve;
                                _context.next = 24;
                                return tunnelProm;

                            case 24:
                                _context.t4 = _context.sent;
                                (0, _context.t3)(_context.t4);
                                _context.next = 31;
                                break;

                            case 28:
                                _context.prev = 28;
                                _context.t5 = _context['catch'](20);

                                reject(_context.t5);

                            case 31:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, undefined, [[6, 14], [20, 28]]);
            }));

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        }());
    }
};