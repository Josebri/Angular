import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockUserComponent } from './unlock-user.component';

describe('UnlockUserComponent', () => {
  let component: UnlockUserComponent;
  let fixture: ComponentFixture<UnlockUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
