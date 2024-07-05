import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ProductCrudComponent } from './product-crud/product-crud.component';
import { LocationCrudComponent } from './location-crud/location-crud.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-dashboard', component: UserDashboardComponent, children: [
      { path: 'products', component: ProductCrudComponent },
      { path: 'locations', component: LocationCrudComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
