import { serverDataAccess } from './server-data-access.js';

describe('serverDataAccess', () => {
  it('should work', () => {
    expect(serverDataAccess()).toEqual('server-data-access');
  });
});
