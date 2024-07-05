import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule]
})
export class AdminInventoryComponent implements OnInit {
  products: any[] = [];
  productForm: FormGroup;
  editingProduct: any = null;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: [''],
      reorder_quantity: [0, Validators.required],
      image: [''],
      supplier: [''],
      price: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      const data = await this.dataService.getProducts();
      if (data.message) {
        console.log(data.message);
        this.products = []; // No hay productos
      } else {
        this.products = data;
      }
    } catch (error) {
      console.error('Failed to load products', error);
    }
  }

  onEdit(product: any): void {
    this.editingProduct = product;
    this.productForm.patchValue(product);
  }

  async onSave(): Promise<void> {
    if (this.editingProduct) {
      try {
        await this.dataService.updateProduct(this.editingProduct.id, this.productForm.value);
        this.loadProducts();
        this.editingProduct = null;
        this.productForm.reset();
      } catch (error) {
        console.error('Failed to update product', error);
      }
    } else {
      try {
        await this.dataService.createProduct(this.productForm.value);
        this.loadProducts();
        this.productForm.reset();
      } catch (error) {
        console.error('Failed to create product', error);
      }
    }
  }

  async onDelete(id: number): Promise<void> {
    try {
      await this.dataService.deleteProduct(id);
      this.loadProducts();
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
