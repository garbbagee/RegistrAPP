import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

/*
desde el video en el min 20:50 comienzo a poner esto pero no se si estara bien, las importacines de login component

*/

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule

  ],
  declarations: [HomePage]
})
export class HomePageModule {}
