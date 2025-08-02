import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-alumno',
  templateUrl: './inicio-alumno.page.html',
  styleUrls: ['./inicio-alumno.page.scss'],
})
export class InicioAlumnoPage implements OnInit {
  userEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserEmail();
  }

  async loadUserEmail() {
    const user = await this.authService.getCurrentUser();
    this.userEmail = user?.email || 'Usuario';
  }

  goToScan() {
    this.router.navigate(['/escanear']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  goToAttendance() {
    this.router.navigate(['/asistencia']);
  }

  async logout() {
    await this.authService.logout();
  }
}
