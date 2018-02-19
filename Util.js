/**
 * Created by Nexus on 30.08.2017.
 */

var BotWebInterface = require("bot-web-interface");
BotWebInterface.startOnPort(1000);
var publisher = BotWebInterface.SocketServer.getPublisher();

var ResourceEnum = require("./World/ResourceEnum");


publisher.setStructure([
    {name: "name", type: "text", label: "WorldName"},
    {name: "tick", type: "text", label: "Tick"},
    {name: "image", type: "image", label: "", options: {width: 800, height: 800}}
]);
let interfaces = {};

var Gui = function(worlds){
    this.worlds = worlds;

    for(let worldName in worlds){
        let world = worlds[worldName];
        interfaces[worldName] = publisher.createInterface();
        interfaces[worldName].setDataSource(function () {
            return {
                name: "World1",
                tick: world.tick,
            }
        });
    }
};

Gui.prototype.pushToBWI = function(){
    if (!this.worlds)
        return;
    for(let worldName in this.worlds){
        let world = this.worlds[worldName];

        let height = 400;
        let width = 400;

        var PNGImage = require('pngjs-image');
        var image = PNGImage.createImage(width, height);
        image.fillRect(0, 0, image.getWidth(), image.getHeight(), {red: 255, green: 255, blue: 255, alpha: 255});
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let tile = world.getTileAt(x, y);
                if (tile) {
                    if (tile.type === 2) {
                        image.setAt(x, y, {red: 0, green: 0, blue: 255, alpha: 255});
                    } else if (tile.type === 1) {
                        image.setAt(x, y, {red: 200, green: 200, blue: 200, alpha: 255});
                    } else {
                        image.setAt(x, y, {red: 0, green: 210, blue: 0, alpha: 255});
                    }
                    if (tile.resourceType === ResourceEnum.Type.IRON) {
                        image.setAt(x, y, {red: 0, green: 180, blue: 255, alpha: 125})
                    }
                    if(tile.occupant){
                        image.setAt(x, y, {red: 255, green: 0, blue: 0, alpha: 255})
                    }
                }
            }
        }
        var pngjs = image.getImage();
        pngjs.pack();
        var chunks = [];
        pngjs.on('data', function (chunk) {
            chunks.push(chunk);
        });
        pngjs.on('end', function () {
            var result = Buffer.concat(chunks);
            interfaces[worldName].pushData("image", "data:image/png;base64," + result.toString('base64'));
        });

    }

};

module.exports = Gui;