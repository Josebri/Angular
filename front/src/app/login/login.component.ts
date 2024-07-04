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
  loginAttempts: number = 3;

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

      console.log('Debug: Login successful. Response:', response); // Console.log de depuración

      if (response.profile === 'admin') {
        console.log('Debug: Redirecting to admin panel');
        this.router.navigate(['/admin']);
      } else {
        console.log('Debug: Redirecting to user panel');
        this.router.navigate(['/user']);
      }
      this.loginAttempts = 3; // Reset attempts on successful login
    } catch (error: any) {
      this.errorMessage = error.message;
      this.loginAttempts--;
      if (this.loginAttempts <= 0) {
        this.lockUser();
      }
    }
  }

  goToRegister() {
    console.log('Debug: Redirecting to register page');
    this.router.navigate(['/register']);
  }

  goToRecoverPassword() {
    console.log('Debug: Redirecting to recover password page');
    this.router.navigate(['/recover-password']);
  }

  goToUnlockUser() {
    console.log('Debug: Redirecting to unlock user page');
    this.router.navigate(['/unlock-user']);
  }

  lockUser() {
    alert('User is locked due to too many failed login attempts.');
    // Implement logic to lock user
  }
}
