import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin-dashboard/admin-dashboard.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  { path: 'unlock-user', component: UnlockUserComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirigir a /login por defecto
  { path: '**', redirectTo: '/login' }  // Redirigir a /login para cualquier otra ruta no encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
