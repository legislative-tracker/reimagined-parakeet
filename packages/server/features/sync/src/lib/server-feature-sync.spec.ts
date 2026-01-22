import { serverFeatureSync } from './server-feature-sync.js';

describe('serverFeatureSync', () => {
  it('should work', () => {
    expect(serverFeatureSync()).toEqual('server-feature-sync');
  });
});
