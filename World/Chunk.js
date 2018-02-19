/**
 * Created by Nexus on 13.08.2017.
 */

var TileType = require("./TileEnum");
var Tile = require("./Tile");

/**
 * A Chunk is a part of the Map that is 32*32
 * @constructor
 */
var Chunk = function (x, y) {
    this.tiles = [];
    this.x = x;
    this.y = y;

};

Chunk.prototype.getTileAt = function (x, y) {
    return this.tiles[y * 32 + x];
};

module.exports = Chunk;