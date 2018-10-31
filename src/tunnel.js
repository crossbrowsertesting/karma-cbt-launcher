/* 
This code was originally taken and modified from Actano/Marcus Mennemeier's karma-cbt-launcher. 
The original code can be found at http://github.com/actano/karma-cbt-launcher
*/


const consoleLogger = require('./console-logger');
const cbt = require('cbt_tunnels');

let log = consoleLogger('cbt-tunnel');

let tunnelProm;
let isRunning = false;

module.exports = {
    setLogger: (logger) => log = logger.create('cbt-tunnel'),
    stop: () => {
        return new Promise( (resolve, reject) => {
            if(isRunning)
                resolve();
            cbt.stop((err, didQuit) => {
                if(err || !didQuit) {
                    log.error('Could not stop tunnel');
                    reject(err);
                }
                log.info('Tunnel has been stopped');
                isRunning = false;
                resolve();
            });
        });
    },
    start:() => new Promise(async(resolve, reject) => { 
        let cbtConfig = {
            username: module.exports.username,
            authkey: module.exports.authkey,
            quiet: false,
            nokill: true
        };

        if(isRunning) {
            //tunnel is already up
            resolve();
        } else if(tunnelProm) {
            // tunnel already started. wait until done
            try {
                resolve(await tunnelProm);
            } catch(err) {
                reject(err);
            }
        } else {
            tunnelProm = new Promise((resolve, reject) => {
                cbt.start(cbtConfig, err => {
                    if(err) {
                        reject(err);
                    } else {
                        isRunning = true;
                        resolve();
                    }
                });
            });
            try {
                resolve(await tunnelProm);
            } catch(err) {
                reject(err);
            }
        }
    })
};
