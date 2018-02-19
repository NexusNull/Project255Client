/**
 * Created by Nexus on 15.08.2017.
 */

const JobEnum = require("./JobEnum");

var Job = function (type, length, options) {

    this.type = (type)?type:JobEnum.Type.NONE;
    this.busyFor = (length)?length:1;
    this.options = (options)?options:{};
};

Job.prototype.do = function () {

};

Job.prototype.abort = function () {

};

Job.prototype.undo = function () {

};

module.exports = Job;