import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular'; // Importar AlertController

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  userEmail: string = ''; // Variable para almacenar el correo del usuario
  username: string = '';  // Variable para almacenar el nombre de usuario

  constructor(private authService: AuthService, private alertController: AlertController) {
    this.getUserEmail(); // Llama al método para obtener el correo
  }

  private async getUserEmail() {
    const userObservable = await this.authService.getUser(); // Obtén el observable
    userObservable.subscribe(user => {
      if (user) {
        this.userEmail = user.email; // Guarda el correo del usuario
        this.username = this.userEmail.split('@')[0]; // Extrae el nombre de usuario
      }
    });
  }

  // Método para cerrar sesión
  async logout() {
    await this.authService.logout(); // Llama al método de cierre de sesión
    this.presentAlert('Sesión cerrada con éxito'); // Muestra la alerta
  }

  // Método para mostrar la alerta
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
