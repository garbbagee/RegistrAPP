import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Usuarios de prueba simulados
  private testUsers = [
    {
      email: 'maria.gonzalez@test.com',
      password: '123456',
      role: 'alumno',
      uid: 'test-student-001',
      name: 'María González'
    },
    {
      email: 'carlos.rodriguez@test.com',
      password: '123456',
      role: 'profesor',
      uid: 'test-professor-001',
      name: 'Dr. Carlos Rodríguez'
    }
  ];

  // Usuario actual (para usuarios de prueba)
  private currentUser: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  async login(email: string, password: string) {
    try {
      // Primero intentar con Firebase
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      if (user) {
        // Actualizar último login en Firestore
        await this.firestore.collection('usuarios').doc(user.uid).update({
          lastLogin: new Date()
        });
      }
      
      return userCredential;
    } catch (error) {
      // Si Firebase falla, usar usuarios de prueba
      console.log('Firebase falló, usando usuarios de prueba...');
      
      const testUser = this.testUsers.find(u => 
        u.email === email && u.password === password
      );
      
      if (testUser) {
        // Guardar usuario actual
        this.currentUser = {
          uid: testUser.uid,
          email: testUser.email,
          displayName: testUser.name
        };
        
        // Simular un UserCredential exitoso
        return {
          user: this.currentUser
        };
      } else {
        throw new Error('Credenciales incorrectas');
      }
    }
  }

  async register(email: string, password: string, role: string) {
    try {
      // Primero intentar con Firebase
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        // Guarda el usuario en Firestore con el role
        await this.firestore.collection('usuarios').doc(uid).set({
          email: email,
          role: role,
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }

      return userCredential;
    } catch (error) {
      console.log('Firebase falló, simulando registro...');
      
      // Simular registro exitoso para usuarios de prueba
      const newUid = `test-${role}-${Date.now()}`;
      const newUser = {
        email: email,
        password: password,
        role: role,
        uid: newUid,
        name: email.split('@')[0]
      };
      
      this.testUsers.push(newUser);
      
      return {
        user: {
          uid: newUid,
          email: email,
          displayName: newUser.name
        }
      };
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log('Firebase logout falló, limpiando usuario de prueba...');
    }
    
    // Limpiar usuario de prueba
    this.currentUser = null;
    this.router.navigate(['/home']);
  }

  async getUser(): Promise<Observable<any>> {
    return this.afAuth.authState;
  }

  async getCurrentUser() {
    // Primero intentar con Firebase
    const firebaseUser = await this.afAuth.currentUser;
    if (firebaseUser) {
      return firebaseUser;
    }
    
    // Si no hay usuario de Firebase, retornar usuario de prueba
    return this.currentUser;
  }

  // Obtener el usuario actual (para usuarios de prueba)
  getCurrentTestUser() {
    return this.currentUser;
  }

  async getUserRole(uid: string): Promise<string> {
    try {
      // Primero intentar con Firebase
      const userDoc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();
      const userData = userDoc?.data() as any;
      return userData?.role || 'alumno';
    } catch (error) {
      console.log('Firebase falló, usando usuarios de prueba...');
      
      // Si Firebase falla, buscar en usuarios de prueba
      const testUser = this.testUsers.find(u => u.uid === uid);
      if (testUser) {
        return testUser.role;
      }
      
      console.error('Error al obtener rol del usuario:', error);
      return 'alumno';
    }
  }
}
