import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class ProductSearchComponent {
  searchForm: FormGroup;
  productLocations: any[] = [];
  searchPerformed = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      searchType: ['name', Validators.required],
      searchValue: ['', Validators.required]
    });
  }

  async onSearch(): Promise<void> {
    if (this.searchForm.valid) {
      const { searchType, searchValue } = this.searchForm.value;
      try {
        let data;
        if (searchType === 'name') {
          data = await this.dataService.searchProducts(searchValue, '', '').toPromise();
        } else if (searchType === 'brand') {
          data = await this.dataService.searchProducts('', searchValue, '').toPromise();
        } else if (searchType === 'location') {
          data = await this.dataService.searchProducts('', '', searchValue).toPromise();
        }
        this.productLocations = data;
        this.searchPerformed = true;
      } catch (error) {
        console.error('Search failed', error);
      }
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
