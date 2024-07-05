import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usernameOrEmail: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async login(event: Event) {
    event.preventDefault();  // Prevenir la acción predeterminada del formulario
    const usernameOrEmail = (document.getElementById('usernameOrEmail') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const response = await this.authService.login(usernameOrEmail, password);
      if (response.token) {
        this.router.navigate(['/user-inventory']);  // Redirige a la página de inventario del usuario después del login exitoso
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      this.errorMessage = 'Login failed. Please try again.';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
