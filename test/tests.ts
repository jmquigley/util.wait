'use strict';

import * as assert from 'assert';
import * as path from 'path';
import {Semaphore, wait, waitCallback, waitPromise} from '../index';
import {debug} from './helpers';

describe(path.basename(__filename), () => {

	it('Test the wait function (3 seconds)', (done) => {
		debug(`Starting wait: ${new Date()}`);
		wait(3, (ret: string) => {
			assert.equal(ret, 'stuff');
			debug(`Finished wait(): ${new Date()}`);
			done();
		}, 'stuff');

		assert(false, `Shouldn't get here`);
		done();
	});

	it('Test the wait promise function (3 seconds)', async () => {
		debug(`Starting promise wait: ${new Date()}`);
		await waitPromise(3, 'stuff')
			.then((ret: any) => {
				assert.equal(ret, 'stuff');
				debug(`Finished promise wait: ${new Date()}`);
			})
			.catch((err: string) => {
				assert(false, err);
			});
	});

	it('Test the wait callback function (3 seconds)', (cb) => {
		debug(`Starting wait callback: ${new Date()}`);
		waitCallback(3, (ret: any) => {
			assert.equal(ret, 'stuff');
			assert(ret);
			debug(`Finished wait callback: ${new Date()}`);
			return cb();
		}, 'stuff');
	});

	it('Test the initial increment (2 seconds)', (cb) => {
		let semaphore = new Semaphore(10, true);

		function f1() {
			debug(`Starting F1: ${new Date()}`);
			assert(semaphore.counter === 1);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(2, () => {
				semaphore.decrement();
				assert(!semaphore.errorState);
				debug(`Done with f1 (2 seconds): ${new Date()}`);
			});
		}

		f1();

		semaphore.waitCallback((err: Error) => {
			if (err) {
				assert(false, 'This error should not occur');
				cb(err.message);
			}

			assert(semaphore.counter === 0);
			assert(!semaphore.errorState);
			debug(`Finished: ${semaphore.toString()}`);
			return cb();
		});
	});

	it('Test the semaphore class with callback (5 seconds)', (cb) => {
		let semaphore = new Semaphore(10);

		function f1() {
			debug(`Starting F1: ${new Date()}`);
			assert(semaphore.increment() === 1);
			assert(semaphore.counter === 1);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(2, () => {
				semaphore.decrement();
				assert(!semaphore.errorState);
				debug(`Done with f1 (2 seconds): ${new Date()}`);
			});
		}

		function f2() {
			debug(`Starting F2: ${new Date()}`);
			assert(semaphore.increment() === 2);
			assert(semaphore.counter === 2);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(5, () => {
				semaphore.decrement();
				assert(!semaphore.errorState);
				debug(`Done with f2 (5 seconds): ${new Date()}`);
			});
		}

		f1();
		f2();

		semaphore.waitCallback((err: Error) => {
			if (err) {
				assert(false, 'This error should not occur');
				cb(err.message);
			}

			assert(semaphore.counter === 0);
			assert(!semaphore.errorState);
			debug(`Finished: ${semaphore.toString()}`);
			return cb();
		});
	});

	it('Test semaphore timeout error with callback (2 seconds)', (cb) => {
		let timeout: number = 2;
		let semaphore = new Semaphore(timeout);

		function fn() {
			debug(`Starting fn: ${new Date()}`);
			assert(semaphore.increment() === 1);
			assert(semaphore.counter === 1);
			waitCallback(5, () => {
				assert(semaphore.errorState);
			});
		}

		fn();

		semaphore.waitCallback((err: Error) => {
			if (err) {
				debug('Caught semaphore wait error');
				assert.equal(err.message, `Semaphore timeout after ${timeout * 1000}`);
				assert(semaphore.errorState);
				return cb();
			}

			assert(false, 'Timeout error should have occurred');
			return cb();
		});
	});

	it('Test the semaphore class with Promise (5 seconds)', async () => {
		let semaphore = new Semaphore(10);

		function f1() {
			debug(`Starting F1: ${new Date()}`);
			assert(semaphore.increment() === 1);
			assert(semaphore.counter === 1);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(2, () => {
				semaphore.decrement();
				assert(!semaphore.errorState);
				debug(`Done with f1 (2 seconds): ${new Date()}`);
			});
		}

		function f2() {
			debug(`Starting F2: ${new Date()}`);
			assert(semaphore.increment() === 2);
			assert(semaphore.counter === 2);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(5, () => {
				semaphore.decrement();
				assert(!semaphore.errorState);
				debug(`Done with f2 (5 seconds): ${new Date()}`);
			});
		}

		f1();
		f2();

		await semaphore.wait()
			.then(() => {
				assert(semaphore.counter === 0);
				assert(!semaphore.errorState);
				debug(`Finished: ${semaphore.toString()}`);
			})
			.catch((err: string) => {
				assert(false, err);
			});
	});

	it('Test semaphore timeout error with Promise (2 seconds)', async () => {
		let timeout: number = 2;
		let semaphore = new Semaphore(timeout);

		function fn() {
			debug(`Starting fn: ${new Date()}`);
			assert(semaphore.increment() === 1);
			assert(semaphore.counter === 1);
			waitCallback(5, () => {
				assert(semaphore.errorState);
			});
		}

		fn();

		await semaphore.wait()
			.then(() => {
				assert(false, 'Timeout error should have occurred');
			})
			.catch((err: string) => {
				debug('Caught semaphore wait error');
				assert(semaphore.errorState);
				assert.equal(err, `Semaphore timeout after ${timeout * 1000}`);
			});
	});
});
