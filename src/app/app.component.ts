import { Component } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tfdiluma';
  role:string="";

  constructor(private loginService: LoginService) {
  }

  cerrar() {
    sessionStorage.clear();
  }

  verificar() {
    this.role=this.loginService.showRole();
    return this.loginService.verificar();
  }

  validarRol(){
    if(this.role=='ADMIN' || this.role=='CLIENTE') {
      return true;
    }else{
      return false;
    }
  }
}