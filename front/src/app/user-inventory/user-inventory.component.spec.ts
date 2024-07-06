import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-inventory',
  templateUrl: './user-inventory.component.html',
})
export class UserInventoryComponent {
  products: any[] = [];
  locations: any[] = [];

  constructor(private router: Router) {
    this.loadProducts();
    this.loadLocations();
  }

  loadProducts() {
    // Simulate API request
    this.products = [
      { id: 1, name: 'Product 1', price: 10, brand: 'Brand A' },
      { id: 2, name: 'Product 2', price: 20, brand: 'Brand B' },
    ];
  }

  loadLocations() {
    // Simulate API request
    this.locations = [
      { id: 1, name: 'Location 1', address: 'Address 1' },
      { id: 2, name: 'Location 2', address: 'Address 2' },
    ];
  }

  addProduct(product: any) {
    // Simulate API request
    const newProduct = { ...product, id: this.products.length + 1 };
    this.products.push(newProduct);
  }

  updateProduct(product: any) {
    // Simulate API request
    const index = this.products.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.products[index] = product;
    }
  }

  deleteProduct(productId: number) {
    // Simulate API request
    this.products = this.products.filter(p => p.id !== productId);
  }

  addLocation(location: any) {
    // Simulate API request
    const newLocation = { ...location, id: this.locations.length + 1 };
    this.locations.push(newLocation);
  }

  updateLocation(location: any) {
    const index = this.locations.findIndex(l => l.id === location.id);
    if (index > -1) {
      this.locations[index] = location;
    }
  }

  deleteLocation(locationId: number) {
    this.locations = this.locations.filter(l => l.id !== locationId);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
