import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-management',
  templateUrl: './location-management.component.html',
  styleUrls: ['./location-management.component.css'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule]
})
export class LocationManagementComponent implements OnInit {
  locations: any[] = [];
  products: any[] = [];
  locationForm: FormGroup;
  assignForm: FormGroup;
  editingLocation: any = null;
  selectedLocation: any = null;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      address: ['']
    });

    this.assignForm = this.fb.group({
      locationId: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadProducts();
  }

  async loadLocations(): Promise<void> {
    try {
      const data = await this.dataService.getLocations();
      this.locations = data;
    } catch (error) {
      console.error('Failed to load locations', error);
    }
  }

  async loadProducts(): Promise<void> {
    try {
      const data = await this.dataService.getProducts();
      this.products = data;
    } catch (error) {
      console.error('Failed to load products', error);
    }
  }

  onEdit(location: any): void {
    this.editingLocation = location;
    this.locationForm.patchValue(location);
  }

  async onSave(): Promise<void> {
    if (this.editingLocation) {
      try {
        await this.dataService.updateLocation(this.editingLocation.id_location, this.locationForm.value);
        this.loadLocations();
        this.editingLocation = null;
        this.locationForm.reset();
      } catch (error) {
        console.error('Failed to update location', error);
      }
    } else {
      try {
        await this.dataService.createLocation(this.locationForm.value);
        this.loadLocations();
        this.locationForm.reset();
      } catch (error) {
        console.error('Failed to create location', error);
      }
    }
  }

  async onDelete(id: number): Promise<void> {
    try {
      await this.dataService.deleteLocation(id);
      this.loadLocations();
    } catch (error) {
      console.error('Failed to delete location', error);
    }
  }

  async onAssign(): Promise<void> {
    if (this.assignForm.valid) {
      const { locationId, productId, quantity } = this.assignForm.value;
      try {
        await this.dataService.assignProductToLocation(locationId, productId, quantity);
        this.loadLocationProducts(locationId);
      } catch (error) {
        console.error('Failed to assign product to location', error);
      }
    }
  }

  async loadLocationProducts(locationId: number): Promise<void> {
    try {
      const data = await this.dataService.getLocationProducts(locationId);
      const location = this.locations.find(loc => loc.id_location === locationId);
      if (location) {
        location.products = data;
        this.selectedLocation = location;
      } else {
        this.selectedLocation = { products: data };
      }
    } catch (error) {
      console.error('Failed to load location products', error);
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
