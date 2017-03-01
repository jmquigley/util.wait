'use strict';

import * as assert from 'assert';
import {wait, waitCallback} from '../index';

describe('Testing util.wait', () => {
	it('Test the wait promise function', async () => {
		await wait(3, 'stuff')
			.then((ret: any) => {
				assert.equal(ret, 'stuff');
			})
			.catch((err: string) => {
				assert(false, err);
			});
	});

	it('Test the wait callback function', () => {
		waitCallback(3, (ret: any) => {
			assert.equal(ret, 'stuff');
			assert(ret);
		}, 'stuff');
	});
});
