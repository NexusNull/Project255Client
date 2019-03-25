/**
 * Created by Nexus on 25.08.2017.
 */
console.log("Starting Client");
var ServerConnection = require("./Network/ServerConnection");
var WorldStore = require("./World/WorldStore");
var WebView = require("./WebView/main");
var Game = require("./Game");
var config = require("./config.json");
var game = new Game(config.clientId);
global.game = game;
var serverConnection = new ServerConnection(config.ip, config.port, config.clientId, config.authentication, game);

serverConnection.connect().then(function (data) {
    console.log("Connection Worked");
    game.loadFromNetwork(data)
    game.serverConnection = serverConnection;
}, function (err) {
    console.error(err);
});

