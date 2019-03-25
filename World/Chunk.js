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

Chunk.prototype.accessible = function () {
    let tiles = [];

    for (let i = 0; i < this.tiles.length; i++) {
        tiles[i] = this.tiles[i].accessible();
    }

    return {
        x: this.x,
        y: this.y,
        tiles: tiles,
    }
};
module.exports = Chunk;