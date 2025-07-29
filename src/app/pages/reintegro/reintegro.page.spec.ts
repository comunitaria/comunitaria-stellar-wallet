import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReintegroPage } from './reintegro.page';

describe('ReintegroPage', () => {
  let component: ReintegroPage;
  let fixture: ComponentFixture<ReintegroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReintegroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
