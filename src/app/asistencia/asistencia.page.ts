import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para recibir parámetros

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  totalClasses: number = 30; // Total de clases (ajustable según el curso)
  attendedClasses: number = 0; // Inicialmente 0 clases asistidas
  attendancePercentage: number = 0; // Inicialmente 0%

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // Revisamos si el parámetro "increment" está presente en la URL
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['increment']) {
        this.incrementAttendance();
      }
    });
  }

  incrementAttendance() {
    this.attendedClasses += 1;
    this.updateAttendancePercentage();
  }

  updateAttendancePercentage() {
    this.attendancePercentage = (this.attendedClasses / this.totalClasses) * 100;
  }
}
