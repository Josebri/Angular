import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async recoverPassword(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const email = (target.querySelector('#email') as HTMLInputElement).value;

    try {
      const response = await this.authService.recoverPassword(email);
      // Handle successful password recovery (e.g., show a success message)
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = 'Password recovery failed. Please try again.';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
