'use strict';

import {test} from 'ava';
import {wait, waitCallback} from '../index';

test('Test the wait promise function', async (t: any) => {
	await wait(3, 'stuff')
		.then((ret: any) => {
			t.is(ret, 'stuff');
			t.pass();
		})
		.catch((err: string) => {
			t.fail(`${t.title}: ${err}`);
		});

	t.pass();
});

test.cb('Test the wait callback function', (t: any) => {
	waitCallback(3, (ret: any) => {
		t.is(ret, 'stuff');
		t.pass(ret);
		t.end();
	}, 'stuff');
});
