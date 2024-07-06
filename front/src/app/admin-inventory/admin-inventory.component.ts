import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class AdminInventoryComponent implements OnInit {
  productForm: FormGroup;
  products: any[] = [];
  isEditing = false;
  currentProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: [''],
      reorder_quantity: [0, Validators.required],
      image: ['', Validators.required],
      supplier: [''],
      price: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.dataService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.isEditing && this.currentProductId !== null) {
        this.dataService.updateProduct(this.currentProductId, productData).subscribe(
          (updatedProduct) => {
            this.loadProducts();
            this.resetForm();
          },
          (error) => {
            console.error('Update product failed', error);
          }
        );
      } else {
        this.dataService.createProduct(productData).subscribe(
          (newProduct) => {
            this.products.push(newProduct);
            this.resetForm();
          },
          (error) => {
            console.error('Create product failed', error);
          }
        );
      }
    }
  }

  editProduct(product: any): void {
    this.isEditing = true;
    this.currentProductId = product.id;
    this.productForm.patchValue(product);
  }

  deleteProduct(productId: number): void {
    this.dataService.deleteProduct(productId).subscribe(
      () => {
        this.products = this.products.filter((product) => product.id !== productId);
      },
      (error) => {
        console.error('Delete product failed', error);
      }
    );
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.productForm.reset({
      name: '',
      brand: '',
      reorder_quantity: 0,
      image: '',
      supplier: '',
      price: 0
    });
  }

  getImageUrl(imageName: string): string {
    return `assets/images/${imageName}`;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
