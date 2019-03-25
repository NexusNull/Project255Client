/**
 * Created by Nexus on 26.08.2017.
 */

var ServerConnection = function(ipAddress, port, clientId, authentication, game){
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
ServerConnection.prototype.connect = function(){
    var self = this;
    console.log("Trying connection to server "+this.ipAddress+":"+this.port);
    return new Promise(function(resolve, reject){
        setTimeout(reject.bind(null,Error("Server didn't answer fast enough")),10000);

        let socket = io("http://"+self.ipAddress+":"+self.port);
        socket.on("error",function(err){
            reject(Error(err));
            console.log(err);
        });

        socket.on("connect",function(){
            console.log("authing");
            socket.emit("auth",{
                clientId: self.clientId,
                authentication: self.authentication,
            });
        });

        socket.on("oops",function(data){
            if(data.msg){
                reject(Error(data.msg));
            }
        });

        socket.on("setup",function(data){
            resolve(data);
        });

        socket.on("gameStateUpdates",function(data){
            if(self.game){
                self.game.processGameStateUpdates(data);
            }
        });
    });
};
