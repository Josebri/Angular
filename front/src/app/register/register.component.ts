import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      profile: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      try {
        const response = await this.dataService.register(
          this.registerForm.value.username,
          this.registerForm.value.email,
          this.registerForm.value.phone,
          this.registerForm.value.profile,
          this.registerForm.value.password
        );
        console.log('Registration successful', response);
        this.router.navigate(['/login']); // Redirigir a la página de login después del registro exitoso
      } catch (error) {
        console.error('Registration failed', error);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
