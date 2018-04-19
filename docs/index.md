## Classes

<dl>
<dt><a href="#Semaphore">Semaphore</a></dt>
<dd><p>Creates an instance of the Semaphore class</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#wait">wait(stop, cb, arg, delay)</a></dt>
<dd><p>Performs a BLOCKING noisy spinwait when called.  It will stay in this
function until the wait period has ended.</p>
</dd>
<dt><a href="#waitPromise">waitPromise(stop, arg, delay)</a> ⇒ <code>Promise</code></dt>
<dd><p>Wraps the waitCallback function into a Promise.</p>
</dd>
<dt><a href="#waitCallback">waitCallback(stop, cb, arg, delay)</a></dt>
<dd><p>Uses the timeout function to create a pause in a function without stopping
the event loop.  The default without any parameters is a 1 second pause.
When the timeout ends a callback is executed and it receives the <em>arg</em>
parameter to be used in the callback.  This is an ansync function.</p>
</dd>
</dl>

<a name="Semaphore"></a>

## Semaphore
Creates an instance of the Semaphore class

**Kind**: global class  

* [Semaphore](#Semaphore)
    * [new Semaphore(timeout, [initial], ticks)](#new_Semaphore_new)
    * [.decrement()](#Semaphore+decrement) ⇒
    * [.increment()](#Semaphore+increment) ⇒
    * [.reset()](#Semaphore+reset)
    * [.wait(self)](#Semaphore+wait) ⇒
    * [.waitCallback(cb, arg, self)](#Semaphore+waitCallback)
    * [.toString()](#Semaphore+toString) ⇒

<a name="new_Semaphore_new"></a>

### new Semaphore(timeout, [initial], ticks)
This creates a simple semaphore counter instance.  Each async function
will increment the semaphore as they are created.  As they finish their
operation within the same process will decrement it.  When the wait() is
started it will look at the counter to see if there are processes still
waiting to finish (counter > 0).  It will then perform a delay loop
and check for semaphore completion (count === 0).  It will continue this
check until the counter reaches 0 or the timeout occurs.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| timeout | <code>number</code> |  | the number of seconds that this semaphore will check for completion.  If the semaphore has not completed at the end of this delay an Error will returned to the wait callback. |
| [initial] | <code>boolean</code> | <code>false</code> | if true, then the semaphore is initially incremented, otherwise it is zero.  The default is false. |
| ticks | <code>number</code> | <code>10</code> | the number of times the semaphore will be checked. the timeout is divided by this number to determine how often the semaphore will be checked during the timeout.  This will prevent blowing up the call stack. |

<a name="Semaphore+decrement"></a>

### semaphore.decrement() ⇒
Decrements the internal value of the semaphore counter

**Kind**: instance method of [<code>Semaphore</code>](#Semaphore)  
**Returns**: the current value of the counter.  
<a name="Semaphore+increment"></a>

### semaphore.increment() ⇒
Increments the internal value of the semaphore counter

**Kind**: instance method of [<code>Semaphore</code>](#Semaphore)  
**Returns**: the current value of the counter.  
<a name="Semaphore+reset"></a>

### semaphore.reset()
Resets the internal state of the semaphore instance.  Generally used
once a semaphore is complete and needs to be reused.

**Kind**: instance method of [<code>Semaphore</code>](#Semaphore)  
<a name="Semaphore+wait"></a>

### semaphore.wait(self) ⇒
Activated at some point in a process when one wants to wait for all
semaphores to complete processing.  This call does not block the event
loop.  This uses a Promise object to make the call async.

**Kind**: instance method of [<code>Semaphore</code>](#Semaphore)  
**Returns**: a JavaScript promise object.  

| Param | Type | Description |
| --- | --- | --- |
| self | [<code>Semaphore</code>](#Semaphore) | a reference to the Semaphore instance |

<a name="Semaphore+waitCallback"></a>

### semaphore.waitCallback(cb, arg, self)
Activated at some point in a process when one wants to wait for all
semaphores to complete processing.  This uses a callback function to
signal completion instead of a Promise.

**Kind**: instance method of [<code>Semaphore</code>](#Semaphore)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| cb | <code>function</code> |  | a callback function that is executed when the semaphore is complete. |
| arg | <code>Object</code> | <code></code> | an argument that can be passed to the callback |
| self | [<code>Semaphore</code>](#Semaphore) |  | a reference to the Semaphore instance |

<a name="Semaphore+toString"></a>

### semaphore.toString() ⇒
**Kind**: instance method of [<code>Semaphore</code>](#Semaphore)  
**Returns**: a string representation of the semaphore instance  
<a name="wait"></a>

## wait(stop, cb, arg, delay)
Performs a BLOCKING noisy spinwait when called.  It will stay in this
function until the wait period has ended.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| stop | <code>number</code> | <code>1</code> | the number of seconds in this delay |
| cb | <code>function</code> | <code></code> | the callback used when this wait is finished. |
| arg | <code>Object</code> | <code></code> | the argument passed to the callback |
| delay | <code>number</code> | <code>1000</code> | the number of millis in each delay.  Default is 1000 |

<a name="waitPromise"></a>

## waitPromise(stop, arg, delay) ⇒ <code>Promise</code>
Wraps the waitCallback function into a Promise.

**Kind**: global function  
**Returns**: <code>Promise</code> - a Javascript promise object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| stop | <code>number</code> | <code>1</code> | the number of delay iterations.  This is would be in seconds if delay is 1000 millis. |
| arg | <code>Object</code> | <code></code> | an object that should be returned by the callback when the wait is complete. |
| delay | <code>number</code> | <code>1000</code> | the number of millis to pause per stop. |

<a name="waitCallback"></a>

## waitCallback(stop, cb, arg, delay)
Uses the timeout function to create a pause in a function without stopping
the event loop.  The default without any parameters is a 1 second pause.
When the timeout ends a callback is executed and it receives the *arg*
parameter to be used in the callback.  This is an ansync function.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| stop | <code>number</code> | <code>1</code> | the number of delay iterations.  This is would be in seconds if delay is 1000 millis. |
| cb | <code>function</code> | <code></code> | a callback function that is executed when the timeout is complete. |
| arg | <code>Object</code> | <code></code> | an object that should be returned by the callback when the wait is complete. |
| delay | <code>number</code> | <code>1000</code> | the number of millis to pause per stop. |

