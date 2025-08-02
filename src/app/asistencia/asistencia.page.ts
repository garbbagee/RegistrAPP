import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage {
  totalClasses: number = 20; // Total de clases (puedes modificarlo según sea necesario)
  attendedClasses: number = 0;
  attendancePercentage: number = 0;
  currentUser: any = null;
  attendanceHistory: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.getCurrentUser();
  }

  async getCurrentUser() {
    this.currentUser = await this.authService.getCurrentUser();
  }

  // Cargar asistencia cada vez que se entra a la página
  ionViewWillEnter() {
    this.loadAttendance();
    this.loadAttendanceHistory();
  }

  // Función para cargar la asistencia desde localStorage
  loadAttendance() {
    const attended = parseInt(localStorage.getItem('attendedClasses') || '0', 10);
    this.attendedClasses = attended;
    this.attendancePercentage = Math.round((this.attendedClasses / this.totalClasses) * 100);
  }

  // Función para cargar el historial de asistencia
  loadAttendanceHistory() {
    this.attendanceHistory = [];
    
    // Buscar todas las claves de localStorage que empiecen con 'attendance_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('attendance_')) {
        try {
          const attendanceData = JSON.parse(localStorage.getItem(key) || '{}');
          this.attendanceHistory.push(attendanceData);
        } catch (error) {
          console.error('Error parsing attendance data:', error);
        }
      }
    }
    
    // Ordenar por fecha (más reciente primero)
    this.attendanceHistory.sort((a, b) => {
      return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
    });
  }

  // Función para obtener el color del porcentaje
  getPercentageColor(): string {
    if (this.attendancePercentage >= 80) return '#4caf50'; // Verde
    if (this.attendancePercentage >= 60) return '#ff9800'; // Naranja
    return '#f44336'; // Rojo
  }

  // Función para formatear fecha
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Función para obtener el estado de asistencia
  getAttendanceStatus(): string {
    if (this.attendancePercentage >= 80) return 'Excelente';
    if (this.attendancePercentage >= 60) return 'Buena';
    return 'Necesita mejorar';
  }

  // Función para obtener el icono del estado
  getStatusIcon(): string {
    if (this.attendancePercentage >= 80) return 'checkmark-circle';
    if (this.attendancePercentage >= 60) return 'warning';
    return 'close-circle';
  }

  // Función para obtener el color del icono
  getStatusColor(): string {
    if (this.attendancePercentage >= 80) return 'success';
    if (this.attendancePercentage >= 60) return 'warning';
    return 'danger';
  }

  // Redirigir a la página de inicio de alumno
  goToInicioAlumno() {
    this.router.navigate(['/inicio-alumno']);
  }

  // Función para escanear nuevo QR
  scanNewQR() {
    this.router.navigate(['/escanear']);
  }

  // Función para limpiar historial (solo para desarrollo)
  clearHistory() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el historial de asistencia?')) {
      // Eliminar solo las claves de asistencia
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('attendance_')) {
          localStorage.removeItem(key);
        }
      }
      // Resetear contador
      localStorage.setItem('attendedClasses', '0');
      this.loadAttendance();
      this.loadAttendanceHistory();
    }
  }
}
