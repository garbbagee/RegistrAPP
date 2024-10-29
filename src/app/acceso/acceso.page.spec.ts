import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccesoPage } from './acceso.page';

describe('AccesoPage', () => {
  let component: AccesoPage;
  let fixture: ComponentFixture<AccesoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
