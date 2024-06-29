import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; // Cambia esto a la URL correcta de tu API
  private currentUser: any = null;

  constructor() {}

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
      if (response.data) {
        this.setCurrentUser(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      throw error;
    }
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  setCurrentUser(user: any): void {
    this.currentUser = user;
  }

  async getProducts(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/admin/products`);
      return response.data;
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    }
  }

  async getLocations(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/admin/locations`);
      return response.data;
    } catch (error) {
      console.error('Error loading locations:', error);
      throw error;
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/admin/products/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async deleteLocation(locationId: number): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/admin/locations/${locationId}`);
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }

  async addProduct(product: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/admin/products`, product);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  async updateProduct(productId: number, product: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/admin/products/${productId}`, product);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async addLocation(location: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/admin/locations`, location);
      return response.data;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  }

  async updateLocation(locationId: number, location: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/admin/locations/${locationId}`, location);
      return response.data;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }
}
