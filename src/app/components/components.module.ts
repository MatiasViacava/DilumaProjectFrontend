import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsRoutingModule } from './components-routing.module';
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
import { AppComponent } from '../app.component';
import { CarteraComponent } from './cartera/cartera.component';
import { CarteraListarComponent } from './cartera/cartera-listar/cartera-listar.component';
import { CarteraCreaeditaComponent } from './cartera/cartera-creaedita/cartera-creaedita.component';
import { LetraComponent } from './letra/letra.component';
import { LetraListarComponent } from './letra/letra-listar/letra-listar.component';
import { LetraCreaeditaComponent } from './letra/letra-creaedita/letra-creaedita.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioListarComponent } from './usuario/usuario-listar/usuario-listar.component';
import { UsuarioCreaeditaComponent } from './usuario/usuario-creaedita/usuario-creaedita.component';
import { TipoUsuarioComponent } from './tipo-usuario/tipo-usuario.component';
import { TipoUsuarioListarComponent } from './tipo-usuario/tipo-usuario-listar/tipo-usuario-listar.component';
import { TipoUsuarioCreaeditaComponent } from './tipo-usuario/tipo-usuario-creaedita/tipo-usuario-creaedita.component';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    CarteraComponent,
    CarteraListarComponent,
    CarteraCreaeditaComponent,
    LetraComponent,
    LetraListarComponent,
    LetraCreaeditaComponent,
    UsuarioComponent,
    UsuarioListarComponent,
    UsuarioCreaeditaComponent,
    TipoUsuarioComponent,
    TipoUsuarioListarComponent,
    TipoUsuarioCreaeditaComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
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
    HttpClientModule,
    NgChartsModule,
  ]
})


export class ComponentsModule { }

