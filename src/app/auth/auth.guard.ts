import { CanActivateFn } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);
  const firestoreService = inject(FirestoreService);
  const authService = inject(AuthService);

  return afAuth.authState.pipe(
    take(1),
    switchMap(user => {
      if (user) {
        // Si el usuario está autenticado en Firebase, verificamos su rol
        return firestoreService.getUserRole(user.uid).pipe(
          map(role => {
            console.log('Usuario autenticado en Firebase:', user.uid, 'Rol:', role);
            return checkRoleAccess(role, state.url, router);
          })
        );
      } else {
        // Si el usuario no está autenticado en Firebase, verificar usuarios de prueba
        const testUser = authService.getCurrentTestUser();
        if (testUser) {
          console.log('Usuario de prueba activo:', testUser.uid);
          // Para usuarios de prueba, permitir acceso a todas las rutas
          return of(true);
        } else {
          // Si no hay usuario autenticado, redirigir al home
          console.log('No hay usuario autenticado, redirigiendo al home');
          router.navigate(['/home']);
          return of(false);
        }
      }
    })
  );
};

function checkRoleAccess(role: string, url: string, router: Router): boolean {
  // Verifica si el usuario es profesor
  if (role === 'profesor') {
    console.log('Usuario es profesor, verificando acceso a:', url);
    // Verificamos si el usuario está tratando de acceder a '/inicio-alumno'
    if (url === '/inicio-alumno') {
      console.log('Redirigiendo a /inicio porque el usuario es profesor');
      router.navigate(['/inicio']);
      return false;
    }
    return true; // Permite acceder a las páginas de profesor
  }

  // Verifica si el usuario es alumno
  if (role === 'alumno') {
    console.log('Usuario es alumno, verificando acceso a:', url);
    // Verificamos si el usuario está tratando de acceder a '/inicio'
    if (url === '/inicio') {
      console.log('Redirigiendo a /inicio-alumno porque el usuario es alumno');
      router.navigate(['/inicio-alumno']);
      return false;
    }
    return true; // Permite acceder a las páginas de alumno
  }

  return false; // Si el rol no es ni profesor ni alumno, no permite el acceso
} 