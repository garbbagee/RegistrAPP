import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) {}

  // Función para obtener el rol del usuario desde Firestore
  getUserRole(uid: string): Observable<string> {
    console.log('Buscando rol para UID:', uid); // Log para verificar el UID
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map((userData: any) => {
        console.log('Datos del usuario obtenidos:', userData); // Log para ver los datos del usuario
        return userData?.role || 'alumno'; // Si no tiene rol, asignamos 'alumno' por defecto
      })
    );
  }
}
