// Load Config
const config = require("./config.json");

// Modules
const express = require("express");
const fs = require("fs");

// Custom modules
const log = require("./log.js");
const gc = require("./gc.js");

// Init modules
log.init();

// GC init
gc.init();

// Init res dir
if (!fs.existsSync("res")) {
    fs.mkdirSync("res");
    log.log("Created res directory", 0);
}

// Init express
const app = express();

// Frontend server
const front_srv = require("./frontend-server.js");
app.use("/", front_srv);

// API server
const api_srv = require("./api-server.js");
app.use("/api", api_srv);

// Start HTTP-server
app.listen(config.port, () => {
    log.log("HTTP-Server started under http://localhost:" + config.port, 3);
});

// GC exit
process.on('SIGINT', gc.exit);