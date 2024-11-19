import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuarios } from '../models/Usuarios';
import { EMPTY,Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = `${base_url}/usuarios`;
  private ListaCambio = new Subject<Usuarios[]>();
  constructor(private smvohttp: HttpClient) {}
  list() {
    let token = sessionStorage.getItem('token');

    return this.smvohttp.get<Usuarios[]>(this.url/*, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    }*/);
  }
  insert(smvoIn: Usuarios) {
    let token = sessionStorage.getItem('token');

    return this.smvohttp.post(`${this.url}`, smvoIn/*, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    }*/);
  }
  setList(ListaNueva: Usuarios[]) {

    this.ListaCambio.next(ListaNueva);
  }
  getList() {

    return this.ListaCambio.asObservable();
  }
  listarId(id: number) {
    let token = sessionStorage.getItem('token');

    return this.smvohttp.get<Usuarios>(`${this.url}/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
  eliminar(id: number) {
    let token = sessionStorage.getItem('token');

    return this.smvohttp.delete(`${this.url}/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
  modificar(de: Usuarios) {
    let token = sessionStorage.getItem('token');

    return this.smvohttp.put(this.url, de, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  
  //Devolver último usuario creado
  ultimousuariocreado() {
    let token = sessionStorage.getItem('token');

      return this.smvohttp.get<number>(`${this.url}/ultimousuariocreado`/*, {
        headers: new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json'),
  }*/);
}

  //Actualiza el usuario sin crear conflictos en la tabla de tipo usuario

  actualizarusuario(id:number,username:string,password:string,enabled:boolean,nombres:string,apellidos:string,correo:string,dni:string,telefono:string){
    let token = sessionStorage.getItem('token');
  
    return this.smvohttp.get<number>(`${this.url}/actualizar/${id}/${username}/${password}/${enabled}/${nombres}/${apellidos}/${correo}/${dni}/${telefono}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
});
}
}
