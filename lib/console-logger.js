"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* 
This code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher. 
The original code can be found at http://github.com/actano/karma-cbt-launcher
*/

module.exports = function (name) {
  return {
    debug: function debug(msg) {
      var _console;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_console = console).log.apply(_console, ["[" + name + "] DEBUG: " + msg].concat(_toConsumableArray(args)));
    },
    info: function info(msg) {
      var _console2;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      (_console2 = console).log.apply(_console2, ["[" + name + "] INFO: " + msg].concat(_toConsumableArray(args)));
    },
    error: function error(msg) {
      var _console3;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      (_console3 = console).error.apply(_console3, ["[" + name + "] ERROR: " + msg].concat(_toConsumableArray(args)));
    }
  };
};