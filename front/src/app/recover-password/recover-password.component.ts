// En RecoverPasswordComponent
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {

  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  async recoverPassword() {
    try {
      console.log('Debug: Attempting to recover password for email:', this.email); // Console.log de depuración

      await this.authService.recoverPassword(this.email);
      this.successMessage = 'Password recovery email sent';
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}