import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cartera } from '../models/Cartera';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const base_url=environment.base
@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  private url = `${base_url}/carteras`;
  private listaCambio = new Subject<Cartera[]>();
  constructor(private http: HttpClient) {}

  list() {
    let token = sessionStorage.getItem('token');

    return this.http.get<Cartera[]>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
  insert(de: Cartera) {
    let token = sessionStorage.getItem('token');

    return this.http.post(`${this.url}`, de ,{
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
  setList(listaNueva: Cartera[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  listarId(id: number) {
    let token = sessionStorage.getItem('token');

    return this.http.get<Cartera>(`${this.url}/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
  modificar(de: Cartera) {
    let token = sessionStorage.getItem('token');

    return this.http.put(this.url, de, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
  eliminar(id: number) {
    let token = sessionStorage.getItem('token');

    return this.http.delete(`${this.url}/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
}