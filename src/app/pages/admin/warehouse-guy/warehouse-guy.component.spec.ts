import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGuyComponent } from './warehouse-guy.component';

describe('WarehouseGuyComponent', () => {
  let component: WarehouseGuyComponent;
  let fixture: ComponentFixture<WarehouseGuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseGuyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseGuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
