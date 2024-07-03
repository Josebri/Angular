// En UnlockUserComponent
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-unlock-user',
  templateUrl: './unlock-user.component.html',
  styleUrls: ['./unlock-user.component.css']
})
export class UnlockUserComponent {

  token: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParams['token'];
  }

  async unlockUser() {
    try {
      console.log('Debug: Attempting to unlock user with token:', this.token); // Console.log de depuración

      await this.authService.unlockUser(this.token);
      this.successMessage = 'User unlocked successfully';
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}