import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToRecoverPass() {
    this.router.navigate(['/recoverpass']);
  }

  goToInfo() {
    // Por ahora, mostraremos un alert con información básica
    alert('RegistrAPP - Sistema de Asistencia Universitaria\n\n' +
          'Esta aplicación permite:\n' +
          '• Registrar asistencia de estudiantes\n' +
          '• Generar códigos QR para clases\n' +
          '• Escanear códigos QR para marcar asistencia\n' +
          '• Gestionar perfiles de usuarios\n\n' +
          'Desarrollado con Ionic y Angular');
  }
}



