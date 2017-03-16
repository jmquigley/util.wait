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

/** Creates an instance of the Semaphore class */
export class Semaphore {

	private _counter: number = 0;
	private _delay: number = 0;
	private _duration: number = 0;
	private _errorState: boolean = false;
	private _tick: number = 0;
	private _ticks: number = 200;

	/**
	 * This creates a simple semaphore counter instance.  Each async function
	 * will increment the semaphore as they are created.  As they finish their
	 * operation within the same process will decrement it.  When the wait() is
	 * started it will look at the counter to see if there are processes still
	 * waiting to finish (counter > 0).  It will then perform a delay loop
	 * and check for semaphore completion (count === 0).  It will continue this
	 * check until the counter reaches 0 or the timeout occurs.
	 *
	 * @param timeout {number} the number of seconds that this semaphore will
	 * check for completion.  If the semaphore has not completed at the end of
	 * this delay an Error will returned to the wait callback.
	 * @param [initial] {boolean} if true, then the semaphore is initially
	 * incremented, otherwise it is zero.  The default is false.
	 * @param ticks {number} the number of times the semaphore will be checked.
	 * the timeout is divided by this number to determine how often the
	 * semaphore will be checked during the timeout.  This will prevent blowing
	 * up the call stack.
	 * @constructor
	 */
	constructor(timeout: number, initial: boolean = false, ticks: number = 200) {
		this._delay = timeout * 1000;  // convert timeout seconds to millis
		this._ticks = ticks;
		this._tick = this._delay / this._ticks;
		this.reset();

		if (initial) {
			this.increment();
		}
	}

	/**
	 * Decrements the internal value of the semaphore counter
	 * @returns the current value of the counter.
	 */
	public decrement(): number {
		this._counter--;
		return this._counter;
	}

	/**
	 * Increments the internal value of the semaphore counter
	 * @returns the current value of the counter.
	 */
	public increment(): number {
		this._counter++;
		return this._counter;
	}

	/**
	 * Resets the internal state of the semaphore instance.  Generally used
	 * once a semaphore is complete and needs to be reused.
	 */
	public reset(): Semaphore {
		this._duration = 0;
		this._counter = 0;
		this._errorState = false;
		return this;
	}

	/**
	 * Activated at some point in a process when one wants to wait for all
	 * semaphores to complete processing.  This call does not block the event
	 * loop.  This uses a Promise object to make the call async.
	 * @param self {Semaphore} a reference to the Semaphore instance
	 * @returns a JavaScript promise object.
	 */
	public wait(self = this) {
		return new Promise((resolve, reject) => {
			function run() {
				if (self._duration < self._delay) {
					if (self._counter <= 0) {
						resolve(self);
					} else {
						waitCallback(1, () => {
							self._duration += self._tick;
							run();
						}, null, self._tick);
					}
				} else {
					self._errorState = true;
					reject(`Semaphore timeout after ${self._delay}`);
				}
			}

			run();
		});
	}

	/**
	 * Activated at some point in a process when one wants to wait for all
	 * semaphores to complete processing.  This uses a callback function to
	 * signal completion instead of a Promise.
	 * @param cb {Function} a callback function that is executed when the
	 * semaphore is complete.
	 * @param arg {Object} an argument that can be passed to the callback
	 * @param self {Semaphore} a reference to the Semaphore instance
	 */
	public waitCallback(cb: Function, arg: any = null, self = this) {
		function run() {
			if (self._duration < self._delay) {
				if (self._counter <= 0) {
					if (cb) {
						cb(null, arg);
					}
				} else {
					waitCallback(1, () => {
						self._duration += self._tick;
						run();
					}, null, self._tick);
				}
			} else {
				if (cb) {
					self._errorState = true;
					cb(new Error(`Semaphore timeout after ${self._delay}`), arg);
				}
			}
		}

		run();
	}

	/**
	 * @returns a string representation of the semaphore instance
	 */
	public toString(): string {
		let s: string = '';
		s += 'Semaphore {\n';
		s += `    counter: ${this.counter}\n`;
		s += `    timeout: ${this._delay} millis\n`;
		s += `   duration: ${this.duration} millis\n`;
		s += ` errorState: ${this.errorState}`;
		s += `      ticks: ${this._ticks}\n`;
		s += `       tick: ${this._tick} millis\n`;
		s += '}\n';

		return s;
	}

	get counter(): number {
		return this._counter;
	}

	get errorState(): boolean {
		return this._errorState;
	}

	get duration(): number {
		return this._duration;
	}
}
