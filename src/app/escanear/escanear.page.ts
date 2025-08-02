import { Component, OnInit, OnDestroy } from '@angular/core';
import jsQR from 'jsqr';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage implements OnInit, OnDestroy {
  scannedData: string = '';
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  canvasContext!: CanvasRenderingContext2D;
  scanInterval: any;
  isScanning: boolean = false;
  currentUser: any = null;
  lastScannedSession: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getCurrentUser();
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async getCurrentUser() {
    this.currentUser = await this.authService.getCurrentUser();
  }

  async startCamera() {
    try {
      this.isScanning = true;
      
      // Accedemos a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      this.videoElement = document.querySelector('#video') as HTMLVideoElement;
      this.videoElement.srcObject = stream;
      await this.videoElement.play();

      // Crear un canvas invisible para capturar frames
      this.canvasElement = document.createElement('canvas');
      this.canvasContext = this.canvasElement.getContext('2d')!;

      // Iniciar el escaneo en tiempo real
      this.scanInterval = setInterval(() => this.scanQRCode(), 300);
      
    } catch (error) {
      console.error('Error al iniciar la cámara:', error);
      this.showAlert('Error', 'No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }

  stopCamera() {
    this.isScanning = false;
    if (this.videoElement?.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
    }
  }

  scanQRCode() {
    if (!this.videoElement || this.videoElement.readyState !== this.videoElement.HAVE_ENOUGH_DATA) {
      return;
    }

    try {
      // Configurar el tamaño del canvas según el video
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasElement.height = this.videoElement.videoHeight;

      // Dibujar el frame actual en el canvas
      this.canvasContext.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);

      // Obtener datos del canvas
      const imageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);

      // Intentar leer un código QR
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (qrCode && qrCode.data !== this.scannedData) {
        this.scannedData = qrCode.data;
        console.log('Código QR detectado:', this.scannedData);
        this.processQRCode(this.scannedData);
      }
    } catch (error) {
      console.error('Error al escanear QR:', error);
    }
  }

  async processQRCode(qrData: string) {
    try {
      // Detener el escaneo temporalmente
      this.stopCamera();
      
      // Intentar parsear los datos del QR
      const qrInfo = JSON.parse(qrData);
      
      // Verificar que sea un código de asistencia válido
      if (qrInfo.type !== 'attendance') {
        this.showAlert('Error', 'Código QR inválido. Este no es un código de asistencia.');
        this.startCamera();
        return;
      }

      // Verificar que no se haya escaneado la misma sesión
      if (qrInfo.sessionId === this.lastScannedSession) {
        this.showAlert('Información', 'Ya has registrado asistencia para esta sesión.');
        this.startCamera();
        return;
      }

      // Mostrar confirmación
      const alert = await this.alertController.create({
        header: 'Código QR Detectado',
        message: `¿Deseas registrar tu asistencia para la sesión ${qrInfo.sessionId}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.startCamera();
            }
          },
          {
            text: 'Registrar',
            handler: () => {
              this.registerAttendance(qrInfo);
            }
          }
        ]
      });
      await alert.present();

    } catch (error) {
      console.error('Error al procesar QR:', error);
      this.showAlert('Error', 'Código QR inválido o corrupto.');
      this.startCamera();
    }
  }

  async registerAttendance(qrInfo: any) {
    const loading = await this.loadingController.create({
      message: 'Registrando asistencia...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Guardar la sesión escaneada para evitar duplicados
      this.lastScannedSession = qrInfo.sessionId;
      
      // Incrementar el contador de asistencia
      const currentAttendance = parseInt(localStorage.getItem('attendedClasses') || '0', 10);
      localStorage.setItem('attendedClasses', (currentAttendance + 1).toString());
      
      // Guardar información adicional de la sesión
      const attendanceData = {
        sessionId: qrInfo.sessionId,
        professorId: qrInfo.professorId,
        professorEmail: qrInfo.professorEmail,
        timestamp: qrInfo.timestamp,
        scannedAt: new Date().toISOString(),
        studentEmail: this.currentUser?.email
      };
      
      localStorage.setItem(`attendance_${qrInfo.sessionId}`, JSON.stringify(attendanceData));

      await loading.dismiss();
      
      this.showAlert('Éxito', '¡Asistencia registrada correctamente!');
      
      // Redirigir a la página de asistencia
      this.router.navigate(['/asistencia'], {
        queryParams: { increment: true }
      });

    } catch (error) {
      await loading.dismiss();
      console.error('Error al registrar asistencia:', error);
      this.showAlert('Error', 'No se pudo registrar la asistencia. Inténtalo de nuevo.');
      this.startCamera();
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Función para volver a la página anterior
  goBack() {
    this.router.navigate(['/inicio-alumno']);
  }
}
