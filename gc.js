// Modules
const fs = require('fs');

// Load config
const config = require('./config.json');

// Custom modules
const log = require('./log.js');

/**
 * Garbage collection function to run on startup
 */
const init = () => {
    // res dir
    if (config.gc.res.clearOnStart) {
        if (fs.existsSync("res")) {
            fs.rmSync("res", { recursive: true });
            log.log('Deleted res directory', 0);
        }
    }
}

/**
 * Garbage collection function to run on exit
 */
const exit = () => {
    log.log('Running shutdown garbage collection', 3);
    // res dir
    if (config.gc.res.deleteOnExit) {
        if (fs.existsSync("res")) fs.rmSync("res", { recursive: true });
        log.log('Deleted res directory', 3);
    }
    // Exit
    log.log('Exiting', 1);
    process.exit(0);
}

module.exports = { init, exit };