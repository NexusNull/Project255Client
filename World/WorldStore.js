/**
 * Created by Nexus on 13.08.2017.
 */
var World = require("./World");
var Chunk = require("./Chunk");
var Tile = require("./Tile");

var Client = require("../Client");
var EntityFactory = require("../Entities/EntityFactory");
/**
 * Loads and saves worlds
 * will use compression to store worlds
 * @constructor
 */
var WorldStore = function () {


};

WorldStore.prototype.getAvailableWorlds = function () {
    var worlds = [];

    return worlds;
};

WorldStore.prototype.loadWorld = function (name) {
    var world = new World();


    return world;
};


WorldStore.prototype.saveWorld = function (world) {


};

module.exports = new WorldStore();

