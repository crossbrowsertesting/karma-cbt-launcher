const request = require('request');
const cbtTunnel = require('./tunnel');
const session = require('./session');

const api = 'https://crossbrowsertesting.com/api/v3/selenium/';

function CbtReporter(logger) {
    let log = logger.create('cbt-reporter');

    function markTest(score, testId) {
        let options = {
            method: 'PUT',
            uri: api + testId,
            json: {
                'selenium_test_id': testId,
                'format': 'json',
                'action': 'set_score',
                'score': score,
            },
            auth: {
                username: cbtTunnel.username,
                password: cbtTunnel.authkey,
            },
        };

        // TODO: handle failures here
        request(options);
    }

    function setDescription(description, testId) {
        let options = {
            method: 'PUT',
            uri: api + testId,
            json: {
                'selenium_test_id': testId,
                'format': 'json',
                'action': 'set_description',
                'description': description,
            },
            auth: {
                username: cbtTunnel.username,
                password: cbtTunnel.authkey,
            },
        };

        // TODO: handle failures here
        request(options);
    }

    this.onBrowserComplete = function(browser) {
        let res = browser.lastResult;
        let score = (res.failed ? 'fail' : 'pass');
        let seleniumId = session.activeSessions[browser.id];
        log.info('marking test ['+seleniumId+'] as '+score+'ed on CBT');
        markTest(score, seleniumId);
        let description = res.success + ' test(s) passed, ' + res.failed + ' test(s) failed';
        setDescription(description, seleniumId);
    }
}

module.exports = CbtReporter;