import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HallAddComponent } from './hall-add.component';

describe('HallAddComponent', () => {
  let component: HallAddComponent;
  let fixture: ComponentFixture<HallAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HallAddComponent]
    });

    fixture = TestBed.createComponent(HallAddComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});