import { TestBed } from '@angular/core/testing';

import { VerifGuard } from './verif.guard';

describe('VerifGuard', () => {
  let guard: VerifGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
