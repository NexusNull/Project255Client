/**
 * Created by Nexus on 14.08.2017.
 */
const JobEnum = require("../Jobs/JobEnum");
const Job = require("../Jobs/Job");
const Entity = require("./Entity");
const TileEnum = require("../World/TileEnum");

/**
 * Creates a unit
 * @param owner
 * @param health
 * @param maxHealth
 * @param power
 * @param maxPower
 * @param allowedJobs
 * @param currentJob
 * @param lastJob
 * @constructor
 */
var Unit = function (owner, health, maxHealth, power, maxPower, allowedJobs, currentJob, lastJob) {
    Entity.apply(this, [owner, health, maxHealth, power, maxPower]);

    this.allowedJobs = [JobEnum.Type.NONE];
    this.currentJob = currentJob;
    this.lastJob = lastJob;
    this.allowedJobs.concat(allowedJobs);
    this.direction = 0;

};

Unit.prototype = Entity.prototype;
Unit.prototype.constructor = Unit;

Unit.prototype.doJob = function () {
    var job = this.currentJob;
    //Job in Progress
    if (job.type !== JobEnum.Type.NONE) {
        //Finish job
        if (job.busyFor === 1) {
            switch (job.type) {
                case JobEnum.Type.ATTACK:

                    break;
                case JobEnum.Type.BUILD:

                    break;
                case JobEnum.Type.CRAFT:

                    break;
                case JobEnum.Type.MOVE:
                    let currentTile = this.world.getTileAt(this.x, this.y);
                    let targetPos;
                    switch (this.direction) {
                        case 0:
                            targetPos = {x: this.x + 1, y: this.y};
                            break;
                        case 1:
                            targetPos = {x: this.x, y: this.y + 1};
                            break;
                        case 2:
                            targetPos = {x: this.x - 1, y: this.y};
                            break;
                        default:
                            targetPos = {x: this.x, y: this.y - 1};
                            break;
                    }
                    let targetTile = this.world.getTileAt(targetPos.x, targetPos.y);
                    if (targetTile)
                        if (targetTile.occupant === null && targetTile.type === TileEnum.Type.LOWGROUND) {
                            this.x = targetPos.x;
                            this.y = targetPos.y;
                            targetTile.occupant = this;
                            currentTile.occupant = null;
                        }
                    break;
                case JobEnum.Type.PICK:

                    break;
                case JobEnum.Type.PLACE:

                    break;
                case JobEnum.Type.SCAN:

                    break;
                case JobEnum.Type.TURN:
                    let direction = job.options.direction;
                    if (direction >= 0 && direction <= 3) {
                        this.direction = direction;
                    }
                    break;
                case JobEnum.Type.MINE:

                    break;
            }

            this.currentJob.type = JobEnum.Type.NONE;
            this.currentJob.options = {};
        }
        job.busyFor--;
    }
};


Unit.prototype.stopJob = function () {


};

Unit.prototype.process = function () {
    if (this.currentJob.type === JobEnum.Type.NONE) {
        let targetPos;
        switch (this.direction) {
            case 0:
                targetPos = {x: this.x + 1, y: this.y};
                break;
            case 1:
                targetPos = {x: this.x, y: this.y + 1};
                break;
            case 2:
                targetPos = {x: this.x - 1, y: this.y};
                break;
            default:
                targetPos = {x: this.x, y: this.y - 1};
                break;
        }
        let targetTile = this.world.getTileAt(targetPos.x, targetPos.y);

        if (targetTile && targetTile.occupant === null && targetTile.type === TileEnum.Type.LOWGROUND) {
            this.currentJob = new Job(JobEnum.Type.MOVE);
        } else {
            this.currentJob = new Job(JobEnum.Type.TURN, 1, {direction: (Math.floor(Math.random() * 4))})
        }
    }
    this.doJob();
};

Unit.prototype.setJob = function (jobType) {
    if (this.allowedJobs.indexOf(jobType) !== -1) {

    } else {
        throw new Error("Can't execute this Job");
    }
};

module.exports = Unit;