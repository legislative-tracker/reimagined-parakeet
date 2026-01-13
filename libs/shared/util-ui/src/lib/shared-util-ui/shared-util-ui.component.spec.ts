import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedUtilUiComponent } from "./shared-util-ui.component.js";

describe("SharedUtilUiComponent", () => {
  let component: SharedUtilUiComponent;
  let fixture: ComponentFixture<SharedUtilUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
