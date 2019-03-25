/**
 * Created by Nexus on 27.08.2017.
 */

/**
 * This Object serves as a storage for data that relates to an active client.
 * @param client
 * @param socket
 * @param game
 * @constructor
 */
var autoIncrement = 0;
var AnonClient = function (socket, game) {
    this.id = autoIncrement++;
    this.socket = socket;
    this.isConnected = true;
    this.game = game;
};

AnonClient.prototype.connected = function () {
    var self = this;

    this.isConnected = true;

    console.log("Anonymous client " + this.id + " connected");

    this.socket.on("disconnect", function () {
        self.disconnected();
    });

    let setup = {
        worlds: {},
        clients: [],
    };

    for (let id in this.game.worlds) {
        setup.worlds[id] = this.game.worlds[id].accessible();
    }

    for (let i = 0; i < this.game.clients.length; i++) {
        setup.clients[i] = this.game.clients[i].accessible();
    }

    this.socket.emit("setup", setup);
};

AnonClient.prototype.sendGameStateUpdates = function (data) {
    if (this.socket && this.isConnected) {
        this.socket.emit("gameStateUpdates", data)
    }
};

AnonClient.prototype.disconnected = function () {
    console.log("Anonymous Client " + this.id + " disconnected.");
    this.socket = null;
    this.isConnected = false;
};


module.exports = AnonClient;
