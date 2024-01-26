import { TestBed } from '@angular/core/testing';

import { ProtectRoutesGuard } from './protect-routes.guard';

describe('ProtectRoutesGuard', () => {
  let guard: ProtectRoutesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProtectRoutesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
