import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminInventoryComponent } from './admin-inventory/admin-inventory.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { LocationManagementComponent } from './location-management/location-management.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminInventoryComponent, canActivate: [AuthGuard] },
  { path: 'search', component: ProductSearchComponent, canActivate: [AuthGuard] },
  { path: 'locations', component: LocationManagementComponent, canActivate: [AuthGuard] }
];
