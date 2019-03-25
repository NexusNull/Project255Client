/**
 * Created by Nexus on 13.08.2017.
 */

var autoIncrement = 0;

var Entity = function (owner, maxHealth, maxPower, inventorySize) {
    this.id = autoIncrement++;
    this.owner = owner;

    owner.addEntity(this);

    this.health = maxHealth;
    this.maxHealth = maxHealth;

    this.power = maxPower;
    this.maxPower = maxPower;

    this.inventory = {};
    this.inventorySize = inventorySize;

    //Entities don't exist in the world when they are created, they are added to a world at a later point.
    //For Future support of multiple worlds.
    this.world = null;
    this.x = null;
    this.y = null;
    this.direction = null;
};

Entity.prototype.process = function () {

};

Entity.prototype.setPosition = function (world, x, y, direction) {
    let currentTile = null;
    let targetTile = null;
    if(this.world){
        currentTile = this.world.getTileAt(this.x,this.y);
        currentTile.occupant = null;
    }
    if(world && x && y){
        targetTile = world.getTileAt(x, y);
        targetTile.occupant = this;
    }

    this.world = world;
    this.x = x;
    this.y = y;
    this.direction = direction;
};

Entity.prototype.setOwner = function(owner){
    this.owner = owner;
};

Entity.setAutoIncrement = function(number){
    autoIncrement = number;
};

Entity.getAutoIncrement = function(){
    return autoIncrement
};

Entity.accessible = function (entity) {
    return {
        ownerId: entity.owner.id,

        id: entity.id,

        health: entity.health,
        maxHealth: entity.maxHealth,
        power: entity.power,
        maxPower: entity.maxPower,

        type: "entity",
        x: entity.x,
        y: entity.y,
        direction: entity.direction,
        worldName: (entity.world) ? entity.world.name : null,
    }
};

Entity.prototype.accessible = function () {
    return Entity.accessible(this);
};
module.exports = Entity;