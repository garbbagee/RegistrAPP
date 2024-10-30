import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth:AngularFireAuth) { }
  async login(email:string,password:string){
    return this.afAuth.signInWithEmailAndPassword(email,password);
  }
  async register(email:string,password:string){
    return this.afAuth.createUserWithEmailAndPassword(email,password);

  }
  async logout (){
    this.afAuth.signOut();
  }
  async getUser(): Promise<Observable<any>> {
    return this.afAuth.authState; // Devuelve el estado de autenticación
  }

  
}
