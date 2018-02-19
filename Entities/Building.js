/**
 * Created by Nexus on 14.08.2017.
 */
var Entity = require("./Entity");


var Building = function (owner, x, y, health, maxHealth, power, maxPower) {
    Entity.apply(this, [owner, x, y, health, maxHealth, power, maxPower]);
};

Building.prototype = Entity.prototype;
Building.prototype.constructor = Building;

module.exports = Building;