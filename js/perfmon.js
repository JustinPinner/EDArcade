// js/perfmon.js
var Monitor = function(name) {
	this.measure = name,
	this.ticks = 0,
	this.elapsedTime = 0,
	this.startTime = 0,
	this.endTime = 0
	this.start = function() {
		this.startTime = Date.now();
	}
	this.tick = function() {
		this.ticks += 1;
	}
	this.stop = function() {
		this.endTime = Date.now();
		this.elapsedTime += this.endTime - this.startTime;
		this.startTime = 0;
		this.endTime = 0;
	}
}

var perfMonitors = [];

function getPerfMonitor(name) {
  for (var i = 0; i < perfMonitors.length; i++) {
    if (perfMonitors[i].measure == name) {
      return perfMonitors[i];
    }   
  }
  var mon = new Monitor(name);
  perfMonitors.push(mon); 
  return getPerfMonitor(name);
}

// example;
//function refresh() {
//  var monitor = getPerfMonitor('game.refresh');
//  monitor.start();
//  monitor.tick();
//  .
//  do function stuff
//  .
//  monitor.stop();
//}
