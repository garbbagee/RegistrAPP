// acceso.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccesoPage } from './acceso.page';
import { LoginComponent } from '../components/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [AccesoPage, LoginComponent]
})
export class AccesoPageModule {}
