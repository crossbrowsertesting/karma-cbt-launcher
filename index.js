const launcher = require('./lib/karma-cbt-launcher');
const reporter = require('./lib/reporter');

module.exports = { 
    'reporter:CrossBrowserTesting': ['type', reporter],
    'launcher:CrossBrowserTesting': ['factory', launcher]
};