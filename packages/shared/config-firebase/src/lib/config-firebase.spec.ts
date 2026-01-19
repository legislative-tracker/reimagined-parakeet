import { configFirebase } from './config-firebase';

describe('configFirebase', () => {
  it('should work', () => {
    expect(configFirebase()).toEqual('config-firebase');
  });
});
