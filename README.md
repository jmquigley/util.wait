# util.wait

> Javascript pause/wait functions

[![Build Status](https://travis-ci.org/jmquigley/util.wait.svg?branch=master)](https://travis-ci.org/jmquigley/util.wait)
[![tslint code style](https://img.shields.io/badge/code_style-TSlint-5ed9c7.svg)](https://palantir.github.io/tslint/)
[![Test Runner](https://img.shields.io/badge/testing-jest-blue.svg)](https://facebook.github.io/jest/)
[![NPM](https://img.shields.io/npm/v/util.wait.svg)](https://www.npmjs.com/package/util.wait)
[![Coverage Status](https://coveralls.io/repos/github/jmquigley/util.wait/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.wait?branch=master)

This [library](docs/index.md) contains three functions and a class:

- [wait](docs/index.md#wait) - Performs a blocked wait (like sleep) and doesn't return until the wait is over.  Calls the given callback at the end of the wait period.
- [waitPromise](docs/index.md#waitPromise) - JavaScript function that returns a Promise and can be used in a thenable chain to delay for N iterations of S seconds.  This is an async function.  The delay returns via a thenable when complete.
- [waitCallback](docs/index.md#waitCallback) - JavaScript function that uses a callback after N iterations of S seconds.  This is an async function.  The delay returns via callback when complete.
- [Semaphore](docs/index.md#Semaphore) - A simple JavaScript semaphore counter object.  Creates a completion barrier with a counter.



The promise and callback functions are used to create a delay in processing without stopping the event loop.  It does this by using a wrapped [Timeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) call.  The functions rely on the processing of a *Promise* or a *callback* to do this.  The wait function is similar to sleep and will block.

The class implements a simple [semaphore counter](https://en.wikipedia.org/wiki/Asynchronous_semaphore).  An instance of `Semaphore` is created.  Before the `wait()` promise is called the semaphore is incremented and/or decremented.  While the semaphore counter is `> 0` a wait state will occur.  During processing the semaphore is decremented as a process that uses the semaphore is finishd with it.  When the counter is `<= 0` then the `wait()` state will end and the semaphore promise will be resolved.

## Installation

This module uses [yarn](https://yarnpkg.com/en/) to manage dependencies and run scripts for development.

To install as an application dependency:
```
$ yarn add --dev util.wait
```

To build the app and run all tests:
```
$ yarn run all
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
const waitPromise = require('util.wait').waitPromise;

waitPromise(3, 'something')
	.then((val: any) => {
		// continuation after 3 second wait the val is the value passed
		// to then after time has expired.  In this example it would
		// pass the string 'something'
	})
	.catch((err: string) => {
		console.error(err);
	});
```

This version calls `waitPromise` with a Promise object returned that can be chained together using *then* (thenable).  This is just a wrapper on around the `waitCallback` function to make it thenable.  The use case for this is within test cases that use other promises where a delay is beneficial to wait some amount of time for async operations to finish in the test (such as testing a timed interval and its results).

```javascript
const Semaphore = require('util.wait').Semaphore;

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

semaphore.wait()
	.then(() => {
		assert(semaphore.counter === 0);
		debug(`Finished: ${semaphore.toString()}`);
	})
	.catch((err: string) => {
		assert(false, err);
	});
```

This example creates a semaphore with a 10 second timeout.  It has two functions `f1` and `f2`.  Both functions run for an arbitrary amount of time in a delay loop.  They increment and decrement the semaphore.  After the two functions are started the semaphore starts its `wait()` state promise.  When the delay functions within `f1` and `f2` complete they each decrement the semaphore.  When the semaphore counter reaches 0 the promise will be resolved.  If the timeout occurs, then the catch within the promise will reject with an error.
