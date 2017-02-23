/**
 * Wraps the waitCallback function into a promise.
 * @param stop {number} the number of delay iterations.  This is would be in
 * seconds if delay is 1.
 * @param delay {number} the number of millis to pause per stop.
 * @returns {Promise} a Javascript promise object
 */
export function wait(stop: number = 1, delay: number = 1000) {
	return new Promise((resolve) => {
		waitCallback(stop, (duration: number) => {
			resolve(duration);
		}, delay);
	});
}

/**
 * Uses the timeout function to create a pause in a function without stopping
 * the event loop.  The default without any parameters is a 1 second pause.
 * @param stop {number} the number of delay iterations.  This is would be in
 * seconds if delay is 1.
 * @param cb {Function} a callback function that is execute when the pause loop
 * is complete.
 * @param delay {number} the number of millis to pause per stop.
 */
export function waitCallback(stop: number = 1, cb: Function = null, delay: number = 1000): void {
	let n: number = 0;
	function run() {
		if (n++ === stop) {
			if (cb) cb(stop * delay);
		} else {
			setTimeout(run, delay);
		}
	}

	run();
}
