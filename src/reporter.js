const request = require('request');
const cbtTunnel = require('./tunnel');
const session = require('./session');

const api = 'https://crossbrowsertesting.com/api/v3/selenium/';

function setScoreOrDescription(testId, action, value, callback) {
    let jsonReq = {
        'selenium_test_id': testId,
        'format': 'json',
        'action': action
    };
    
    if(action === 'set_score') {
        jsonReq.score = value;
    } else if(action === 'set_description') {
        jsonReq.description = value;
    } else {
        callback('action must be "set_score" or "set_description"');
    }
    
    let options = {
        method: 'PUT',
        uri: api + testId,
        json: jsonReq,
        auth: {
            username: cbtTunnel.username,
            password: cbtTunnel.authkey,
        },
    };
    
    // TODO: handle failures here
    request(options).on('error', (err) => {
        callback('unable to modify score or description:\n' + err);
    });
}

function CbtReporter(logger) {
    let log = logger.create('cbt-reporter');
    
    function setScore(score, testId) {
        setScoreOrDescription(testId, 'set_score', score, err => {
            log(err);
        });
    }
    
    function setDescription(description, testId) {
        setScoreOrDescription(testId, 'set_description', description, err => {
            log(err);
        });
    }
    
    this.onBrowserComplete = function(browser) {
        let res = browser.lastResult;
        let score = (res.failed ? 'fail' : 'pass');
        let seleniumId = session.activeSessions[browser.id];
        log.info('marking test ['+seleniumId+'] as '+score+'ed on CBT');
        setScore(score, seleniumId);
        let description = res.success + ' test(s) passed, ' + res.failed + ' test(s) failed';
        setDescription(description, seleniumId);
    }
}

module.exports = CbtReporter;