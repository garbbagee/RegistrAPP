import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa Firestore
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore // Inyecta Firestore
  ) { }

  async login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string, role: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid; // Obtiene el UID del usuario recién creado

      // Guarda el usuario en Firestore con el role
      await this.firestore.collection('usuarios').doc(uid).set({
        email: email,
        role: role
      });

      alert("Registrado exitosamente! " + email);
    } catch (error) {
      alert("Error al intentar registrarse! " + error);
    }
  }

  async logout() {
    await this.afAuth.signOut();
  }

  async getUser(): Promise<Observable<any>> {
    return this.afAuth.authState;
  }
}
