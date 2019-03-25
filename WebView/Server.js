/**
 * Created by Nexus on 25.08.2017.
 */

var io = new require('socket.io');
var AnonClient = require("./AnonClient");
var isSocketOpen = false;


var Server = function (game) {
    this.game = game;
    this.anonymousClients = {};
    var self = this;
    setInterval(function(){
        for(let id in self.anonymousClients){
            let client = self.anonymousClients[id];
            if(client.isConnected)
                continue;
            delete self.anonymousClients[id];
        }
    },1000);
};

Server.prototype.openSocket = function (port) {
    if (isSocketOpen)
        throw Error("Socket has already been opened");
    isSocketOpen = true;

    var self = this;

    this.serverSocket = new io((port) ? port : 2000,{pingTimeout:2000});
    this.serverSocket.sockets.on('connection', function (socket) {

        console.log("A client connected  ip: " + socket.handshake.address);

        /**
         * @param data {Object}
         * @param data.clientId {number}
         * @param data.authentication {string}
         */
        socket.on("auth", function (data) {
            if(data){
                let anonClient = new AnonClient(socket, self.game);
                anonClient.connected();
                self.anonymousClients[anonClient.id] = anonClient;
            }
        });

    });
};

Server.prototype.sendGameStateUpdates = function (data) {
    for (let id in this.anonymousClients) {
        this.anonymousClients[id].sendGameStateUpdates(data);
    }
};

module.exports = Server;