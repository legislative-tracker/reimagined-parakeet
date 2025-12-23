import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAdmin } from './remove-admin';

describe('RemoveAdmin', () => {
  let component: RemoveAdmin;
  let fixture: ComponentFixture<RemoveAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
