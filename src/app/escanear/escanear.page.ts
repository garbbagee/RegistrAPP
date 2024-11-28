import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import jsQR from 'jsqr';  // Importar jsQR para leer códigos QR

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage implements OnInit {

  scannedData: string = ''; // Almacenamos los datos del QR escaneado

  constructor() { }

  ngOnInit() {}

  // Método para capturar la imagen con la cámara
  async scanQRCode() {
    const image = await Camera.getPhoto({
      quality: 90,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri,
    });

    // Verificamos si image.webPath está definido
    const imageUrl = image.webPath ? image.webPath : '';  // Asignamos un valor vacío si es undefined
    
    if (imageUrl) {
      // Convierte la imagen a base64 y procesa con jsQR
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = img.height;
        canvas.width = img.width;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
          if (qrCode) {
            this.scannedData = qrCode.data;  // Almacena los datos del QR
            console.log("QR Escaneado:", this.scannedData);
          } else {
            console.log("No se pudo leer el código QR.");
          }
        }
      };
    } else {
      console.log("Error: No se pudo obtener la ruta de la imagen.");
    }
  }

}
