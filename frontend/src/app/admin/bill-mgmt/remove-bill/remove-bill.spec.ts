import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveBill } from './remove-bill';

describe('RemoveBill', () => {
  let component: RemoveBill;
  let fixture: ComponentFixture<RemoveBill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveBill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveBill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
