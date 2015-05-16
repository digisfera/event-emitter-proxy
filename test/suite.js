'use strict';

suite('event-emitter-proxy', function() {

  var assert = require('chai').assert;
  var EventEmitter = require('../src/EventEmitter');
  var EventEmitterProxy = require('../src/EventEmitterProxy');
  
  var emitter = null;
  var emitter2 = null;

  beforeEach(function() {
    emitter = new EventEmitter();
    emitter2 = new EventEmitter();
  });

  test('object()', function() {
    var proxy = new EventEmitterProxy(emitter);
    assert.equal(proxy.object(), emitter);
  });

  test('addEventListener()', function(done) {
    var proxy = new EventEmitterProxy(emitter);
    proxy.addEventListener('foo', function(res1, res2) {
      assert.equal(res1, 'bar');
      assert.equal(res2, 'baz');
      done();
    });

    emitter.emit('foo', 'bar', 'baz');
  });

  test('removeEventListener()', function(done) {
    var proxy = new EventEmitterProxy(emitter);

    var handler = done.bind(null, "Error: got event");

    proxy.addEventListener('foo', handler);
    proxy.removeEventListener('foo', handler);

    emitter.emit('foo', 'bar', 'baz');

    setTimeout(done.bind(null, null), 0);
  });

  test('setObject() after addEventListener() - old emitter events', function(done) {
    var proxy = new EventEmitterProxy(emitter);

    var handler = done.bind(null, "Error: got event");

    proxy.addEventListener('foo', handler);
    proxy.setObject(emitter2);

    emitter.emit('foo', 'bar', 'baz');

    setTimeout(done.bind(null, null), 0);
  });

  test('setObject() after addEventListener() - new emitter events', function(done) {
    var proxy = new EventEmitterProxy(emitter);
    proxy.addEventListener('foo', function(res1, res2) {
      assert.equal(res1, 'bar');
      assert.equal(res2, 'baz');
      done();
    });

    proxy.setObject(emitter2);

    emitter2.emit('foo', 'bar', 'baz');
  });

  test('setObject() after removeEventListener()', function(done) {
    var proxy = new EventEmitterProxy(emitter);

    var handler = done.bind(null, "Error: got event");

    proxy.addEventListener('foo', handler);
    proxy.removeEventListener('foo', handler);
    proxy.setObject(emitter2);

    emitter2.emit('foo', 'bar', 'baz');
    emitter.emit('foo', 'bar', 'baz');

    setTimeout(done.bind(null, null), 0);
  });

  test('setObject() after single removeEventListener() and multiple addEventListener()', function(done) {

    var proxy = new EventEmitterProxy(emitter);

    var handler = done.bind(null, "Error: got event");

    proxy.addEventListener('foo', handler);
    proxy.addEventListener('other', done.bind(null, null));
    proxy.addEventListener('foo', handler);
    proxy.removeEventListener('foo', handler);
    proxy.setObject(emitter2);

    // This event should not be  caught
    emitter2.emit('foo');

    // This one should
    emitter2.emit('other');
  });


  test('setObject() to null', function(done) {
    var proxy = new EventEmitterProxy(emitter);

    var handler = done.bind(null, "Error: got event");

    proxy.addEventListener('foo', handler);
    proxy.setObject(null);

    emitter.emit('foo', 'bar', 'baz');

    setTimeout(done.bind(null, null), 0);
  });


  test('destroy');

  suite('addEventListenerProxy()', function() {
    test('emit event when object changes', function(done) {
      var proxy = new EventEmitterProxy(emitter);

      proxy.addEventListenerProxy('objectChange', done.bind(null, null));

      proxy.setObject(emitter2);
    });

    test('`this` on the handler should be the EventEmitterProxy instance', function(done) {
      var proxy = new EventEmitterProxy(emitter);

      proxy.addEventListenerProxy('objectChange', function() {
        assert.equal(this, proxy);
        done();
      });

      proxy.setObject(emitter2);
    });

    test('removeEventListenerProxy()', function(done) {
      var proxy = new EventEmitterProxy(emitter);

      var handler = done.bind(null, "Error: got event");
      proxy.addEventListenerProxy('objectChange', handler);
      proxy.removeEventListenerProxy('objectChange', handler);

      proxy.setObject(emitter2);

      setTimeout(done.bind(null, null), 0);
    });

  });

  suite('without object', function() {
    test('setObject() after addEventListener() without object', function(done) {
      var proxy = new EventEmitterProxy();
      proxy.addEventListener('foo', function(res1, res2) {
        assert.equal(res1, 'bar');
        assert.equal(res2, 'baz');
        done();
      });

      proxy.setObject(emitter);

      emitter.emit('foo', 'bar', 'baz');
    });

    test('removeEventListener() without object', function(done) {
      var proxy = new EventEmitterProxy();

      var handler = done.bind(null, "Error: got event");

      proxy.addEventListener('foo', handler);
      proxy.removeEventListener('foo', handler);
      proxy.setObject(emitter);

      emitter.emit('foo', 'bar', 'baz');

      setTimeout(done.bind(null, null), 0);
    });
  });
});