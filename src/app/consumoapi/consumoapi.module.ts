// src/app/consumoapi/consumoapi.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsumoApiPageRoutingModule } from './consumoapi-routing.module';
import { ConsumoApiPage } from './consumoapi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumoApiPageRoutingModule
  ],
  declarations: [ConsumoApiPage],
  exports: [ConsumoApiPage] // Asegúrate de exportar el componente aquí
})
export class ConsumoApiPageModule {}
