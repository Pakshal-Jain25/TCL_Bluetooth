import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryGuyComponent } from './delivery-guy.component';

describe('DeliveryGuyComponent', () => {
  let component: DeliveryGuyComponent;
  let fixture: ComponentFixture<DeliveryGuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryGuyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryGuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
