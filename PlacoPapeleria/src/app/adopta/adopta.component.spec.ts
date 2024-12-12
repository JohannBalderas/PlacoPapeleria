import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptaComponent } from './adopta.component';

describe('AdoptaComponent', () => {
  let component: AdoptaComponent;
  let fixture: ComponentFixture<AdoptaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdoptaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
