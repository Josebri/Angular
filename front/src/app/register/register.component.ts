import { Component } from '@angular/core';
import { Router } from '@angular/router'
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
    const phone = (target.querySelector('#phone') as HTMLInputElement).value;
    const password = (target.querySelector('#password') as HTMLInputElement).value;

    try {
      const response = await this.authService.register({ username, email, phone, password });
      // Handle registration success (e.g., navigate to login page)
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
