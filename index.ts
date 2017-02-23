/**
 * Wraps the waitCallback function into a Promise.
 * @param stop {number} the number of delay iterations.  This is would be in
 * seconds if delay is 1000 millis.
 * @param arg {Object} an object that should be returned by the callback when
 * the wait is complete.
 * @param delay {number} the number of millis to pause per stop.
 * @returns {Promise} a Javascript promise object
 */
export function wait(stop: number = 1, arg: any = null, delay: number = 1000) {
	return new Promise((resolve) => {
		waitCallback(stop, (ret: any) => {
			resolve(ret);
		}, arg,  delay);
	});
}

/**
 * Uses the timeout function to create a pause in a function without stopping
 * the event loop.  The default without any parameters is a 1 second pause.
 * When the timeout ends a callback is executed and it receives the *arg*
 * parameter to be used in the callback.
 * @param stop {number} the number of delay iterations.  This is would be in
 * seconds if delay is 1000 millis.
 * @param cb {Function} a callback function that is executed when the timeout
 * is complete.
 * @param arg {Object} an object that should be returned by the callback when
 * the wait is complete.
 * @param delay {number} the number of millis to pause per stop.
 */
export function waitCallback(stop: number = 1, cb: Function = null, arg: any = null, delay: number = 1000): void {
	function done() {
		if (cb) {
			cb(arg);
		}
	}

	setTimeout(done, stop * delay);
}
