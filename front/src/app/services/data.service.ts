import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; // Cambia esto a la URL correcta de tu API

  async register(username: string, email: string, phone: string, profile: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/register`, {
        username,
        email,
        phone,
        profile,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    }
  }

  async login(usernameOrEmail: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, {
        usernameOrEmail,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      throw error; // Re-lanza el error para que sea manejado por el componente que llama a esta función
    }
  }
}
