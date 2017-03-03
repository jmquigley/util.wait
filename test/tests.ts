'use strict';

import * as assert from 'assert';
import {Semaphore, wait, waitCallback} from '../index';
import {debug} from './helpers';

describe('Testing util.wait', () => {
	it('Test the wait promise function (3 seconds)', async () => {
		debug(`Starting promise wait: ${new Date()}`);
		await wait(3, 'stuff')
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

	it('Test the semaphore class (5 seconds)', (cb) => {
		let semaphore = new Semaphore(10);

		function f1() {
			debug(`Starting F1: ${new Date()}`);
			semaphore.increment();
			assert(semaphore.counter === 1);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(2, () => {
				semaphore.decrement();
				debug(`Done with f1 (2 seconds): ${new Date()}`);
			});
		}

		function f2() {
			debug(`Starting F2: ${new Date()}`);
			semaphore.increment();
			assert(semaphore.counter === 2);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(5, () => {
				semaphore.decrement();
				debug(`Done with f2 (5 seconds): ${new Date()}`);
			});
		}

		f1();
		f2();

		semaphore.wait(() => {
			assert(semaphore.counter === 0);
			debug(`Finished: ${semaphore.toString()}`);
			return cb();
		});
	});

	it('Test semaphore timeout error', (cb) => {
		let timeout: number = 2;
		let semaphore = new Semaphore(timeout);

		function fn() {
			debug(`Starting fn: ${new Date()}`);
			semaphore.increment();
			assert(semaphore.counter === 1);
			waitCallback(5, () => {
				assert(false, 'Timeout error should have occurred');
			});
		}

		fn();

		semaphore.wait((err: Error, arg: any) => {
			if (err) {
				assert.equal(arg, 'stuff');
				assert.equal(err.message, `Semaphore timeout after ${timeout * 1000}`);
				return cb();
			}

			assert(false, 'Timeout error should have occurred');
		}, 'stuff');
	});
});
