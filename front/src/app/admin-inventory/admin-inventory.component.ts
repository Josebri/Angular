// admin-inventory.component.ts

import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service'; // Asegúrate de tener un servicio para las peticiones HTTP

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css']
})
export class AdminInventoryComponent implements OnInit {
  products: any[] = [];
  locations: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadLocations();
  }

  loadProducts(): void {
    this.dataService.getProducts().then(products => {
      this.products = products;
    }).catch(error => {
      console.error('Error loading products:', error);
    });
  }

  loadLocations(): void {
    this.dataService.getLocations().then(locations => {
      this.locations = locations;
    }).catch(error => {
      console.error('Error loading locations:', error);
    });
  }

  showAddProductForm(): void {
    // Lógica para mostrar el formulario de añadir producto
  }

  showUpdateProductForm(product: any): void {
    // Lógica para mostrar el formulario de actualizar producto
  }

  deleteProduct(productId: number): void {
    this.dataService.deleteProduct(productId).then(() => {
      this.loadProducts();
    }).catch(error => {
      console.error('Error deleting product:', error);
    });
  }

  showAddLocationForm(): void {
    // Lógica para mostrar el formulario de añadir ubicación
  }

  showUpdateLocationForm(location: any): void {
    // Lógica para mostrar el formulario de actualizar ubicación
  }

  deleteLocation(locationId: number): void {
    this.dataService.deleteLocation(locationId).then(() => {
      this.loadLocations();
    }).catch(error => {
      console.error('Error deleting location:', error);
    });
  }
}
