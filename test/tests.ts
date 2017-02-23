'use strict';

import {test} from 'ava';
import {wait, waitCallback} from '../index';

test('Test the wait promise function', async (t: any) => {
	await wait(3)
		.then((duration: number) => {
			t.is(duration, 3000);
			t.pass();
		})
		.catch((err: string) => {
			t.fail(`${t.title}: ${err}`);
		});

	t.pass();
});

test.cb('Test the wait callback function', (t: any) => {
	waitCallback(3, (duration: number) => {
		t.is(duration, 3000);
		t.pass(duration);
		t.end();
	});
});
