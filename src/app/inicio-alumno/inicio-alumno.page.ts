import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; // Para redirigir al usuario
import { AlertController } from '@ionic/angular'; // Para mostrar alertas

@Component({
  selector: 'app-inicio-alumno',
  templateUrl: './inicio-alumno.page.html',
  styleUrls: ['./inicio-alumno.page.scss'],
})
export class InicioAlumnoPage {
  userEmail: string = ''; // Variable para almacenar el correo del usuario

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController // Inyectar AlertController
  ) {
    this.getUserEmail(); // Llama al método para obtener el correo
  }

  private async getUserEmail() {
    const userObservable = await this.authService.getUser(); // Obtén el observable
    userObservable.subscribe(user => {
      if (user) {
        this.userEmail = user.email; // Guarda el correo del usuario
      }
    });
  }

  generateQR() {
    // Aquí puedes agregar la lógica para generar el QR
    // Redirige a la página de generación de QR (si ya la tienes) o implementa la lógica
    this.router.navigate(['/generate-qr']); // Redirige a la página para generar el QR
  }

  myInfo() {
    this.router.navigate(['/perfil']); // Navega a la página de perfil
  }

  async logout() {
    await this.authService.logout(); // Cierra sesión
    this.router.navigate(['/home']); // Redirige a la página de inicio
    this.presentAlert('Has cerrado sesión con éxito.'); // Muestra la alerta de cierre de sesión
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
