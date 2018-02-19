/**
 * Created by Nexus on 13.08.2017.
 */
var Chunk = require("./Chunk");
var ResourceEnum = require("./ResourceEnum");

var World = function (name) {
    var self = this;
    this.name = name;
    this.chunks = {};
    this.entities = {};
    this.tick = 0;
};


var k = 0;
World.prototype.doTick = function () {
    this.tick++;
    for (let id in this.entities) {
        let entity = this.entities[id];
        if (entity) {
            entity.process();
        }
    }
};

/**
 *
 * @param entity {Entity}
 * @param x {number}
 * @param y {number}
 * @param direction {number}
 */
World.prototype.addEntity = function (entity, x, y, direction) {
    if (!entity)
        return false;
    let tile = this.getTileAt(x, y);
    console.log(x,y)
    entity.setPosition(this, x, y, direction);
    tile.occupant = entity;
    this.entities[entity.id] = entity;
};

/**
 * Removes entity out of the world but the entity will still continue to exist
 * @param entity {Entity} the entity
 */
World.prototype.removeEntity = function (entity) {
    let tile = this.getTileAt(entity.x, entity.y);
    entity.setPosition(null, null, null, null);
    tile.occupant = null;
    delete this.entities[entity.id];
};

World.prototype.getTileAt = function (x, y) {
    var chunk = this.chunks[Math.floor(x / 32) + " " + Math.floor(y / 32)];
    if (chunk) {
        return chunk.getTileAt(x % 32, y % 32);
    }
};


module.exports = World;