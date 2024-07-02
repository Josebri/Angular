import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // Replace with your backend URL

  async login(usernameOrEmail: string, password: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/login`, { usernameOrEmail, password });
    return response.data;
  }

  async register(user: any): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/register`, user);
    return response.data;
  }

  async recoverPassword(email: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/recover-password`, { email });
    return response.data;
  }
}
