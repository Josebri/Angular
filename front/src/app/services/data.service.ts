import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:3000'; // Asegúrate de que la URL base esté correcta

  constructor() { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async login(username: string, password: string) {
    const url = `${this.baseUrl}/login`;
    const body = { usernameOrEmail: username, password: password };

    try {
      const response = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(userData: any) {
    const url = `${this.baseUrl}/register`;

    try {
      const response = await axios.post(url, userData, { headers: { 'Content-Type': 'application/json' } });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProducts() {
    const url = `${this.baseUrl}/products`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProductById(id: number) {
    const url = `${this.baseUrl}/products/${id}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createProduct(productData: any) {
    const url = `${this.baseUrl}/products`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.post(url, productData, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateProduct(id: number, productData: any) {
    const url = `${this.baseUrl}/products/${id}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.put(url, productData, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteProduct(id: number) {
    const url = `${this.baseUrl}/products/${id}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.delete(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProductLocations(userId: number) {
    const url = `${this.baseUrl}/products/locations/${userId}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async searchProducts(name: string) {
    const url = `${this.baseUrl}/search/products?name=${name}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getLocations() {
    const url = `${this.baseUrl}/locations`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createLocation(locationData: any) {
    const url = `${this.baseUrl}/locations`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.post(url, locationData, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateLocation(id: number, locationData: any) {
    const url = `${this.baseUrl}/locations/${id}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.put(url, locationData, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteLocation(id: number) {
    const url = `${this.baseUrl}/locations/${id}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.delete(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async assignProductToLocation(locationId: number, productId: number, quantity: number) {
    const url = `${this.baseUrl}/locations/${locationId}/products/${productId}`;
    const headers = this.getAuthHeaders();
    const body = { quantity };

    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getLocationProducts(locationId: number) {
    const url = `${this.baseUrl}/locations/${locationId}/products`;
    const headers = this.getAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    throw new Error(error.response?.data?.message || error.message || 'Unknown error');
  }
}
