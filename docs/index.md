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

