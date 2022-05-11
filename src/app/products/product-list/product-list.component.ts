import { Component, OnInit } from '@angular/core';
import { MOCK_PRODUCTS } from '../mock-products';
import { Product } from '../product.model';
import { v4 as uuidv4 } from 'uuid';
import { PresentationMode } from 'src/app/shared/common-types';

@Component({
  selector: 'ws-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products = MOCK_PRODUCTS as Product[];
  selectedProduct?: Product;
  mode: PresentationMode = 'present';

  constructor() {}

  ngOnInit(): void {
    this.products = MOCK_PRODUCTS.map(
      (product) =>
        ({
          ...product,
          id: uuidv4(),
        } as Product)
    );
    // console.log(this.products);
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  setMode(mode: PresentationMode) {
    this.mode = mode;
  }
}
