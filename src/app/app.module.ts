import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import{ MatTableModule} from '@angular/material/table'
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule} from '@angular/material/core'
import { MatPaginatorModule} from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import{ MatIconModule} from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CarteraComponent } from './components/cartera/cartera.component';
import { CarteraListarComponent } from './components/cartera/cartera-listar/cartera-listar.component';
import { CarteraCreaeditaComponent } from './components/cartera/cartera-creaedita/cartera-creaedita.component';
import { LetraComponent } from './components/letra/letra.component';
import { LetraListarComponent } from './components/letra/letra-listar/letra-listar.component';
import { LetraCreaeditaComponent } from './components/letra/letra-creaedita/letra-creaedita.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioListarComponent } from './components/usuario/usuario-listar/usuario-listar.component';
import { UsuarioCreaeditaComponent } from './components/usuario/usuario-creaedita/usuario-creaedita.component';
import { TipoUsuarioComponent } from './components/tipo-usuario/tipo-usuario.component';
import { TipoUsuarioListarComponent } from './components/tipo-usuario/tipo-usuario-listar/tipo-usuario-listar.component';
import { TipoUsuarioCreaeditaComponent } from './components/tipo-usuario/tipo-usuario-creaedita/tipo-usuario-creaedita.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

@NgModule({
  declarations: [
    LoginComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
