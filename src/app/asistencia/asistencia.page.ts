import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Para redirigir al usuario

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage {
  attendanceStatus: boolean | null = null; // Indica si la asistencia fue registrada

  constructor(private router: Router) {}

  registerAttendance() {
    // Aquí puedes agregar la lógica para registrar la asistencia
    // Por ejemplo, enviar una solicitud a Firebase para guardar el registro de asistencia

    // Supongamos que la asistencia se registra correctamente:
    this.attendanceStatus = true;

    // Si el registro falla, pondremos attendanceStatus en false
    // this.attendanceStatus = false;
  }
}
