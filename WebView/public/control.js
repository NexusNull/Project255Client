var renderer;
var scene, chunkScene, entityScene;
var chunks = {};
var tileDim = 32, chunkDim = 32;
var gameData = null;
var zoom = 1;
var worldName = "World";

var Game = function () {
    this.entities = [];
};

Game.prototype.processGameStateUpdates = function (data) {
    var world = data.worlds[worldName];
    var entities = world.entities;
    var chunkUpdates = world.chunkUpdates;
    for (let id = 0; id < entities.length; id++) {
        let entity = entities[id];
        for (let key in entity) {
            if (this.entities[id])
                this.entities[id][key] = entity[key];
        }
        if (this.entities[id]) {
            if (this.entities[id].sprite) {
                let sprite = this.entities[id].sprite;
                sprite.x = tileDim * entity.x + tileDim / 2;
                sprite.y = tileDim * entity.y + tileDim / 2;
                sprite.rotation = Math.PI / 2 * entity.direction;
                if(sprite.craftingStatus)
                    sprite.craftingStatus.visible = !entity.isCrafting;
            } else {
                //TODO found entity without sprite, means we are missing a texture or just missed the definition for the sprite
                console.err("found entity without sprite, means we are missing a texture or just missed the definition for the sprite");
            }

        } else {
            // TODO found an entity that isn't part of entities yet, request (resend init packet).
        }
    }
    for(let id in chunkUpdates){
        let tmp = id.split(" ");
        let x = tmp[0];
        let y = tmp[1];
    }
};
var game = new Game();

$(document).ready(function () {
    console.log("Starting ...");
    var serverConnection = new ServerConnection("localhost", 2000, 0, "anonymous", game);

    (async function () {
        let data = await serverConnection.connect();
        gameData = data;
        let dim = tileDim * chunkDim;

        //eta means top left chunk position
        //theta means bottom right chunk position

        let etaX = -Math.floor(scene.x * (1 / zoom) / dim) - 1,
            etaY = -Math.floor(scene.y * (1 / zoom) / dim) - 1;

        let thetaX = Math.ceil(window.innerWidth * (1 / zoom) / dim) + 1,
            thetaY = Math.ceil(window.innerHeight * (1 / zoom) / dim) + 1;

        for (let i = 0; i < thetaX; i++) {
            for (let j = 0; j < thetaY; j++) {
                createChunk(etaX + i, etaY + j, []);
            }
        }

        game.entities = data.worlds[worldName].entities;
        for (let key in game.entities) {
            let sprite;
            let entity = game.entities[key];
            console.log(entity)
            if (entity.type === "unit") {
                switch (entity.unitType) {
                    case 0:
                        sprite = new PIXI.Sprite(PIXI.loader.resources["images/commander.png"].texture);
                        break;
                    case 1:
                        sprite = new PIXI.Sprite(PIXI.loader.resources["images/builder.png"].texture);
                        break;
                    case 2:
                        sprite = new PIXI.Sprite(PIXI.loader.resources["images/miner.png"].texture);
                        break;
                    case 3:
                        sprite = new PIXI.Sprite(PIXI.loader.resources["images/power_distributor.png"].texture);
                        break;
                    default:
                        sprite = new PIXI.Sprite(PIXI.loader.resources["images/missing_texture.png"].texture);
                        break;
                }
            } else if (entity.type === "building") {
                switch (entity.buildingType) {
                    case 0:
                        sprite = new PIXI.Sprite(PIXI.loader.resources["images/generator.png"].texture);
                        break;
                    default:
                        sprite = new PIXI.Sprite(PIXI.loader.resources["images/missing_texture.png"].texture);
                        break;
                }

                let craftingStatus = new PIXI.Sprite(PIXI.loader.resources["images/inactive.png"].texture);
                craftingStatus.x -= 16;
                craftingStatus.y -= 16;

                sprite.addChild(craftingStatus);
                sprite.craftingStatus = craftingStatus;
            }

            game.entities[key].sprite = sprite;
            sprite.anchor.set(0.5);
            sprite.x = tileDim * entity.x + tileDim / 2;
            sprite.y = tileDim * entity.y + tileDim / 2;
            sprite.rotation = Math.PI / 2 * entity.direction;
            entityScene.addChild(sprite);
        }
    })();

    let app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        transparent: false,
        resolution: 1,
        view: $("#main")[0]
    });
    scene = new PIXI.Container();
    chunkScene = new PIXI.Container();
    entityScene = new PIXI.Container();
    scene.addChild(chunkScene);
    scene.addChild(entityScene);

    scene.scale.x = zoom;
    scene.scale.y = zoom;

    renderer = app.renderer;

    function createChunk(x, y) {
        let dim = tileDim * chunkDim;
        var chunk = new PIXI.Container();
        if (gameData.worlds[worldName].chunks[x + " " + y]) {
            var tiles = gameData.worlds[worldName].chunks[x + " " + y].tiles;

            for (let i = 0; i < chunkDim; i++) {
                for (let j = 0; j < chunkDim; j++) {
                    let tile = tiles[chunkDim * j + i];
                    let sprite;
                    let ressource;
                    let content;
                    switch (tile.type) {
                        case 0:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/grass.png"].texture);
                            break;
                        case 1:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/stone.png"].texture);
                            break;
                        case 2:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/water.png"].texture);
                            break;
                        default:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/missing_texture.png"].texture);
                            break;
                    }
                    chunk.addChild(sprite);
                    sprite.x = tileDim * i;
                    sprite.y = tileDim * j;

                    if (tile.resourceType !== 0) {
                        switch (tile.resourceType) {
                            case 1:
                                ressource = new PIXI.Sprite(PIXI.loader.resources["images/iron.png"].texture);
                                break;
                            default:
                                ressource = new PIXI.Sprite(PIXI.loader.resources["images/missing_texture.png"].texture);
                                break;
                        }

                        chunk.addChild(ressource);

                        ressource.x = tileDim * i;
                        ressource.y = tileDim * j;
                        ressource.alpha = Math.min(tiles[chunkDim * j + i].resourceAmount / 800, 1);
                    }

                    if (tile.content.length !== 0) {
                        content = new PIXI.Sprite(PIXI.loader.resources["images/crate.png"].texture);

                        chunk.addChild(content);

                        content.x = tileDim * i;
                        content.y = tileDim * j;
                    }
                }
            }
        } else {
            for (let i = 0; i < chunkDim; i++) {
                for (let j = 0; j < chunkDim; j++) {
                    var sprite;
                    switch (3) {
                        case 0:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/grass.png"].texture);
                            break;
                        case 1:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/stone.png"].texture);
                            break;
                        case 2:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/water.png"].texture);
                            break;
                        case 3:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/iron.png"].texture);
                            break;
                        default:
                            sprite = new PIXI.Sprite(PIXI.loader.resources["images/missing_texture.png"].texture);
                            break;
                    }

                    chunk.addChild(sprite);
                    sprite.x = tileDim * i;
                    sprite.y = tileDim * j;
                }
            }
        }

        chunk.cacheAsBitmap = true;

        chunk.x = x * dim;
        chunk.y = y * dim;

        chunkScene.addChild(chunk);
        chunks[x + ":" + y] = chunk;
        return chunk;
    }

    function createUnit(x, y) {

    }

    function setup() {
        app.stage.addChild(scene);

    }

    function screenToChunkPos(data) {
        let dim = tileDim * chunkDim;
        let etaX = -Math.floor(data.x * (1 / zoom) / dim) - 1,
            etaY = -Math.floor(data.y * (1 / zoom) / dim) - 1;

        let thetaX = Math.ceil(data.width * (1 / zoom) / dim) + 1,
            thetaY = Math.ceil(data.height * (1 / zoom) / dim) + 1;

        return {x: etaX, y: etaY, width: thetaX, height: thetaY}
    }

    function onViewportChange(oldRect, newRect) {
        oldRect = screenToChunkPos(oldRect);
        newRect = screenToChunkPos(newRect);

        for (let i = 0; i < oldRect.width; i++) {
            for (let j = 0; j < oldRect.height; j++) {
                var chunk = chunks[(oldRect.x + i) + ":" + (oldRect.y + j)];
                if (chunk)
                    chunk.visible = false;
            }
        }
        for (let i = 0; i < newRect.width; i++) {
            for (let j = 0; j < newRect.height; j++) {
                let chunk = chunks[(newRect.x + i) + ":" + (newRect.y + j)];
                if (chunk)
                    chunk.visible = true;
                else
                    chunk = createChunk(newRect.x + i, newRect.y + j, []);
            }
        }
    }


    var moveTo = {x: 0, y: 0};
    PIXI.ticker.shared.add(function (elapsedTime) {
        if (!(moveTo.x == 0 && moveTo.y == 0)) {
            let oldViewport = {x: scene.x, y: scene.y, width: window.innerWidth, height: window.innerHeight};
            scene.x += moveTo.x;
            scene.y += moveTo.y;
            let newViewPort = {x: scene.x, y: scene.y, width: window.innerWidth, height: window.innerHeight};
            if (!(oldViewport.x === newViewPort.x && oldViewport.y === newViewPort.y && oldViewport.width === newViewPort.width && oldViewport.height === newViewPort.height)) {
                onViewportChange(oldViewport, newViewPort);
            }
            moveTo = {x: 0, y: 0};
        }
    });

    PIXI.ticker.shared.speed = 1;
    PIXI.loader
        .add("images/grass.png")
        .add("images/stone.png")
        .add("images/water.png")
        .add("images/iron.png")
        .add("images/commander.png")
        .add("images/generator.png")
        .add("images/missing_texture.png")
        .add("images/inactive.png")
        .add("images/crate.png")
        .load(setup);

    var oldDimensions = {width: window.innerWidth, height: window.innerHeight};
    window.onresize = function (event) {
        renderer.resize(window.innerWidth, window.innerHeight);

        let oldViewport = {x: scene.x, y: scene.y, width: oldDimensions.width, height: oldDimensions.height};

        oldViewport.width = oldDimensions.width;
        oldViewport.height = oldDimensions.height;

        oldDimensions = {width: window.innerWidth, height: window.innerHeight}

        let newViewPort = {x: scene.x, y: scene.y, width: window.innerWidth, height: window.innerHeight};

        if (!(oldViewport.x === newViewPort.x &&
                oldViewport.y === newViewPort.y &&
                oldViewport.width === newViewPort.width &&
                oldViewport.height === newViewPort.height)) {
            onViewportChange(oldViewport, newViewPort);
        }
    };
    window.addEventListener("wheel", function (event) {
        if (zoom > 2 && -event.deltaY > 0)
            return;
        if (zoom < 0.3 && -event.deltaY < 0)
            return;
        let oldViewport = {x: scene.x, y: scene.y, width: window.innerWidth, height: window.innerHeight};
        let mousePos1 = {
            x: (-scene.x + event.clientX) * (1 / zoom),
            y: (-scene.y + event.clientY) * (1 / zoom)
        };

        zoom += -event.deltaY * 0.0001;

        scene.scale.x = zoom;
        scene.scale.y = zoom;

        let mousePos2 = {
            x: (-scene.x + event.clientX) * (1 / zoom),
            y: (-scene.y + event.clientY) * (1 / zoom)
        };
        var move = {
            x: mousePos2.x - mousePos1.x,
            y: mousePos2.y - mousePos1.y
        };

        scene.x += move.x * zoom;
        scene.y += move.y * zoom;
        let newViewPort = {x: scene.x, y: scene.y, width: window.innerWidth, height: window.innerHeight};
        onViewportChange(oldViewport, newViewPort);
    });
    window.addEventListener("mousemove", function (event) {
        if (event.which === 1) {
            moveTo.x += event.movementX;
            moveTo.y += event.movementY;
        }
    });
});
