import { CanActivateFn } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../services/firestore.service'; // Importa tu servicio de Firestore

export const authGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);
  const firestoreService = inject(FirestoreService); // Inyectamos el servicio

  return afAuth.authState.pipe(
    take(1),
    switchMap(user => {
      if (user) {
        // Si el usuario está autenticado, verificamos su rol
        return firestoreService.getUserRole(user.uid).pipe(
          map(role => {
            // Log para ver qué rol tiene el usuario
            console.log('Usuario autenticado:', user.uid, 'Rol:', role);

            // Verifica si el usuario es profesor
            if (role === 'profesor') {
              console.log('Redirigiendo a inicio para profesor');
              // Verificamos si el usuario está tratando de acceder a '/inicio-alumno'
              if (state.url === '/inicio-alumno') {
                console.log('Redirigiendo a /inicio porque el usuario es profesor');
                router.navigate(['/inicio']); // Redirigimos a la página de inicio del profesor
                return false; // No permite acceder a la página de inicio-alumno
              }
              return true; // Permite acceder a las páginas de profesor
            }

            // Verifica si el usuario es alumno
            if (role === 'alumno') {
              console.log('Redirigiendo a inicio-alumno para alumno');
              // Verificamos si el usuario está tratando de acceder a '/inicio'
              if (state.url === '/inicio') {
                console.log('Redirigiendo a /inicio-alumno porque el usuario es alumno');
                router.navigate(['/inicio-alumno']); // Redirigimos a la página de inicio del alumno
                return false; // No permite acceder a la página de inicio
              }
              return true; // Permite acceder a las páginas de alumno
            }

            return false; // Si el rol no es ni profesor ni alumno, no permite el acceso
          })
        );
      } else {
        // Si el usuario no está autenticado, lo redirige al login
        router.navigate(['/home']);
        return [false]; // Redirige al login
      }
    })
  );
};
