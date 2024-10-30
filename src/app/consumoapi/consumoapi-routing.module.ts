// src/app/consumoapi/consumoapi-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumoApiPage } from './consumoapi.page'; // Asegúrate de que estás importando "ConsumoApiPage"

const routes: Routes = [
  {
    path: '',
    component: ConsumoApiPage // Asegúrate de que esté correctamente escrito
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumoApiPageRoutingModule {}
