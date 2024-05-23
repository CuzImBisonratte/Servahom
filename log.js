const config = require("./config.json");
const path = require("path");
const fs = require("fs");

// Set up log paths
const logPath = path.join(__dirname, config.logs.log_dir);
const logFile = path.join(logPath, "log.txt");

/**
 * Log a message to the log file
 * @param {string} message The message to log
 * @param {number} log_level The log level of the message (default: 2)
 * @param {string} [time] The time to log (default: current time)
 */
const log = (message, log_level = 0, time = new Date().toISOString()) => {
    // Log level 0: Info (Color: Blue - Icon: i)
    // Log level 1: Warning (Color: Yellow - Icon: !)
    // Log level 2: Error (Color: Red - Icon: X)
    // Log level 3: Success (Color: Green - Icon: ✓)
    const color = (() => {
        switch (log_level) {
            case 0:
                return "\x1b[34m";
            case 1:
                return "\x1b[33m";
            case 2:
                return "\x1b[31m";
            case 3:
                return "\x1b[32m";
        }
    })();
    const icon = (() => {
        switch (log_level) {
            case 0:
                return "i";
            case 1:
                return "!";
            case 2:
                return "X";
            case 3:
                return "✓";
        }
    })();
    // Style Time
    const styled_time = config.logs.show_date ? new Date(time).toISOString() : new Date(time).toLocaleTimeString();
    // Output message
    console.log(`${color}${styled_time} [${icon}] ${message}\x1b[0m`);
    // Write message to log file
    fs.appendFileSync(logFile, `${styled_time} [${icon}] ${message}\n`);
}

/**
 * Initialize the log module
 */
const init = () => {
    const log_texts = [];
    log_texts.push(new Date().toISOString(), "Initializing log module");
    if (!fs.existsSync(logPath)) {
        log_texts.push(new Date().toISOString(), "Creating log directory");
        fs.mkdirSync(logPath);
    }
    if (config.logs.keep_logs > 0) {
        log_texts.push(new Date().toISOString(), "Rotating logs");
        // Rotate logs
        for (let i = config.logs.keep_logs - 1; i > 0; i--) {
            const oldFile = path.join(logPath, `log-${i}.txt`);
            const newFile = path.join(logPath, `log-${i + 1}.txt`);
            if (fs.existsSync(oldFile)) fs.renameSync(oldFile, newFile);
        }
        if (fs.existsSync(logFile)) fs.renameSync(logFile, path.join(logPath, "log-1.txt"));
    }
    // Delete old logs
    fs.readdirSync(logPath).forEach((file) => {
        if (file.startsWith("log-") && parseInt(file.split("-")[1].split(".")[0]) > config.logs.keep_logs) {
            log_texts.push(new Date().toISOString(), "Deleting old log file: " + file);
            fs.unlinkSync(path.join(logPath, file));
        }
    });
    // Create new log file
    if (!fs.existsSync(logFile)) {
        log_texts.push(new Date().toISOString(), "Creating log file");
        fs.writeFileSync(logFile, "");
    }
    // Log initialization logs
    for (i = 0; i < log_texts.length; i += 2) log(log_texts[i + 1], 0, log_texts[i]);
}

module.exports = { init, log };