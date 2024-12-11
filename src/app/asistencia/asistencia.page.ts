import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage {
  totalClasses: number = 20; // Total de clases (puedes modificarlo según sea necesario)
  attendedClasses: number = 0;
  attendancePercentage: number = 0;

  constructor(private router: Router) {}

  // Cargar asistencia cada vez que se entra a la página
  ionViewWillEnter() {
    this.loadAttendance();
  }

  // Función para cargar la asistencia desde localStorage
  loadAttendance() {
    const attended = parseInt(localStorage.getItem('attendedClasses') || '0', 10);
    this.attendedClasses = attended;
    this.attendancePercentage = Math.round((this.attendedClasses / this.totalClasses) * 100);
  }

  // Redirigir a la página de inicio de alumno
  goToInicioAlumno() {
    this.router.navigate(['/inicio-alumno']);
  }
}
