// home.page.ts
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  userName: string = 'Estudiante'; // Puedes reemplazar esto con el nombre del usuario real después de la autenticación.

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Aquí puedes cargar el nombre del usuario si es necesario.
  }

  onStart() {
    // Aquí puedes navegar a otra página, por ejemplo, a la página de escaneo de asistencia
    this.navCtrl.navigateForward('/attendance-scan'); // Cambia '/attendance-scan' al path correspondiente
  }
}
