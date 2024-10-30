import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; // Para redirigir al usuario

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {
  userEmail: string = ''; // Variable para almacenar el correo del usuario

  constructor(private authService: AuthService, private router: Router) {
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

  scanQRCode() {
    this.router.navigate(['/escanear']); // Navega a la página Escanear
  }

  listStudents() {
    // Aquí implementas la funcionalidad para mostrar la lista de alumnos
    this.router.navigate(['/consumoapi']);
  }

  myInfo() {
    // Aquí puedes implementar la funcionalidad para mostrar la información del usuario
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.authService.logout(); // Cierra sesión
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }

  
}
