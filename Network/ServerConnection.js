/**
 * Created by Nexus on 26.08.2017.
 */
var io = require("socket.io-client");
/**
 *
 * @param ipAddress
 * @param port
 * @param clientId
 * @param authentication
 * @param game
 * @property {socket} socket
 * @constructor
 */
var ServerConnection = function (ipAddress, port, clientId, authentication, game) {
    this.ipAddress = ipAddress;
    this.port = port;
    this.clientId = clientId;
    this.authentication = authentication;
    this.socket = null;
    this.game = game;
};
/**
 *
 * @returns {Promise}
 */
ServerConnection.prototype.connect = function () {
    var self = this;
    console.log("Trying connection to server " + this.ipAddress + ":" + this.port);
    return new Promise(function (resolve, reject) {
        setTimeout(reject.bind(null, "Server didn't answer fast enough"), 10000);

        var socket = io("http://" + self.ipAddress + ":" + self.port);
        socket.on("error", function (err) {
            reject(Error(err));
            console.log(err);
        });

        socket.on("connect", function () {
            console.log("authing");
            socket.emit("auth", {
                clientId: self.clientId,
                authentication: self.authentication,
            });
        });

        socket.on("oops", function (data) {
            if (data.msg) {
                reject(data.msg);
            }
        });

        socket.on("setup", function (data) {
            resolve(data);
        });

        socket.on("gameStateUpdates", function (data) {
            if (self.game) {
                self.game.processGameStateUpdates(data);
            }
        });
        self.socket = socket;
    });
};
ServerConnection.prototype.send = function(name, data) {
    this.socket.emit(name,data);

}

module.exports = ServerConnection;