import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContextComponent } from './customer-context.component';

describe('CustomerContextComponent', () => {
  let component: CustomerContextComponent;
  let fixture: ComponentFixture<CustomerContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerContextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
