import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recoverpass',
  templateUrl: './recoverpass.page.html',
  styleUrls: ['./recoverpass.page.scss'],
})
export class RecoverpassPage {
  email: string = '';

  constructor(private afAuth: AngularFireAuth, private router: Router, private alertCtrl: AlertController) {}

  async onRecoverPassword() {
    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
      const alert = await this.alertCtrl.create({
        header: 'Correo Enviado',
        message: 'Revisa tu correo para seguir con la recuperación de contraseña.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Hubo un problema enviando el correo. Verifica el correo ingresado.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Función para redirigir al login
  goBackToLogin() {
    this.router.navigate(['/home']); // Redirige al inicio de sesión
  }
}
