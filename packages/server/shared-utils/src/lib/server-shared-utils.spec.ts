import { serverSharedUtils } from './server-shared-utils.js';

describe('serverSharedUtils', () => {
  it('should work', () => {
    expect(serverSharedUtils()).toEqual('server-shared-utils');
  });
});
