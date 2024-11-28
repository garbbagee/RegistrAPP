import { CanActivateFn } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return afAuth.authState.pipe(
    take(1),
    switchMap(user => {
      if (user) {
        // Aquí usamos 'from' para obtener el documento del usuario desde Firestore
        return from(getDoc(doc(firestore, `usuarios/${user.uid}`))).pipe(
          map(docSnapshot => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              const role = userData['role']; // Acceso seguro al campo 'role'

              if (role === 'profesor') {
                router.navigate(['/inicio']); // Redirige al inicio del profesor
                return true;
              } else if (role === 'alumno') {
                router.navigate(['/inicioAlumno']); // Redirige al inicio del alumno
                return true;
              } else {
                router.navigate(['/home']); // Redirige a login si el rol no es válido
                return false;
              }
            } else {
              router.navigate(['/home']); // Si no se encuentra el usuario, redirige a login
              return false;
            }
          })
        );
      } else {
        router.navigate(['/home']); // Redirige a login si no hay usuario autenticado
        return [false]; // Devuelve un array para mantener el flujo de observables
      }
    })
  );
};
