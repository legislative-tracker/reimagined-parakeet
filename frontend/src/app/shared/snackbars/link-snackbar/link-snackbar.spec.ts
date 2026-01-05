import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSnackbar } from './link-snackbar';

describe('LinkSnackbar', () => {
  let component: LinkSnackbar;
  let fixture: ComponentFixture<LinkSnackbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkSnackbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkSnackbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
