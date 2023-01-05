import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AboutComponent } from './components/pages/about/about.component';
import { AuthGuard } from './guards/auth.guard';
import { MantainanceComponent } from './components/pages/mantainance/mantainance.component';
import { ProfileComponent } from './components/shared/profile/profile.component';


import { ManagmentModule } from './components/pages/managment/managment.module';
import { ManageUsersModule } from './components/pages/managment/manage-users/manage-users.module';
import { ManageRolesModule } from './components/pages/managment/manage-roles/manage-roles.module';


const managmentModule = () => import('./components/pages/managment/managment.module').then(x => x.ManagmentModule);

//En todos los componentes que tengan el canActivate se mostrara la barra de navegacion
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', component: LoginComponent },
  { path: 'managment', loadChildren: managmentModule, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'about', component: AboutComponent },
  { path: 'mantainance', component: MantainanceComponent },
  { path: '**', component: LoginComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }),
    ManagmentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
