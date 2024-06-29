import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from './services/data.service'; // Asegúrate de importar el servicio correcto

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private dataService: DataService) {}

  canActivate(): boolean {
    const currentUser = this.dataService.getCurrentUser();
    if (currentUser && currentUser.profile === 'admin') {
      return true;
    } else {
      this.router.navigate(['/']); // Redirigir a la página de login si no es admin
      return false;
    }
  }
}
