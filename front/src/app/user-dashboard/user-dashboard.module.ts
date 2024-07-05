import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard.component';
import { ProductCrudComponent } from '../product-crud/product-crud.component';
import { LocationCrudComponent } from '../location-crud/location-crud.component';

const routes: Routes = [
  { path: '', component: UserDashboardComponent },
  { path: 'products', component: ProductCrudComponent },
  { path: 'locations', component: LocationCrudComponent }
];

@NgModule({
  declarations: [
    UserDashboardComponent,
    ProductCrudComponent,
    LocationCrudComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserDashboardModule { }
