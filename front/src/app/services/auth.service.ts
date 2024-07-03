import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  async login(usernameOrEmail: string, password: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/login`, { usernameOrEmail, password });
    return response.data;
  }

  async register(user: any): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/register`, user);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || 'An error occurred during registration.');
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }

  async recoverPassword(email: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/recover-password`, { email });
    return response.data;
  }
}
