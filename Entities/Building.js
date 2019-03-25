/**
 * Created by Nexus on 14.08.2017.
 */
var Entity = require("./Entity");

/**
 *
 * @param owner
 * @param x
 * @param y
 * @param maxHealth
 * @param maxPower
 * @param inventorySize
 * @constructor
 */
var Building = function (owner, x, y, maxHealth, maxPower, inventorySize) {
    Entity.apply(this, [owner, x, y, maxHealth, maxPower, inventorySize]);
};

Building.prototype = Entity.prototype;
Building.prototype.constructor = Building;
/**
 *
 * @param {Building} building
 * @returns {{ownerId, id, health, maxHealth, power, maxPower, type, x, y, direction, worldName}}
 */

Building.accessible = function (building) {
    let data = Entity.accessible(building);

    data.type = "building";

    return data;
};

Building.prototype.accessible = function () {
    return Building.accessible(this);
};
module.exports = Building;