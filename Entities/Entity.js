/**
 * Created by Nexus on 13.08.2017.
 */

var autoIncrement = 1;

var Entity = function (owner, id,  health, maxHealth, power, maxPower) {
    this.id = id;
    this.owner = owner;

    owner.addEntity(this);

    this.health = health;
    this.maxHealth = maxHealth;

    this.power = power;
    this.maxPower = maxPower;

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


module.exports = Entity;