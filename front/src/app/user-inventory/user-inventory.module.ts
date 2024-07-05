import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserInventoryComponent } from './user-inventory.component';

const routes: Routes = [
  { path: '', component: UserInventoryComponent }
];

@NgModule({
  declarations: [UserInventoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserInventoryModule { }
