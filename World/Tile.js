/**
 * Created by Nexus on 13.08.2017.
 */
var Resource = require("./ResourceEnum");
var TileEnum = require("./TileEnum");


var Tile = function (type, resourceType, resourceAmount, content) {
    this.type = (type) ? type : TileEnum.Type.LOWGROUND;
    this.resourceType = (resourceType && resourceAmount) ? resourceType : Resource.Type.NONE;
    this.resourceAmount = (resourceType && resourceAmount) ? resourceAmount : 0;
    this.content = (content) ? content : [];
    this.occupant = null;
};


module.exports = Tile;