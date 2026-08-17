import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HallListComponent } from './hall-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('HallListComponent', () => {
  let component: HallListComponent;
  let fixture: ComponentFixture<HallListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HallListComponent],
      imports: [HttpClientTestingModule, FormsModule]
    });

    fixture = TestBed.createComponent(HallListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});