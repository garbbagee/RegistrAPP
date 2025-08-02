import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async initializeNotifications() {
    try {
      // Solicitar permisos
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        // Registrar para recibir notificaciones
        await PushNotifications.register();
        
        // Configurar listeners
        this.setupNotificationListeners();
        
        console.log('Notificaciones inicializadas correctamente');
      } else {
        console.log('Permisos de notificación denegados');
      }
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
    }
  }

  private setupNotificationListeners() {
    // Notificación recibida cuando la app está en primer plano
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      this.showNotificationAlert(notification);
    });

    // Notificación tocada por el usuario
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      this.handleNotificationAction(notification);
    });

    // Registro exitoso
    PushNotifications.addListener('registration', (token) => {
      console.log('Token de notificación:', token.value);
      this.saveNotificationToken(token.value);
    });

    // Error en el registro
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error en registro de notificaciones:', error);
    });
  }

  private async showNotificationAlert(notification: any) {
    const alert = await this.alertController.create({
      header: notification.title || 'Nueva Notificación',
      message: notification.body || 'Tienes una nueva notificación',
      buttons: ['OK']
    });
    await alert.present();
  }

  private async handleNotificationAction(notification: any) {
    // Manejar acciones específicas según el tipo de notificación
    const data = notification.notification.data;
    
    if (data?.type === 'attendance_reminder') {
      // Navegar a la página de escaneo
      console.log('Navegando a escaneo de QR');
    } else if (data?.type === 'qr_generated') {
      // Mostrar información del QR generado
      console.log('QR generado por:', data.professor);
    }
  }

  private saveNotificationToken(token: string) {
    // Guardar el token en localStorage o enviarlo al servidor
    localStorage.setItem('notification_token', token);
  }

  async sendAttendanceReminder(classInfo: any) {
    // Simular envío de notificación de recordatorio
    const toast = await this.toastController.create({
      message: `Recordatorio: Clase de ${classInfo.name} en 5 minutos`,
      duration: 3000,
      position: 'top',
      color: 'primary'
    });
    await toast.present();
  }

  async sendQRGeneratedNotification(classInfo: any, professorEmail: string) {
    const toast = await this.toastController.create({
      message: `QR generado para ${classInfo.name} por ${professorEmail}`,
      duration: 3000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  async sendLowAttendanceAlert(studentEmail: string, attendancePercentage: number) {
    const toast = await this.toastController.create({
      message: `Alerta: Tu asistencia es del ${attendancePercentage}%. ¡Asiste a más clases!`,
      duration: 5000,
      position: 'top',
      color: 'warning'
    });
    await toast.present();
  }

  async sendClassCancelledNotification(classInfo: any) {
    const toast = await this.toastController.create({
      message: `Clase cancelada: ${classInfo.name}`,
      duration: 4000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }

  async sendNewAnnouncementNotification(announcement: any) {
    const toast = await this.toastController.create({
      message: `Nuevo anuncio: ${announcement.title}`,
      duration: 4000,
      position: 'top',
      color: 'info'
    });
    await toast.present();
  }

  // Método para programar recordatorios
  scheduleAttendanceReminder(classTime: Date, classInfo: any) {
    const now = new Date();
    const timeUntilClass = classTime.getTime() - now.getTime();
    
    if (timeUntilClass > 0) {
      setTimeout(() => {
        this.sendAttendanceReminder(classInfo);
      }, timeUntilClass - (5 * 60 * 1000)); // 5 minutos antes
    }
  }

  // Método para verificar si las notificaciones están habilitadas
  async checkNotificationPermission(): Promise<boolean> {
    try {
      const permission = await PushNotifications.checkPermissions();
      return permission.receive === 'granted';
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      return false;
    }
  }

  // Método para solicitar permisos manualmente
  async requestNotificationPermission(): Promise<boolean> {
    try {
      const permission = await PushNotifications.requestPermissions();
      return permission.receive === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  }
} 