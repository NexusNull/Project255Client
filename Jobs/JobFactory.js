/**
 * Created by Nexus on 15.08.2017.
 */
var JobEnum = require("./JobEnum");
var Job = require("./Job");

var JobFactory = function(){

};

JobFactory.prototype.createNoneJob = function(){
    return new Job(JobEnum.Type.NONE,0,);
};