A proxy for EventEmitter objects. The proxied object may be swapped by another object, at which point the event handlers will be removed from the old object and added to the new one.

Originally implemented for video controls with multiple resolutions, so that the underlying Video element could be easily swapped by one with a different resolution.


## Object requirements

The proxied object must implement an `addEventListener()` and `removeEventListener()` method.


## API

### new EventEmitterProxy([object])

### proxy.setObject(object)

`object` may be `null`

### proxy.object()

### proxy.addEventListener()

Calls `object.addEventListener()` with the same arguments. If `setObject()` is called, `removeEventListener()` will be called with the same arguments.


### proxy.removeEventListener()

### proxy.destroy()

Calls `removeEventListener()` for all events and sets `object` to `null`.


### addEventListenerProxy

The proxy itself is an event emitter. It emits the event `objectChange`.