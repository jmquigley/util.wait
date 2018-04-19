'use strict';

import test from 'ava';
import {Semaphore, wait, waitCallback, waitPromise} from '../index';
import {debug} from './helpers';

test.cb('Test the wait function (3 seconds)', t => {
	debug(`Starting wait: ${new Date()}`);
	wait(3, (ret: string) => {
		t.is(ret, 'stuff');
		debug(`Finished wait(): ${new Date()}`);
		t.end();
	}, 'stuff');
});

test('Test the wait promise function (3 seconds)', async t => {
	debug(`Starting promise wait: ${new Date()}`);
	await waitPromise(3, 'stuff')
		.then((ret: any) => {
			t.is(ret, 'stuff');
			debug(`Finished promise wait: ${new Date()}`);
		})
		.catch((err: string) => {
			t.fail(err);
		});
});

test.cb('Test the wait callback function (3 seconds)', t => {
	debug(`Starting wait callback: ${new Date()}`);
	waitCallback(3, (ret: any) => {
		t.is(ret, 'stuff');
		debug(`Finished wait callback: ${new Date()}`);
		t.end();
	}, 'stuff');
});

test.cb('Test the initial increment (2 seconds)', t => {
	const semaphore = new Semaphore(10, true);

	(() => {
		debug(`Starting F1: ${new Date()}`);
		t.is(semaphore.counter, 1);
		// Arbitrary delay to show that the semaphore is waiting
		waitCallback(2, () => {
			semaphore.decrement();
			t.false(semaphore.errorState);
			debug(`Done with f1 (2 seconds): ${new Date()}`);
		});
	})();

	semaphore.waitCallback((err: Error) => {
		if (err) {
			t.fail('This error should not occur');
			return t.end();
		}

		t.is(semaphore.counter, 0);
		t.false(semaphore.errorState);
		debug(`Finished: ${semaphore.toString()}`);
		t.end();
	});
});

test.cb('Test the semaphore class with callback (5 seconds)', t => {
	const semaphore = new Semaphore(10);

	(() => {
		debug(`Starting F1: ${new Date()}`);
		t.is(semaphore.increment(), 1);
		t.is(semaphore.counter, 1);
		// Arbitrary delay to show that the semaphore is waiting
		waitCallback(2, () => {
			semaphore.decrement();
			t.false(semaphore.errorState);
			debug(`Done with f1 (2 seconds): ${new Date()}`);
		});
	})();

	(() => {
		debug(`Starting F2: ${new Date()}`);
		t.is(semaphore.increment(), 2);
		t.is(semaphore.counter, 2);
		// Arbitrary delay to show that the semaphore is waiting
		waitCallback(5, () => {
			semaphore.decrement();
			t.false(semaphore.errorState);
			debug(`Done with f2 (5 seconds): ${new Date()}`);
		});
	})();

	semaphore.waitCallback((err: Error) => {
		if (err) {
			t.fail('This error should not occur');
			return t.end();
		}

		t.is(semaphore.counter, 0);
		t.false(semaphore.errorState);
		debug(`Finished: ${semaphore.toString()}`);
		t.end();
	});
});

test.cb('Test semaphore timeout error with callback (2 seconds)', t => {
	const timeout: number = 2;
	const semaphore = new Semaphore(timeout);

	(() => {
		debug(`Starting fn: ${new Date()}`);
		t.is(semaphore.increment(), 1);
		t.is(semaphore.counter, 1);
		waitCallback(5, () => {
			t.true(semaphore.errorState);
		});
	})();

	semaphore.waitCallback((err: Error) => {
		if (err) {
			debug(`Caught semaphore wait error: ${semaphore.toString()}`);
			t.is(err.message, `Semaphore timeout after ${timeout * 1000}`);
			t.true(semaphore.errorState);
			return t.end();
		}
	});
});

test('Test the semaphore class with Promise (5 seconds)', async t => {
	const semaphore = new Semaphore(10);

	(() => {
		debug(`Starting F1: ${new Date()}`);
		t.is(semaphore.increment(), 1);
		t.is(semaphore.counter, 1);
		// Arbitrary delay to show that the semaphore is waiting
		waitCallback(2, () => {
			semaphore.decrement();
			t.false(semaphore.errorState);
			debug(`Done with f1 (2 seconds): ${new Date()}`);
		});
	})();

	(() => {
		debug(`Starting F2: ${new Date()}`);
		t.is(semaphore.increment(), 2);
		t.is(semaphore.counter, 2);
		// Arbitrary delay to show that the semaphore is waiting
		waitCallback(5, () => {
			semaphore.decrement();
			t.false(semaphore.errorState);
			debug(`Done with f2 (5 seconds): ${new Date()}`);
		});
	})();

	await semaphore.wait()
		.then(() => {
			t.is(semaphore.counter, 0);
			t.false(semaphore.errorState);
			debug(`Finished: ${semaphore.toString()}`);
		})
		.catch((err: string) => {
			t.fail(err);
		});
});

test('Test semaphore timeout error with Promise (2 seconds)', async t => {
	const timeout: number = 2;
	const semaphore = new Semaphore(timeout);

	(() => {
		debug(`Starting fn: ${new Date()}`);
		t.is(semaphore.increment(), 1);
		t.is(semaphore.counter, 1);
		waitCallback(5, () => {
			t.true(semaphore.errorState);
		});
	})();

	await semaphore.wait()
		.then(() => {
			t.fail('Timeout error should have occurred');
		})
		.catch((err: string) => {
			debug(`Caught semaphore wait error: ${semaphore.toString()}`);
			t.true(semaphore.errorState);
			t.is(err, `Semaphore timeout after ${timeout * 1000}`);
		});
});
