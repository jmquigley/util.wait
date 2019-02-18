"use strict";

import "@babel/polyfill";

import {Semaphore, wait, waitCallback, waitPromise} from "../index";
import {debug} from "./helpers";

const timeout: number = 20000;

test(
	"Test the wait function (3 seconds)",
	(done) => {
		debug(`Starting wait: ${new Date()}`);
		wait(
			3,
			(ret: string) => {
				expect(ret).toBe("stuff");
				debug(`Finished wait(): ${new Date()}`);
				done();
			},
			"stuff"
		);
	},
	timeout
);

test(
	"Test the wait promise function (3 seconds)",
	async () => {
		debug(`Starting promise wait: ${new Date()}`);
		await waitPromise(3, "stuff")
			.then((ret: any) => {
				expect(ret).toBe("stuff");
				debug(`Finished promise wait: ${new Date()}`);
			})
			.catch((err: string) => {
				throw new Error(err);
			});
	},
	timeout
);

test(
	"Test the wait callback function (3 seconds)",
	(done) => {
		debug(`Starting wait callback: ${new Date()}`);
		waitCallback(
			3,
			(ret: any) => {
				expect(ret).toBe("stuff");
				debug(`Finished wait callback: ${new Date()}`);
				done();
			},
			"stuff"
		);
	},
	timeout
);

test(
	"Test the initial increment (2 seconds)",
	(done) => {
		const semaphore = new Semaphore(10, true);

		(() => {
			debug(`Starting F1: ${new Date()}`);
			expect(semaphore.counter).toBe(1);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(2, () => {
				semaphore.decrement();
				expect(semaphore.errorState).toBe(false);
				debug(`Done with f1 (2 seconds): ${new Date()}`);
			});
		})();

		semaphore.waitCallback((err: Error) => {
			if (err) {
				throw new Error("This error should not occur");
			}

			expect(semaphore.counter).toBe(0);
			expect(semaphore.errorState).toBe(false);
			debug(`Finished: ${semaphore.toString()}`);
			done();
		});
	},
	timeout
);

test(
	"Test the semaphore class with callback (5 seconds)",
	(done) => {
		const semaphore = new Semaphore(10);

		(() => {
			debug(`Starting F1: ${new Date()}`);
			expect(semaphore.increment()).toBe(1);
			expect(semaphore.counter).toBe(1);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(2, () => {
				semaphore.decrement();
				expect(semaphore.errorState).toBe(false);
				debug(`Done with f1 (2 seconds): ${new Date()}`);
			});
		})();

		(() => {
			debug(`Starting F2: ${new Date()}`);
			expect(semaphore.increment()).toBe(2);
			expect(semaphore.counter).toBe(2);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(5, () => {
				semaphore.decrement();
				expect(semaphore.errorState).toBe(false);
				debug(`Done with f2 (5 seconds): ${new Date()}`);
			});
		})();

		semaphore.waitCallback((err: Error) => {
			if (err) {
				throw new Error("This error should not occur");
			}

			expect(semaphore.counter).toBe(0);
			expect(semaphore.errorState).toBe(false);
			debug(`Finished: ${semaphore.toString()}`);
			done();
		});
	},
	timeout
);

test(
	"Test semaphore timeout error with callback (2 seconds)",
	(done) => {
		const timeout: number = 2;
		const semaphore = new Semaphore(timeout);

		(() => {
			debug(`Starting fn: ${new Date()}`);
			expect(semaphore.increment()).toBe(1);
			expect(semaphore.counter).toBe(1);
			waitCallback(5, () => {
				expect(semaphore.errorState).toBe(true);
			});
		})();

		semaphore.waitCallback((err: Error) => {
			if (err) {
				debug(`Caught semaphore wait error: ${semaphore.toString()}`);
				expect(err.message).toBe(
					`Semaphore timeout after ${timeout * 1000}`
				);
				expect(semaphore.errorState).toBe(true);
				return done();
			}
		});
	},
	timeout
);

test(
	"Test the semaphore class with Promise (5 seconds)",
	async () => {
		const semaphore = new Semaphore(10);

		(() => {
			debug(`Starting F1: ${new Date()}`);
			expect(semaphore.increment()).toBe(1);
			expect(semaphore.counter).toBe(1);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(2, () => {
				semaphore.decrement();
				expect(semaphore.errorState).toBe(false);
				debug(`Done with f1 (2 seconds): ${new Date()}`);
			});
		})();

		(() => {
			debug(`Starting F2: ${new Date()}`);
			expect(semaphore.increment()).toBe(2);
			expect(semaphore.counter).toBe(2);
			// Arbitrary delay to show that the semaphore is waiting
			waitCallback(5, () => {
				semaphore.decrement();
				expect(semaphore.errorState).toBe(false);
				debug(`Done with f2 (5 seconds): ${new Date()}`);
			});
		})();

		await semaphore
			.wait()
			.then(() => {
				expect(semaphore.counter).toBe(0);
				expect(semaphore.errorState).toBe(false);
				debug(`Finished: ${semaphore.toString()}`);
			})
			.catch((err: string) => {
				throw new Error(err);
			});
	},
	timeout
);

test(
	"Test semaphore timeout error with Promise (2 seconds)",
	async () => {
		const timeout: number = 2;
		const semaphore = new Semaphore(timeout);

		(() => {
			debug(`Starting fn: ${new Date()}`);
			expect(semaphore.increment()).toBe(1);
			expect(semaphore.counter).toBe(1);
			waitCallback(5, () => {
				expect(semaphore.errorState).toBe(true);
			});
		})();

		await semaphore
			.wait()
			.then(() => {
				throw new Error("Timeout error should have occurred");
			})
			.catch((err: string) => {
				debug(`Caught semaphore wait error: ${semaphore.toString()}`);
				expect(semaphore.errorState).toBe(true);
				expect(err).toBe(`Semaphore timeout after ${timeout * 1000}`);
			});
	},
	timeout
);
