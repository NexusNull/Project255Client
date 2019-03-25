/**
 * Created by Nexus on 14.08.2017.
 */
const JobEnum = require("../Enum/JobEnum");
const Job = require("../Jobs/Job");
const Entity = require("./Entity");
const TileEnum = require("../World/TileEnum");

/**
 * Creates a unit
 * @param owner
 * @param maxHealth
 * @param maxPower
 * @param allowedJobs
 * @param inventorySize
 * @constructor Unit
 */
var Unit = function (owner, maxHealth, maxPower, inventorySize, allowedJobs) {
    Entity.apply(this, [owner, maxHealth, maxPower, inventorySize]);

    /**
     * @typedef {Array<Job>} jobQueue
     */
    this.jobQueue = [];
    this.jobLog = [];
    this.allowedJobs = [JobEnum.Type.NONE];
    this.allowedJobs.concat(allowedJobs);
    this.direction = 0;
};

Unit.prototype = Entity.prototype;
Unit.prototype.constructor = Unit;

/**
 *
 * @param jobType {number} - the job type
 * @param jobOptions {object} - may be different for every job, contains information about the job
 */
Unit.prototype.queueJob = function(jobType, jobOptions){
    var job = {
        entityId: this.id,
        type: jobType,
        options: jobOptions
    }
    if(game.serverConnection)
        game.serverConnection.send("gameQueueJobs",[job]);
};


Unit.prototype.stopJob = function () {


};

Unit.accessible = function (unit) {
    let data = Entity.accessible(unit);
    data.type = "unit";
    data.unitType = this.unitType;
    data.jobQueue = unit.jobQueue;
    return data;
};

Unit.prototype.accessible = function () {
    return Unit.accessible(this);
};
module.exports = Unit;