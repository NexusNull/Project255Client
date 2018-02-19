/**
 * Created by Nexus on 27.08.2017.
 */
var World = require("./World/World");
var Chunk = require("./World/Chunk");
var Tile = require("./World/Tile");
var Gui = require("./Util");
var Client = require("./Client");
var EntityFactory = require("./Entities/EntityFactory");



let Game = function(){
    this.clients = [];
    this.localClient = null;
    this.worlds = {};
    this.serverConnection = null;
    this.entities = [];

    this.gui = null;
};

Game.prototype.loadFromNetwork = function(data){
    for(let name in data.worlds) {
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

    for(let id in data.clients){
        this.clients[id] = new Client(data.clients[id]);
    }

    for(let id in data.entities){
        let entity = EntityFactory.createFromNetwork(data.entities[id],this.clients[data.entities[id].ownerId]);
        if(data.entities[id].worldName)
            this.worlds[data.entities[id].worldName].addEntity(entity, data.entities[id].x, data.entities[id].y, data.entities[id].direction);
        this.entities[id] = entity;
    }
    this.gui = new Gui(this.worlds);
};


Game.prototype.addClient = function(){

};

Game.prototype.addWorld = function(){

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

Game.prototype.processGameStateUpdates = function(data){
    for(let id in data.entities){
        let entityData = data.entities[id];
        let entity = this.entities[id];
        if(entity)
            entity.setPosition(this.worlds[entityData.worldName], entityData.x, entityData.y, entityData.direction);
    }
    this.processing();
};

Game.prototype.processing = function(){
    if(this.gui)
        this.gui.pushToBWI();
};



module.exports = Game;