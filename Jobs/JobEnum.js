/**
 * Created by Nexus on 13.08.2017.
 */

var JobEnum = {
    Type: {
        NONE:0,
        TURN:1,
        MOVE:2,
        SCAN:3,
        BUILD:4,
        CRAFT:5,
        PICK:6,
        PLACE:7,
        ATTACK:8,
        MINE:9,
    },
    Name: {
        0:"None",
        1:"Turn",
        2:"Move",
        3:"Scan",
        4:"Build",
        5:"Craft",
        6:"Pick",
        7:"Place",
        8:"Attack",
        9:"MINE"
    },
    verb: {
        0:"nothing",
        1:"turning",
        2:"moving",
        3:"scanning",
        4:"building",
        5:"crafting",
        6:"picking",
        7:"placing",
        8:"attacking",
        9:"mining"
    }
};

module.exports = Object.freeze(JobEnum);