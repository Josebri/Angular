import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const usernameOrEmail = (target.querySelector('#usernameOrEmail') as HTMLInputElement).value;
    const password = (target.querySelector('#password') as HTMLInputElement).value;

    try {
      const response = await this.authService.login(usernameOrEmail, password);
      // Handle login success
    } catch (error) {
      this.errorMessage = 'Login failed. Please try again.';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToRecoverPassword() {
    this.router.navigate(['/recover-password']);
  }
}
