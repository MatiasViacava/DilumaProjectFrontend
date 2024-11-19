import { CarteraListarComponent } from './cartera/cartera-listar/cartera-listar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioListarComponent } from './usuario/usuario-listar/usuario-listar.component';
import { UsuarioCreaeditaComponent } from './usuario/usuario-creaedita/usuario-creaedita.component';
import { TipoUsuarioComponent } from './tipo-usuario/tipo-usuario.component';
import { TipoUsuarioCreaeditaComponent } from './tipo-usuario/tipo-usuario-creaedita/tipo-usuario-creaedita.component';
import { TipoUsuarioListarComponent } from './tipo-usuario/tipo-usuario-listar/tipo-usuario-listar.component';
import { MenuComponent } from './menu/menu.component';
import { LetraComponent } from './letra/letra.component';
import { LetraCreaeditaComponent } from './letra/letra-creaedita/letra-creaedita.component';
import { LetraListarComponent } from './letra/letra-listar/letra-listar.component';
import { CarteraComponent } from './cartera/cartera.component';
import { CarteraCreaeditaComponent } from './cartera/cartera-creaedita/cartera-creaedita.component';

const routes: Routes = [
{
  path: 'usuarios', component: UsuarioComponent, children: [
    { path: 'listar', component: UsuarioListarComponent },
    { path: 'nuevo', component: UsuarioCreaeditaComponent },
    { path: 'edicion/:id', component: UsuarioCreaeditaComponent}
  ]
},
{
  path: 'tipousuario', component: TipoUsuarioComponent, children: [
    { path: 'nuevo', component: TipoUsuarioCreaeditaComponent },
    { path: 'listar', component: TipoUsuarioListarComponent },
    { path: 'edicion/:idTipoUsuario', component: TipoUsuarioCreaeditaComponent}
  ]
},
{
  path: 'letras', component: LetraComponent, children: [
    { path: 'nuevo', component: LetraCreaeditaComponent },
    { path: 'listar', component: LetraListarComponent },
    { path: 'edicion/:id', component: LetraCreaeditaComponent}
  ]
},
{
  path: 'carteras', component: CarteraComponent, children: [
    { path: 'nuevo', component: CarteraCreaeditaComponent },
    { path: 'listar', component: CarteraListarComponent },
    { path: 'edicion/:id', component: CarteraCreaeditaComponent}
  ]
},
{
  path: 'menu', component: MenuComponent
}
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
