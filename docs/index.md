## Classes

<dl>
<dt><a href="#Semaphore">Semaphore</a></dt>
<dd><p>Creates an instance of the Semaphore class</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#wait">wait(stop, arg, delay)</a> ⇒ <code>Promise</code></dt>
<dd><p>Wraps the waitCallback function into a Promise.</p>
</dd>
<dt><a href="#waitCallback">waitCallback(stop, cb, arg, delay)</a></dt>
<dd><p>Uses the timeout function to create a pause in a function without stopping
the event loop.  The default without any parameters is a 1 second pause.
When the timeout ends a callback is executed and it receives the <em>arg</em>
parameter to be used in the callback.</p>
</dd>
</dl>

<a name="Semaphore"></a>

## Semaphore
Creates an instance of the Semaphore class

**Kind**: global class  

* [Semaphore](#Semaphore)
    * [new Semaphore(timeout, ticks)](#new_Semaphore_new)
    * [.decrement()](#Semaphore+decrement) ⇒
    * [.increment()](#Semaphore+increment) ⇒
    * [.reset()](#Semaphore+reset)
    * [.wait(cb, arg, self)](#Semaphore+wait)
    * [.toString()](#Semaphore+toString) ⇒

<a name="new_Semaphore_new"></a>

### new Semaphore(timeout, ticks)
This creates a simple semaphore counter instance.  Each async function
will increment the semaphore as they are created.  As they finish their
operation within the same process will decrement it.  When the wait is
started it will look at the counter to see if there are processes still
waiting to finish (counter > 0).  It will then perform a delay loop
and check for semaphore completion (count === 0)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| timeout | <code>number</code> |  | the number of seconds that this semaphore will check for completion.  If the semaphore has not completed at the end of this delay an Error will be thrown for timeout. |
| ticks | <code>number</code> | <code>200</code> | the number of times the semaphore will be checked. the delay is divided by this number to determine how often the semaphore will be checked within the delay. |

<a name="Semaphore+decrement"></a>

### semaphore.decrement() ⇒
Decrements the internal value of the counter

**Kind**: instance method of <code>[Semaphore](#Semaphore)</code>  
**Returns**: the current value of the counter.  
<a name="Semaphore+increment"></a>

### semaphore.increment() ⇒
Increments the internal value of the counter

**Kind**: instance method of <code>[Semaphore](#Semaphore)</code>  
**Returns**: the current value of the counter.  
<a name="Semaphore+reset"></a>

### semaphore.reset()
Resets the internal state of the semaphore class.  Generally
used once a semaphore is done and one wants to use it again

**Kind**: instance method of <code>[Semaphore](#Semaphore)</code>  
<a name="Semaphore+wait"></a>

### semaphore.wait(cb, arg, self)
Activated at some point in a process when one wants to wait for all
semaphores to complete processing.

**Kind**: instance method of <code>[Semaphore](#Semaphore)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| cb | <code>function</code> |  | a callback function that is executed when the semaphore is complete. |
| arg | <code>Object</code> | <code></code> | an argument that can be passed to the callback |
| self | <code>[Semaphore](#Semaphore)</code> |  | a reference to the Semaphore instance |

<a name="Semaphore+toString"></a>

### semaphore.toString() ⇒
**Kind**: instance method of <code>[Semaphore](#Semaphore)</code>  
**Returns**: a string representation of the semaphore instance  
<a name="wait"></a>

## wait(stop, arg, delay) ⇒ <code>Promise</code>
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
parameter to be used in the callback.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| stop | <code>number</code> | <code>1</code> | the number of delay iterations.  This is would be in seconds if delay is 1000 millis. |
| cb | <code>function</code> | <code></code> | a callback function that is executed when the timeout is complete. |
| arg | <code>Object</code> | <code></code> | an object that should be returned by the callback when the wait is complete. |
| delay | <code>number</code> | <code>1000</code> | the number of millis to pause per stop. |

