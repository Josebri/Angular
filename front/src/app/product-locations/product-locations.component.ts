import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-locations',
  templateUrl: './product-locations.component.html',
  styleUrls: ['./product-locations.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProductLocationsComponent implements OnInit {
  productLocations: any[] = [];
  userId: number;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {
    this.userId = +this.route.snapshot.paramMap.get('userId')!;
  }

  ngOnInit(): void {
    this.loadProductLocations();
  }

  async loadProductLocations(): Promise<void> {
    try {
      const data = await this.dataService.getProductLocations(this.userId);
      this.productLocations = data;
    } catch (error) {
      console.error('Failed to load product locations', error);
    }
  }
}
