# util.wait [![Build Status](https://travis-ci.org/jmquigley/util.wait.svg?branch=master)](https://travis-ci.org/jmquigley/util.wait) [![tslint code style](https://img.shields.io/badge/code_style-TSlint-5ed9c7.svg)](https://palantir.github.io/tslint/) [![NPM](https://img.shields.io/npm/v/util.wait.svg)](https://www.npmjs.com/package/util.wait) [![Coverage Status](https://coveralls.io/repos/github/jmquigley/util.wait/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.wait?branch=master)

> Javascript pause/wait functions

This library contains two functions:

- `wait` - JavaScript function that returns a Promise and can be used in a thenable chain to delay for N iterations of S seconds.
- `waitCallback` - JavaScript function that uses a callback after N iterations of S seconds.

These two functions are used to create a delay in processing without stopping the event loop.  It does this by using a recursive [Timeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) call.  The functions rely on the processing of a *Promise* or a *callback* to do this.

## Installation

To install as a global package:
```
$ npm install --global util.wait
```

To install as an application dependency:
```
$ npm install --save util.wait
```


## Usage

```javascript
const wait = require('util.wait').wait;

wait(3)
	.then((duration: number) => {
		// continuation after 3 second wait
		// the duration is the number of millis consumed
	})
	.catch((err: string) => {
		console.error(err);
	});
```

This version calls `wait` with a Promise object returned that can be chained together using *then* (thenable).  The use case for this is within test cases that use other promises where a delay is beneficial to wait some amount of time for async operations to finish in the test.

```javascript
waitCallback(3, (duration: number) => {
	// continuation after 3 second wait
	// the duration is the number of millis consumed.
});
```

This version relies on a callback function.  At the end of 3 seconds it is called to complete the wait.
