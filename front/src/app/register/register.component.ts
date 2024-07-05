import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const username = (target.querySelector('#username') as HTMLInputElement).value;
    const email = (target.querySelector('#email') as HTMLInputElement).value;
    const password = (target.querySelector('#password') as HTMLInputElement).value;

    const user = { username, email, password };

    try {
      await this.authService.register(user);
      this.router.navigate(['/login']); // Redirigir al login después del registro exitoso
    } catch (error: any) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
