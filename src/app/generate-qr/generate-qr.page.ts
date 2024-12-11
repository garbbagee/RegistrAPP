import { Component, OnInit } from '@angular/core';
import * as QRCode from 'qrcode'; // Importa la librería QRCode

@Component({
  selector: 'app-generate-qr',
  templateUrl: './generate-qr.page.html',
  styleUrls: ['./generate-qr.page.scss'],
})
export class GenerateQrPage implements OnInit {
  qrData: string = ''; // Variable para almacenar el código QR generado

  constructor() { }

  ngOnInit() { }

  generateQRCode() {
    // Generar un código QR único para el profesor (puede incluir un ID, URL o información única)
    const uniqueData = 'asistenciaProfesor123'; // Esta sería la información única para el registro de asistencia
    QRCode.toDataURL(uniqueData, { width: 256 }, (err, url) => {
      if (err) {
        console.error('Error al generar el QR', err);
      } else {
        this.qrData = url; // Asignar el QR generado al src de la imagen
      }
    });
  }
}
