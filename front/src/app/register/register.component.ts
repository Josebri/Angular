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
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      profile: ['user']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.dataService.register(this.registerForm.value).subscribe(
        response => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration failed', error);
        }
      );
    }
  }
}
