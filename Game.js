/**
 * Created by Nexus on 27.08.2017.
 */
var World = require("./World/World");
var Chunk = require("./World/Chunk");
var Tile = require("./World/Tile");
var Gui = require("./Util");
var Client = require("./Client");
var JobEnum = require("./Enum/JobEnum");
var EntityFactory = require("./Entities/EntityFactory");
var Server = require("./WebView/Server");

const TileEnum = require("./World/TileEnum");


let Game = function (localClientId) {
    this.clients = [];
    this.localClientId = localClientId;
    this.localClient = null;
    this.worlds = {};
    this.serverConnection = null;
    this.entities = [];
    this.server = null;
    this.gui = null;
};

Game.prototype.loadFromNetwork = function (data) {
    for (let name in data.worlds) {
        let world = new World(name);
        world.tick = data.worlds[name].tick;
        for (let id in data.worlds[name].chunks) {
            let chunkData = data.worlds[name].chunks[id];
            let chunk = new Chunk(chunkData.x, chunkData.y);
            for (let i = 0; i < chunkData.tiles.length; i++) {
                let tileData = chunkData.tiles[i];
                chunk.tiles[i] = new Tile(tileData.type, tileData.resourceType, tileData.resourceAmount, tileData.content);
            }
            world.chunks[id] = chunk;
        }
        this.worlds[name] = world;
    }

    for (let id in data.clients) {
        if (id == this.localClientId) {
            let client = new Client(data.clients[id]);
            this.clients[id] = client;
            this.localClient = client;
        } else
            this.clients[id] = new Client(data.clients[id]);
    }

    for (let id in data.entities) {
        let entity = EntityFactory.createFromNetwork(data.entities[id], this.clients[data.entities[id].ownerId]);
        if (data.entities[id].worldName)
            this.worlds[data.entities[id].worldName].addEntity(entity, data.entities[id].x, data.entities[id].y, data.entities[id].direction);
        this.entities[id] = entity;
    }
    this.server = new Server(this);
    this.server.openSocket(2000);
    this.gui = new Gui(this.worlds);
};


Game.prototype.addClient = function () {

};

Game.prototype.addWorld = function () {

};

Game.prototype.addEntity = function (entity) {
    this.entities[entity.id] = entity;
};

Game.prototype.removeEntity = function (entity) {
    let world = entity.world;
    if (world) {
        world.removeEntity(entity);
    }
    delete this.entities[entity.id];
};

Game.prototype.processGameStateUpdates = function (data) {
    for (let name in this.worlds) {
        var world = data.worlds[name];
        var entities = world.entities;
        var chunkUpdates = world.chunkUpdates;
        for (let id = 0; id < entities.length; id++) {
            let entity = entities[id];
            for (let key in entity) {
                if (this.entities[id]){
                    this.entities[id].jobQueue = entity.jobQueue;
                    this.entities[id].setPosition(this.worlds[entity.worldName], entity.x, entity.y, entity.direction);
                }
            }
        }
        for (let id in chunkUpdates) {
            let tmp = id.split(" ");
            let x = tmp[0];
            let y = tmp[1];
        }
    }
    if(this.server)
        this.server.sendGameStateUpdates(data);
    this.processing();
};

Game.prototype.processing = function () {
    if (this.localClient) {
        for (var id in this.localClient.entities) {
            var entity = this.localClient.entities[id];
            if(entity.jobQueue.length > 0)
                continue;

            let world = entity.world;
            let targetTile = null;
            switch (entity.direction) {
                case 0:
                    targetTile = entity.world.getTileAt(entity.x + 1, entity.y);
                    break;
                case 1:
                    targetTile = entity.world.getTileAt(entity.x, entity.y + 1);
                    break;
                case 2:
                    targetTile = entity.world.getTileAt(entity.x - 1, entity.y);
                    break;
                default:
                    targetTile = entity.world.getTileAt(entity.x, entity.y - 1);
                    break;
            }

            if (targetTile && !targetTile.occupant && targetTile.type === TileEnum.Type.LOWGROUND) {
                entity.queueJob(JobEnum.Type.MOVE, null);
            } else {
                entity.queueJob(JobEnum.Type.TURN, {direction: Math.floor(Math.random() * 4)});
            }
        }
    }
};


module.exports = Game;