import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  email:string = "";
  password:string = "";
  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit() {}
  async login(){
    try {
      await this.authService.login(this.email,this.password);
      alert("Logueado exitosamente!");
      this.router.navigate(["/inicio"])
    } catch (error) {
      alert("Error al intentar loguearse!"+error)
    }
  }

  async register(){
    try {
      await this.authService.register(this.email,this.password);
      alert("Registrado exitosamente!"+this.email);
    } catch (error) {
      alert("Error al intentar registrarse!"+error)
    }
  }


  
}


