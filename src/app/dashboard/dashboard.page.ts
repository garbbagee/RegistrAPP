import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  currentUser: any;
  userRole: string = '';
  
  // Estadísticas generales
  totalClasses: number = 0;
  attendedClasses: number = 0;
  attendancePercentage: number = 0;
  currentStreak: number = 0;
  longestStreak: number = 0;
  
  // Datos para gráficos
  weeklyData: any[] = [];
  monthlyData: any[] = [];
  classPerformance: any[] = [];
  
  // Tendencias
  weeklyTrend: string = 'stable';
  monthlyTrend: string = 'increasing';
  
  // Próximas clases
  upcomingClasses: any[] = [];
  
  // Alertas
  alerts: any[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
    this.initializeNotifications();
  }

  async loadUserData() {
    this.currentUser = await this.authService.getCurrentUser();
    this.userRole = await this.authService.getUserRole(this.currentUser?.uid);
  }

  async loadDashboardData() {
    // Simular carga de datos
    await this.loadAttendanceData();
    await this.loadWeeklyData();
    await this.loadMonthlyData();
    await this.loadClassPerformance();
    await this.loadUpcomingClasses();
    await this.generateAlerts();
  }

  async loadAttendanceData() {
    // Obtener datos de localStorage
    const attendanceData = this.getAttendanceFromStorage();
    
    this.totalClasses = attendanceData.length;
    this.attendedClasses = attendanceData.filter((a: any) => a.attended).length;
    this.attendancePercentage = this.totalClasses > 0 ? 
      Math.round((this.attendedClasses / this.totalClasses) * 100) : 0;
    
    this.currentStreak = this.calculateCurrentStreak(attendanceData);
    this.longestStreak = this.calculateLongestStreak(attendanceData);
  }

  async loadWeeklyData() {
    // Simular datos semanales
    this.weeklyData = [
      { day: 'Lun', attended: 1, total: 1 },
      { day: 'Mar', attended: 1, total: 1 },
      { day: 'Mié', attended: 0, total: 1 },
      { day: 'Jue', attended: 1, total: 1 },
      { day: 'Vie', attended: 1, total: 1 },
      { day: 'Sáb', attended: 0, total: 0 },
      { day: 'Dom', attended: 0, total: 0 }
    ];
  }

  async loadMonthlyData() {
    // Simular datos mensuales
    this.monthlyData = [
      { week: 'Sem 1', attended: 4, total: 5 },
      { week: 'Sem 2', attended: 5, total: 5 },
      { week: 'Sem 3', attended: 3, total: 5 },
      { week: 'Sem 4', attended: 4, total: 5 }
    ];
  }

  async loadClassPerformance() {
    // Simular rendimiento por clase
    this.classPerformance = [
      { class: 'Programación I', attendance: 85, trend: 'up' },
      { class: 'Bases de Datos', attendance: 92, trend: 'up' },
      { class: 'Redes', attendance: 78, trend: 'down' },
      { class: 'Desarrollo Web', attendance: 88, trend: 'stable' }
    ];
  }

  async loadUpcomingClasses() {
    // Simular próximas clases
    this.upcomingClasses = [
      {
        name: 'Programación II',
        subject: 'Java Avanzado',
        time: '09:00',
        date: 'Hoy',
        professor: 'Dr. García'
      },
      {
        name: 'Bases de Datos',
        subject: 'SQL Avanzado',
        time: '11:00',
        date: 'Mañana',
        professor: 'Prof. López'
      },
      {
        name: 'Desarrollo Web',
        subject: 'React.js',
        time: '14:00',
        date: 'Mañana',
        professor: 'Ing. Martínez'
      }
    ];
  }

  async generateAlerts() {
    this.alerts = [];
    
    // Alerta de baja asistencia
    if (this.attendancePercentage < 80) {
      this.alerts.push({
        type: 'warning',
        icon: 'warning-outline',
        title: 'Baja Asistencia',
        message: `Tu asistencia es del ${this.attendancePercentage}%. ¡Asiste a más clases!`
      });
    }
    
    // Alerta de racha
    if (this.currentStreak >= 5) {
      this.alerts.push({
        type: 'success',
        icon: 'trophy-outline',
        title: '¡Excelente Racha!',
        message: `Llevas ${this.currentStreak} clases consecutivas asistiendo. ¡Sigue así!`
      });
    }
    
    // Alerta de próxima clase
    if (this.upcomingClasses.length > 0) {
      this.alerts.push({
        type: 'info',
        icon: 'time-outline',
        title: 'Próxima Clase',
        message: `${this.upcomingClasses[0].name} en ${this.upcomingClasses[0].time}`
      });
    }
  }

  getAttendanceFromStorage(): any[] {
    const attendanceData = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('attendance_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          attendanceData.push(data);
        } catch (e) {
          console.error('Error parsing attendance data:', e);
        }
      }
    }
    return attendanceData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  calculateCurrentStreak(attendanceData: any[]): number {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < attendanceData.length; i++) {
      const attendance = attendanceData[i];
      const attendanceDate = new Date(attendance.timestamp);
      
      if (attendance.attended && this.isConsecutiveDay(today, attendanceDate, streak)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  calculateLongestStreak(attendanceData: any[]): number {
    let longestStreak = 0;
    let currentStreak = 0;
    
    for (let i = 0; i < attendanceData.length; i++) {
      if (attendanceData[i].attended) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return longestStreak;
  }

  isConsecutiveDay(today: Date, attendanceDate: Date, streak: number): boolean {
    const diffTime = Math.abs(today.getTime() - attendanceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === streak;
  }

  async initializeNotifications() {
    await this.notificationService.initializeNotifications();
  }

  getAttendanceColor(percentage: number): string {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'warning';
    return 'danger';
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'remove';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'danger';
      default: return 'medium';
    }
  }

  getAlertColor(type: string): string {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      default: return 'primary';
    }
  }
} 