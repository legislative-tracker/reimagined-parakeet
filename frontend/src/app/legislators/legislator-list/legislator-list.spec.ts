import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislatorList } from './legislator-list';

describe('LegislatorList', () => {
  let component: LegislatorList;
  let fixture: ComponentFixture<LegislatorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegislatorList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegislatorList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
