import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';

interface Product {
  id: number;
  name: string;
  quantity: number;
  brand: string;
}

interface Location {
  id: number;
  name: string;
  quantity: number;
  address: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  locations: Location[] = [];
  filteredProducts: Product[] = [];
  filteredLocations: Location[] = [];

  constructor(
    private productService: ProductService,
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadLocations();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  loadLocations() {
    this.locationService.getLocations().subscribe((locations: Location[]) => {
      this.locations = locations;
      this.filteredLocations = locations;
    });
  }

  addProduct() {
    const productName = (document.getElementById('productName') as HTMLInputElement).value;
    const productQuantity = (document.getElementById('productQuantity') as HTMLInputElement).value;
    const productBrand = (document.getElementById('productBrand') as HTMLInputElement).value;
    const newProduct: Product = { id: 0, name: productName, quantity: +productQuantity, brand: productBrand };
    
    this.productService.addProduct(newProduct).subscribe(() => {
      this.loadProducts();
    });
  }

  editProduct(product: Product) {
    // Implement product editing logic
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }

  filterProducts(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue) ||
      product.brand.toLowerCase().includes(filterValue)
    );
  }

  addLocation() {
    const locationName = (document.getElementById('locationName') as HTMLInputElement).value;
    const locationQuantity = (document.getElementById('locationQuantity') as HTMLInputElement).value;
    const locationAddress = (document.getElementById('locationAddress') as HTMLInputElement).value;
    const newLocation: Location = { id: 0, name: locationName, quantity: +locationQuantity, address: locationAddress };
    
    this.locationService.addLocation(newLocation).subscribe(() => {
      this.loadLocations();
    });
  }

  editLocation(location: Location) {
    // Implement location editing logic
  }

  deleteLocation(locationId: number) {
    this.locationService.deleteLocation(locationId).subscribe(() => {
      this.loadLocations();
    });
  }

  filterLocations(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredLocations = this.locations.filter(location =>
      location.name.toLowerCase().includes(filterValue) ||
      location.address.toLowerCase().includes(filterValue)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
