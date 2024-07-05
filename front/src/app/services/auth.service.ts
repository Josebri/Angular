import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000';  // Asegúrate de que esta URL sea correcta

  constructor() {}

  async register(user: any): Promise<any> {
    console.log('Register user data:', user);  // Log the user data to debug

    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    console.log('Register response:', response);  // Log the response to debug

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error text:', errorText);  // Log error text for more details
      throw new Error('Registration failed: ' + errorText);
    }
    return response.json();
  }

  async login(usernameOrEmail: string, password: string): Promise<any> {
    const loginData = { usernameOrEmail, password };
    console.log('Login data:', loginData);  // Log the login data to debug

    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    console.log('Login response:', response);  // Log the response to debug

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error text:', errorText);  // Log error text for more details
      throw new Error('Login failed: ' + errorText);
    }
    return response.json();
  }
}
