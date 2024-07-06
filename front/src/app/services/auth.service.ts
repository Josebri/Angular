import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor() {}

  async register(user: any): Promise<any> {
    console.log('Register user data:', user);

    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    console.log('Register response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error text:', errorText);
      throw new Error('Registration failed: ' + errorText);
    }
    return response.json();
  }

  async login(usernameOrEmail: string, password: string): Promise<any> {
    const loginData = { usernameOrEmail, password };
    console.log('Login data:', loginData);

    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    console.log('Login response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error text:', errorText);
      throw new Error('Login failed: ' + errorText);
    }
    return response.json();
  }
}
