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

/**
 * Thanks to Deeredman1991
 * @returns {{type: *, resourceType: *, resourceAmount: *, content: *}}
 */
Tile.prototype.accessible = function () {
    return {
        id: this.id,
        type: this.type,
        resourceType: this.resourceType,
        resourceAmount: this.resourceAmount,
        content: this.content,
    }
};


module.exports = Tile;