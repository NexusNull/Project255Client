/**
 * Created by Nexus on 13.08.2017.
 */

var Entity = require("./Entity");
var Unit = require("./Unit");

var EntityFactory = function(){

};


EntityFactory.prototype.createFromNetwork = function(data, owner){
    //TODO implement Entity Enum for types
    let entity;
    switch(data.type){
        case "unit":
            entity = new Unit(owner, data.id, data.health, data.maxHealth, data.power,data.maxPower);
            break;
        default:
            throw Error("Entity type not known"+data.type);
            break;
    }
    return entity;
};

EntityFactory.prototype.createCommander = function(owner, x, y, health, power){

};

module.exports = new EntityFactory();