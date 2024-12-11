import { Component, OnInit, OnDestroy } from '@angular/core';
import jsQR from 'jsqr';
import { Router } from '@angular/router'; // Para redirigir a la página de asistencia

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    try {
      // Accedemos a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.videoElement = document.querySelector('#video') as HTMLVideoElement;
      this.videoElement.srcObject = stream;

      // Crear un canvas invisible para capturar frames
      this.canvasElement = document.createElement('canvas');
      this.canvasContext = this.canvasElement.getContext('2d')!;

      // Iniciar el escaneo en tiempo real
      this.scanInterval = setInterval(() => this.scanQRCode(), 500);
    } catch (error) {
      console.error('Error al iniciar la cámara:', error);
    }
  }

  stopCamera() {
    // Detener el flujo de video si el usuario desea parar el escaneo
    const stream = this.videoElement?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    clearInterval(this.scanInterval);
  }

  scanQRCode() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      // Configurar el tamaño del canvas según el video
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasElement.height = this.videoElement.videoHeight;

      // Dibujar el frame actual en el canvas
      this.canvasContext.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);

      // Obtener datos del canvas
      const imageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);

      // Intentar leer un código QR
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      if (qrCode) {
        this.scannedData = qrCode.data;
        console.log('Código QR detectado:', this.scannedData);
      }
    }
  }

  openLink(link: string) {
    window.open(link, '_system');
  }

  // Registrar la asistencia
  registerAttendance() {
    // Aquí se actualiza el número de clases asistidas y el porcentaje en la página de asistencia.
    // Redirige a la página de asistencia para mostrar la actualización
    this.router.navigate(['/asistencia'], {
      queryParams: { increment: true }
    });
  }
}
