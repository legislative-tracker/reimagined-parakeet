import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { stateGuard } from './state-guard';

describe('stateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => stateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
