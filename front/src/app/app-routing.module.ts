import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminInventoryComponent } from './admin-inventory/admin-inventory.component';
import { RegisterComponent } from './register/register.component'; // Importa el componente de registro si existe
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminInventoryComponent },
  { path: 'login', component: LoginComponent }, // Ruta para la página de login
  { path: 'admin', component: AdminInventoryComponent, canActivate: [AuthGuard] }, // Ruta para la página de registro, asegúrate de importar el componente correcto
  // Otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
