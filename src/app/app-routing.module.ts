import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';


const routes: Routes = [
  {
     path: '',
     redirectTo: 'landingpage', pathMatch: 'full'
   },
   {
     path: 'login', component: LoginComponent
   },
   {
     path: 'components',
     loadChildren: () => import('./components/components.module').then((m) => m.ComponentsModule),
   },
   {
     path: 'landingpage', component: LandingPageComponent
   }
 ];
 
 @NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
 })
 export class AppRoutingModule { }
