# util.wait [![Build Status](https://travis-ci.org/jmquigley/util.wait.svg?branch=master)](https://travis-ci.org/jmquigley/util.wait) [![tslint code style](https://img.shields.io/badge/code_style-TSlint-5ed9c7.svg)](https://palantir.github.io/tslint/) [![NPM](https://img.shields.io/npm/v/util.wait.svg)](https://www.npmjs.com/package/util.wait) [![Coverage Status](https://coveralls.io/repos/github/jmquigley/util.wait/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.wait?branch=master)

> Javascript pause/wait functions

This [library](docs/index.md) contains two functions and a class:

- [wait](docs/index.md#wait) - JavaScript function that returns a Promise and can be used in a thenable chain to delay for N iterations of S seconds.
- [waitCallback](docs/index.md#waitCallback) - JavaScript function that uses a callback after N iterations of S seconds.
- [Semaphore](docs/index.md#Semaphore) - A simple JavaScript semaphore counter object.

These two functions are used to create a delay in processing without stopping the event loop.  It does this by using a wrapped [Timeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) call.  The functions rely on the processing of a *Promise* or a *callback* to do this.

The class implements a simple [semaphore counter](https://en.wikipedia.org/wiki/Asynchronous_semaphore).  An instance of `Semaphore` is created.  Before the wait is called the semaphore is incremented and decremented.  While the semaphore counter is > 0 a wait state will occur.  During processing the semaphore is decremented as a process that uses it is finishd with it.  When the counter is < 0 then the wait state will end.

## Installation

To install as a global package:
```
$ npm install --global util.wait
```

To install as an application dependency:
```
$ npm install --save util.wait
```

To build the app and run all tests:
```
$ npm run all
```


## Usage

```javascript
waitCallback(3, (val: any) => {
	// continuation after 3 second wait.  The val is passed to the callback
	// after time has expired.  In this example the string 'stuff' is 
	// passed.
}, 'stuff');
```

This wait function will pause for N sections and use a callback function on completion.  The example shows that at the end of 3 seconds it is called to complete the wait.

```javascript
const wait = require('util.wait').wait;

wait(3, 'something')
	.then((val: any) => {
		// continuation after 3 second wait the val is the value passed
		// to then after time has expired.  In this example it would 
		// pass the string 'something'
	})
	.catch((err: string) => {
		console.error(err);
	});
```

This version calls `wait` with a Promise object returned that can be chained together using *then* (thenable).  This is just a wrapper on around the first function to make it thenable.  The use case for this is within test cases that use other promises where a delay is beneficial to wait some amount of time for async operations to finish in the test (such as testing a timed interval and its results).

```javascript
let semaphore = new Semaphore(10);

function f1() {
	console.log(`Starting F1: ${new Date()}`);
	semaphore.increment();
	assert(semaphore.counter === 1);
	// Arbitrary delay to show that the semaphore is waiting
	waitCallback(2, () => {
		semaphore.decrement();
		console.log(`Done with f1 (2 seconds): ${new Date()}`);
	});
}

function f2() {
	console.log(`Starting F2: ${new Date()}`);
	semaphore.increment();
	assert(semaphore.counter === 2);
	// Arbitrary delay to show that the semaphore is waiting
	waitCallback(5, () => {
		semaphore.decrement();
		console.log(`Done with f2 (5 seconds): ${new Date()}`);
	});
}

f1();
f2();

semaphore.wait(() => {
	assert(semaphore.counter === 0);
	console.log(`Finished: ${semaphore.toString()}`);
});
```

This example creates a semaphore with a 10 second timeout.  It has two functions `f1` and `f2`.  Both functions run for an arbitrary amount of time in a delay loop.  They increment and decrement the semaphore.  After the two functions are started the semaphore starts its `wait()` state.  When the delay functions within `f1` and `f2` complete they each decrement the semaphore.  When the semaphore counter reaches 0 it will execute the semaphore callback.
