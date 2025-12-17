import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myreps } from './myreps';

describe('Myreps', () => {
  let component: Myreps;
  let fixture: ComponentFixture<Myreps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myreps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myreps);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
