'use strict';

function EventEmitter(thisOnEmit) {
  this._thisOnEmit = thisOnEmit || this;
}

EventEmitter.prototype.addEventListener = function(event, fn) {
  var eventMap = this.__events = this.__events || {};
  var handlerList = eventMap[event] = eventMap[event] || [];
  handlerList.push(fn);
};

EventEmitter.prototype.removeEventListener = function(event, fn) {
  var eventMap = this.__events = this.__events || {};
  var handlerList = eventMap[event];
  if (handlerList) {
    var index = handlerList.indexOf(fn);
    if (index >= 0) {
      handlerList.splice(index, 1);
    }
  }
};

EventEmitter.prototype.emit = function(event, arg1, arg2, arg3, arg4, arg5) {
  var eventMap = this.__events = this.__events || {};
  var handlerList = eventMap[event];
  if (handlerList) {
    for (var i = 0; i < handlerList.length; i++) {
      var fn = handlerList[i];
      fn.call(this._thisOnEmit, arg1, arg2, arg3, arg4, arg5);
    }
  }
};

module.exports = EventEmitter;