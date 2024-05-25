// Config
const config = require("../config.json");

// Custom Modules
const log = require("../log.js");

// Modules
const ping = require("ping");

let services = {};

// Set up ping probes
const probe = () => {
    config.upchecker.hosts.forEach(function (host) {
        if (config.upchecker.logs.probe)
            log.log("Probing " + host, 3, "Upchecker");
        ping.promise.probe(host, {
            deadline: config.upchecker.deadline,
            timeout: config.upchecker.probe_timeout
        }).then(function (res) {
            if (config.upchecker.logs.probe_result)
                log.log("Probe result of " + host + ": " + (res.alive ? "UP" : "DOWN"), res.alive ? 3 : 1, "Upchecker");
            if (config.upchecker.logs.state_change && services[host] != res.alive)
                log.log("New state of " + host + ": " + (res.alive ? "UP" : "DOWN"), 1, "Upchecker");
            services[host] = res.alive;
        });
    });
}
setInterval(probe, config.upchecker.heartbeat * 1000);

// Prepare first run
log.log("Sending first probes", 0, "Upchecker");
for (const iterator of config.upchecker.hosts) services[iterator] = true;
probe();

// Add state-sender
module.exports = {
    getStatuses: () => { return services; }
}