import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { usernameOrEmail, password });
  }

  getLocations(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/users/locations`, { headers });
  }

  createLocation(location: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/locations`, location, { headers });
  }

  updateLocation(locationId: number, location: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/locations/${locationId}`, location, { headers });
  }

  deleteLocation(locationId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/locations/${locationId}`, { headers });
  }

  assignProductToLocation(locationId: number, productId: number, quantity: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/locations/${locationId}/products/${productId}`, { quantity }, { headers });
  }

  getLocationProducts(locationId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/locations/${locationId}/products`, { headers });
  }

  getProducts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/products`, { headers });
  }

  createProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/products`, product, { headers });
  }

  updateProduct(productId: number, productData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/products/${productId}`, productData, { headers });
  }

  deleteProduct(productId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/products/${productId}`, { headers });
  }

  searchProducts(name?: string, brand?: string, location?: string): Observable<any> {
    const headers = this.getAuthHeaders();
    let url = `${this.baseUrl}/search/products?`;
    const params = [];
    if (name) {
      params.push(`name=${name}`);
    }
    if (brand) {
      params.push(`brand=${brand}`);
    }
    if (location) {
      params.push(`location=${location}`);
    }
    url += params.join('&');
    return this.http.get(url, { headers });
  }
}
