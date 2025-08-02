import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-generate-qr',
  templateUrl: './generate-qr.page.html',
  styleUrls: ['./generate-qr.page.scss'],
})
export class GenerateQrPage implements OnInit {
  qrCodeUrl: string = '';
  isLoading: boolean = false;
  sessionId: string = '';
  currentUser: any;
  currentDate: string = '';
  selectedClass: string = '';
  selectedSubject: string = '';

  // Clases de Ingeniería en Informática
  classes = [
    { id: 'programacion1', name: 'Programación I', subjects: ['Introducción a la Programación', 'Algoritmos Básicos', 'Estructuras de Datos'] },
    { id: 'programacion2', name: 'Programación II', subjects: ['Programación Orientada a Objetos', 'Java', 'Patrones de Diseño'] },
    { id: 'bases_datos', name: 'Bases de Datos', subjects: ['SQL', 'Modelado de Datos', 'Administración de BD'] },
    { id: 'redes', name: 'Redes de Computadores', subjects: ['Protocolos de Red', 'Configuración de Redes', 'Seguridad de Redes'] },
    { id: 'web_dev', name: 'Desarrollo Web', subjects: ['HTML/CSS', 'JavaScript', 'Frameworks Web'] },
    { id: 'mobile_dev', name: 'Desarrollo Móvil', subjects: ['Android', 'iOS', 'React Native'] },
    { id: 'software_eng', name: 'Ingeniería de Software', subjects: ['Metodologías Ágiles', 'Testing', 'Arquitectura de Software'] },
    { id: 'ai_ml', name: 'Inteligencia Artificial', subjects: ['Machine Learning', 'Deep Learning', 'Procesamiento de Datos'] },
    { id: 'cybersecurity', name: 'Ciberseguridad', subjects: ['Seguridad Informática', 'Criptografía', 'Auditoría de Sistemas'] },
    { id: 'cloud_computing', name: 'Computación en la Nube', subjects: ['AWS', 'Azure', 'DevOps'] }
  ];

  constructor(
    private authService: AuthService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadCurrentUser();
    this.updateCurrentDate();
  }

  async loadCurrentUser() {
    this.currentUser = await this.authService.getCurrentUser();
  }

  updateCurrentDate() {
    this.currentDate = new Date().toLocaleString('es-ES');
  }

  async generateQRCode() {
    if (!this.selectedClass || !this.selectedSubject) {
      this.showAlert('Error', 'Por favor selecciona una clase y asignatura');
      return;
    }

    this.isLoading = true;
    this.sessionId = this.generateSessionId();
    this.updateCurrentDate();

    try {
      const qrData = {
        sessionId: this.sessionId,
        professorId: this.currentUser?.uid || this.currentUser?.email,
        professorEmail: this.currentUser?.email,
        class: this.selectedClass,
        subject: this.selectedSubject,
        timestamp: new Date().toISOString(),
        type: 'attendance'
      };

      this.qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      this.showAlert('Éxito', 'Código QR generado exitosamente');
    } catch (error) {
      console.error('Error generating QR code:', error);
      this.showAlert('Error', 'Error al generar el código QR');
    } finally {
      this.isLoading = false;
    }
  }

  generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `session_${timestamp}_${random}`;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async copyToClipboard() {
    if (this.qrCodeUrl) {
      try {
        await navigator.clipboard.writeText(this.sessionId);
        this.showAlert('Éxito', 'ID de sesión copiado al portapapeles');
      } catch (error) {
        this.showAlert('Error', 'No se pudo copiar al portapapeles');
      }
    }
  }

  async downloadQR() {
    if (this.qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `qr_${this.sessionId}.png`;
      link.href = this.qrCodeUrl;
      link.click();
    }
  }

  clearQR() {
    this.qrCodeUrl = '';
    this.sessionId = '';
    this.selectedClass = '';
    this.selectedSubject = '';
  }

  getSelectedClassInfo() {
    return this.classes.find(c => c.id === this.selectedClass);
  }

  getSubjectsForClass() {
    const selectedClass = this.getSelectedClassInfo();
    return selectedClass ? selectedClass.subjects : [];
  }
}
