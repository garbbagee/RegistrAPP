import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email: string = "";
  password: string = "";
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async login() {
    if (!this.email || !this.password) {
      this.showAlert('Error', 'Por favor completa todos los campos');
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const result = await this.authService.login(this.email, this.password);
      
      // El login fue exitoso si llegamos aquí sin error
      if (result.user?.uid) {
        const userRole = await this.authService.getUserRole(result.user.uid);
        
        // Mostrar alert de éxito primero
        await this.showAlert('Éxito', 'Sesión iniciada correctamente');
        
        // Luego navegar según el rol
        if (userRole === 'profesor') {
          this.router.navigate(['/inicio']);
        } else {
          this.router.navigate(['/inicio-alumno']);
        }
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      const errorMessage = error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      this.showAlert('Error', errorMessage);
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  // Función para llenar automáticamente los campos con usuarios de prueba
  fillTestUser(type: 'student' | 'professor') {
    if (type === 'student') {
      this.email = 'maria.gonzalez@test.com';
      this.password = '123456';
    } else {
      this.email = 'carlos.rodriguez@test.com';
      this.password = '123456';
    }
  }

  // Redirigir al usuario a la página de recuperación de contraseña
  goToRecoverPass() {
    this.router.navigate(['/recoverpass']);
  }

  // Redirigir al usuario a la página de registro
  goToRegister() {
    this.router.navigate(['/register']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
} 