import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Legislator } from './legislator';

describe('Legislator', () => {
  let component: Legislator;
  let fixture: ComponentFixture<Legislator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Legislator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Legislator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
