import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  constructor(
    public route: ActivatedRoute, 
    private router: Router, 
    private loginService: LoginService,
    private uS: UsuariosService) {}

  //Puse lo mismo que el app.component para que pueda validar los roles en un futuro.
  role:string="";
  username: string="";
  id: number = 0;
  colorActivo: any;
  idiomaActivo: any;

  UsuarioAltTitulo:string="Usuarios"
  AltBotonUsuario:string="Listar"


  cerrar() {
    sessionStorage.clear();
    this.router.navigate(['landingpage']);
  }

  iralink(comp1:string,comp2:string){
    this.router.navigate(['components/',comp1,comp2]);
  }

  redirigirYRecargar(ruta: string): void {
    this.router.navigate([ruta]).then(() => {
      // Primera recarga
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Espera 1 segundo

      // Segunda recarga
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Espera 2 segundos desde el inicio
    });
  }

  verificar() {
    return this.loginService.verificar();
  }

  ngOnInit(): void {
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUsername();

    this.uS.list().subscribe(data=>{
      for (let u of data) {if (u.username==this.username) {
        this.id=u.id}}})
  

    if (this.role=='CLIENTE') {
      this.AltBotonUsuario="Editar";
      this.UsuarioAltTitulo="Perfil";}
    };
}
