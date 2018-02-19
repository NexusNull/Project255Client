/**
 * Created by Nexus on 25.08.2017.
 */
console.log("Starting Client");
var ServerConnection = require("./Network/ServerConnection");
var WorldStore = require("./World/WorldStore");
var Game = require("./Game");
var game = new Game();
var serverConnection = new ServerConnection("localhost", 255, 0, "random", game);


serverConnection.connect().then(function (data) {
    console.log("Connection Worked");
    game.loadFromNetwork(data)

}, function (err) {
    console.log(err);
});

