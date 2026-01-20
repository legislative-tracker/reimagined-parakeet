import { sharedConfigSecrets } from './shared-config-secrets.js';

describe('sharedConfigSecrets', () => {
  it('should work', () => {
    expect(sharedConfigSecrets()).toEqual('shared-config-secrets');
  });
});
