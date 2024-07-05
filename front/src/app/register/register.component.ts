import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule]
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
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      profile: ['user']
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      try {
        const response = await this.dataService.register(this.registerForm.value);
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Registration failed', error);
      }
    }
  }
}
