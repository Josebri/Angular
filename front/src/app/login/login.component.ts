import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      try {
        const response = await this.dataService.login(
          this.loginForm.value.username,
          this.loginForm.value.password
        );

        console.log('Login successful', response);

        // Guardar el token en el almacenamiento local
        localStorage.setItem('token', response.token);

        // Verificar el perfil del usuario
        if (response.profile === 'admin') {
          // Redirigir a la ruta de administrador
          this.router.navigate(['/admin']);
        } else {
          // Redirigir a otra ruta para usuarios normales
          this.router.navigate(['/home']); // Ajusta según tus necesidades
        }
      } catch (error) {
        console.error('Login failed', error);
      }
    }
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }
}
