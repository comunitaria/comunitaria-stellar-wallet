import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransfiriendoPage } from './transfiriendo.page';

describe('TransfiriendoPage', () => {
  let component: TransfiriendoPage;
  let fixture: ComponentFixture<TransfiriendoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfiriendoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
