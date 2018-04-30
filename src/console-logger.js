/*
This code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher.
The original code can be found at http://github.com/actano/karma-cbt-launcher
*/

module.exports = name => ({
    debug(msg, ...args) {
        console.log(`[${name}] DEBUG: ${msg}`, ...args);
    },
    info(msg, ...args) {
        console.log(`[${name}] INFO: ${msg}`, ...args);
    },
    error(msg, ...args) {
        console.error(`[${name}] ERROR: ${msg}`, ...args);
    },
});